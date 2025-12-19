import "./style.css";
import { onEvent } from "@core/events";
import { withBasePath } from "@core/utils";
import {
  getAchievementsConfig,
  getGameConfigs,
  getRegistry,
  getThemes,
  ThemeConfig,
} from "@config";
import { ALEX_SECRET, attachProgressionListener, canAccessAlexPage, getProgressionSnapshot } from "@progression";
import { exportSave, importSave, resetGameSave, resetSave, updateSave } from "@storage";
import {
  connectCloud,
  getAuthState,
  loadCloudSave,
  saveCloud,
  subscribe as subscribeCloud,
  uploadAvatarImage,
  removeAvatarImage,
} from "@storage/cloud";
import type { SaveState } from "@storage";

type Tab = "hub" | "achievements" | "stats" | "profile";

const app = document.getElementById("app")!;
const registry = getRegistry();
const achievementsConfig = getAchievementsConfig();
const gameConfigs = getGameConfigs();
const themes = getThemes();
const basePath = import.meta.env.BASE_URL || "/";

let activeTab: Tab = "hub";
let snapshot = getProgressionSnapshot();
let lastLevel = snapshot.save.globalLevel;
let cloudState = getAuthState();
let searchTerm = "";
let categoryFilter = "all";
let favoritesOnly = false;
let profileAvatarFile: File | null = null;
let profileAvatarPreview: string | null = null;
let profileAvatarReset = false;

function formatCloudIdentity(): string {
  const user = cloudState.user as any;
  if (!user) return "connecté";
  const metaId = user.user_metadata?.identifier;
  const email = user.email as string | undefined;
  if (metaId) return metaId;
  if (email?.endsWith("@user.local")) return email.replace("@user.local", "");
  return email || "connecté";
}

function getAvatarHelperText(hasImage: boolean) {
  if (hasImage) return "Image stockée sur Supabase. L'emoji reste disponible en secours.";
  if (!cloudState.ready) return "Supabase non configuré (.env).";
  if (!cloudState.user) return "Connecte-toi au cloud pour utiliser une image. Emoji disponible hors-ligne.";
  return "Choisis une image, elle sera envoyée sur Supabase.";
}

attachProgressionListener();
applyTheme(findTheme(registry.hubTheme));

subscribeCloud((state) => {
  cloudState = state;
  renderHub();
});

onEvent("ACHIEVEMENT_UNLOCKED", (event) => {
  const achievementId = event.payload?.achievementId;
  const achievement = achievementsConfig.achievements.find((a) => a.id === achievementId);
  if (achievement) {
    showToast(`Succès débloqué : ${achievement.title}`, "success");
  }
  if (achievementId === ALEX_SECRET.achievementId) {
    refresh();
  }
});

function findTheme(id?: string): ThemeConfig | undefined {
  if (id) return themes.find((t) => t.id === id);
  return themes[0];
}

function applyTheme(theme?: ThemeConfig) {
  if (!theme) return;
  const root = document.documentElement.style;
  root.setProperty("--color-primary", theme.colors.primary);
  root.setProperty("--color-secondary", theme.colors.secondary);
  root.setProperty("--color-accent", theme.colors.accent);
  root.setProperty("--color-bg", theme.colors.background);
  root.setProperty("--color-surface", theme.colors.surface);
  root.setProperty("--color-text", theme.colors.text);
  root.setProperty("--color-muted", theme.colors.muted);
  if (theme.gradient) {
    root.setProperty("--hero-gradient", theme.gradient);
  }
}

function showToast(message: string, variant: "success" | "error" | "info" = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${variant}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function formatDate(timestamp?: number) {
  if (!timestamp) return "Jamais";
  return new Date(timestamp).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function formatDuration(ms?: number) {
  if (!ms) return "0m";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function mostPlayedGameTitle(save: SaveState): { title: string; duration: string } {
  const entries = Object.entries(save.games || {});
  if (!entries.length) return { title: "Aucun jeu", duration: "0m" };
  const [id, game] = entries.sort((a, b) => (b[1].timePlayedMs || 0) - (a[1].timePlayedMs || 0))[0];
  const reg = registry.games.find((g) => g.id === id);
  return { title: reg?.title || id, duration: formatDuration(game.timePlayedMs) };
}

function renderAvatar(url?: string | null, emoji?: string) {
  const safeEmoji = (emoji || "🎮").slice(0, 4);
  return `<div class="avatar ${url ? "has-image" : ""}">${
    url ? `<img src="${url}" alt="Avatar" />` : safeEmoji
  }</div>`;
}

function profileAvatarUrl() {
  if (profileAvatarReset) return null;
  return profileAvatarPreview || snapshot.save.playerProfile.avatarUrl || null;
}

function clearProfileAvatarPreview() {
  if (profileAvatarPreview) {
    URL.revokeObjectURL(profileAvatarPreview);
    profileAvatarPreview = null;
  }
}

function refreshProfileAvatarPreviewDom() {
  const previewEl = document.getElementById("profile-avatar-preview");
  const helper = document.getElementById("profile-avatar-helper");
  const clearBtn = document.getElementById("profile-avatar-clear") as HTMLButtonElement | null;
  const url = profileAvatarUrl();
  const emoji = snapshot.save.playerProfile.avatar || "🎮";
  const hasImage = Boolean(url);

  if (previewEl) {
    previewEl.classList.toggle("has-image", hasImage);
    previewEl.innerHTML = hasImage ? `<img src="${url}" alt="Avatar" />` : emoji;
  }
  if (helper) helper.textContent = getAvatarHelperText(hasImage);
  if (clearBtn) clearBtn.disabled = !hasImage;
}

function handleProfileChange(name: string, avatar: string) {
  const trimmedName = name.trim() || "Joueur";
  const trimmedAvatar = avatar.trim() || "🎮";
  const enforcedName = cloudState.user ? snapshot.save.playerProfile.name : trimmedName;
  updateSave((state) => {
    state.playerProfile.name = enforcedName.slice(0, 18);
    state.playerProfile.avatar = trimmedAvatar.slice(0, 4);
    state.playerProfile.avatarType = state.playerProfile.avatarUrl ? "image" : "emoji";
  });
  refresh();
}

function handleExport() {
  const data = exportSave();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nintendo-hub-save.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Sauvegarde exportée", "success");
}

function handleImport(text: string) {
  const result = importSave(text);
  if (result.success) {
    showToast("Import réussi", "success");
    clearProfileAvatarPreview();
    profileAvatarFile = null;
    profileAvatarReset = false;
    refresh();
  } else {
    showToast(result.error || "Import impossible", "error");
  }
}

function handleReset(gameId?: string) {
  if (gameId) {
    resetGameSave(gameId);
    showToast(`Progression de ${gameId} réinitialisée`, "info");
  } else {
    resetSave();
    showToast("Progression globale réinitialisée", "info");
  }
  clearProfileAvatarPreview();
  profileAvatarFile = null;
  profileAvatarReset = false;
  refresh();
}

function toggleFavorite(gameId: string) {
  updateSave((state) => {
    const current = new Set(state.favorites || []);
    if (current.has(gameId)) {
      current.delete(gameId);
    } else {
      current.add(gameId);
    }
    state.favorites = Array.from(current);
  });
  refresh();
}

async function handleCloudSaveAction() {
  const current = getProgressionSnapshot();
  const ok = await saveCloud(current.save);
  if (ok) {
    snapshot = current;
    showToast("Sauvegarde envoyée sur le cloud", "success");
  } else if (cloudState.error) {
    showToast(cloudState.error, "error");
  }
}

async function handleCloudLoadAction() {
  const res = await loadCloudSave();
  if (res?.state) {
    importSave(JSON.stringify(res.state));
    showToast("Sauvegarde cloud importée", "success");
    clearProfileAvatarPreview();
    profileAvatarFile = null;
    profileAvatarReset = false;
    refresh();
  } else if (res?.error) {
    showToast(res.error, "error");
  }
}

function renderNav() {
  return `
    <nav class="nav">
      <button class="nav-btn ${activeTab === "hub" ? "active" : ""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${activeTab === "achievements" ? "active" : ""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${activeTab === "stats" ? "active" : ""}" data-tab="stats">Stats</button>
      <button class="nav-btn ${activeTab === "profile" ? "active" : ""}" data-tab="profile">Profil</button>
    </nav>
  `;
}

function renderAlexBanner(save: SaveState) {
  if (!canAccessAlexPage(save)) return "";
  const alexLink = withBasePath("/apps/alex/", basePath);
  return `
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${alexLink}">Ouvrir la page</a>
    </div>
  `;
}

function renderAuthGate() {
  return `
    <div class="layout">
      <header class="card hero auth-gate">
        <div class="hero-glow"></div>
        <div class="hero-top">
          <div class="profile">
            <div class="avatar">🎮</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>Connexion requise</h1>
              <p class="muted">Compte cloud obligatoire pour accéder au hub et lancer les jeux. Identifiant + mot de passe (pas d'email nécessaire).</p>
              <div class="chips">
                <span class="chip ${cloudState.ready ? "warning" : "error"}">Cloud : ${
                  cloudState.ready ? "non connecté" : "Supabase non configuré"
                }</span>
                <span class="chip ghost">Saves verrouillées</span>
              </div>
            </div>
          </div>
        </div>
        ${
          cloudState.ready
            ? `<div class="gate-form">
                 <label>Identifiant <input id="gate-identifier" type="text" placeholder="mon-pseudo" /></label>
                 <label>Mot de passe <input id="gate-password" type="password" placeholder="8+ caractères" /></label>
                 <div class="gate-actions">
                   <button class="btn primary strong" id="gate-login" ${cloudState.loading ? "disabled" : ""}>Connexion</button>
                   <button class="btn ghost strong" id="gate-register" ${cloudState.loading ? "disabled" : ""}>Créer un compte</button>
                 </div>
                 ${
                   cloudState.error
                     ? `<p class="status error">${cloudState.error}</p>`
                     : `<p class="status info">Tes saves seront synchronisées entre appareils.</p>`
                 }
               </div>`
            : `<p class="status error">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY puis recharge la page.</p>`
        }
      </header>
    </div>
  `;
}

function renderHero() {
  const save = snapshot.save;
  const unlocked = save.achievementsUnlocked.length;
  const total = achievementsConfig.achievements.length;
  const levelUp = save.globalLevel > lastLevel;
  const xpBarStyle = `--progress:${snapshot.levelProgress * 100}%`;
  const totalTime = formatDuration(save.globalStats.timePlayedMs);
  const sessionCount = save.globalStats.totalSessions;
  const lastGame =
    save.playerProfile.lastPlayedGameId &&
    registry.games.find((g) => g.id === save.playerProfile.lastPlayedGameId)?.title;
  lastLevel = save.globalLevel;
  const mostPlayed = mostPlayedGameTitle(save);
  const cloudBadge = cloudState.user
    ? `<span class="chip success">Cloud : ${formatCloudIdentity()}</span>`
    : cloudState.ready
      ? `<span class="chip ghost">Mode invité · données locales</span>`
      : `<span class="chip warning">Supabase non configuré (.env)</span>`;

  return `
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          ${renderAvatar(save.playerProfile.avatarUrl, save.playerProfile.avatar)}
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${save.playerProfile.name || "Joueur"}</h1>
            <p class="muted">${lastGame ? `Dernier jeu : ${lastGame}` : "Aucun jeu lancé"}</p>
            <div class="chips">
              ${cloudBadge}
              <span class="chip">⏱ ${totalTime}</span>
              <span class="chip">🎮 ${sessionCount} sessions</span>
              <button class="btn primary strong profile-inline" id="open-profile">Voir le profil</button>
            </div>
          </div>
        </div>
        <div class="stat-grid compact">
          <div class="stat-card">
            <p class="label">Niveau</p>
            <strong>${save.globalLevel}</strong>
            <p class="muted small">${save.globalXP} XP</p>
          </div>
          <div class="stat-card">
            <p class="label">Succès</p>
            <strong>${unlocked}/${total}</strong>
            <p class="muted small">Schema v${save.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${totalTime}</strong>
            <p class="muted small">Sessions ${sessionCount}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${mostPlayed.title}</strong>
            <p class="muted small">Temps ${mostPlayed.duration}</p>
          </div>
        </div>
      </div>
      ${renderAlexBanner(save)}
      <div class="level-row ${levelUp ? "level-up" : ""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${xpBarStyle}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(snapshot.levelProgress * 100)}% · ${
          snapshot.nextLevelXP - save.globalXP
        } XP restants</div>
      </div>
      <p class="muted small hero-note">Profil éditable depuis la page dédiée.</p>
    </header>
  `;
}

function renderGameGrid() {
  const errors: string[] = registry.games.length ? [] : ["games.registry.json vide ou invalide"];
  const favorites = new Set(snapshot.save.favorites || []);
  const categories = Array.from(
    new Set(registry.games.flatMap((g) => g.tags || []).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "fr"));

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const safeSearch = searchTerm.replace(/"/g, "&quot;");
  const filtered = registry.games
    .filter((game) => (favoritesOnly ? favorites.has(game.id) : true))
    .filter((game) => {
      if (categoryFilter === "all") return true;
      return (game.tags || []).includes(categoryFilter);
    })
    .filter((game) => {
      if (!normalizedSearch) return true;
      return (
        game.title.toLowerCase().includes(normalizedSearch) ||
        game.description.toLowerCase().includes(normalizedSearch) ||
        game.id.toLowerCase().includes(normalizedSearch)
      );
    })
    .sort((a, b) => {
      const favDelta = Number(favorites.has(b.id)) - Number(favorites.has(a.id));
      if (favDelta !== 0) return favDelta;
      return (a.order ?? 0) - (b.order ?? 0);
    });

  const cards = filtered
    .map((game) => {
      const config = gameConfigs.find((cfg) => cfg.id === game.id);
      if (!config) {
        errors.push(`Config manquante pour ${game.id}`);
      }
      const save = snapshot.save.games[game.id];
      const lastPlayed = save?.lastPlayedAt ? formatDate(save.lastPlayedAt) : "Jamais";
      const bestScore = save?.bestScore ?? null;
      const timePlayed = formatDuration(save?.timePlayedMs);
      const gameLink = withBasePath(`/apps/games/${game.id}/`, basePath);
      const isFavorite = favorites.has(game.id);
      return `
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${game.previewEmoji || "🎮"} ${game.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${isFavorite ? "active" : ""}" data-game="${
                game.id
              }" title="${isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}">
                ${isFavorite ? "★" : "☆"}
              </button>
              <span class="muted">MAJ ${game.lastUpdated || "N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${game.description}</p>
          <div class="tags">${game.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${timePlayed}</span>
            <span class="chip ghost">🏆 ${bestScore ?? "—"}</span>
            <span class="chip ghost">🕘 ${lastPlayed}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${gameLink}" data-game="${game.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${game.id}">Aide</button>
          </div>
        </article>
      `;
    })
    .join("");

  const filterActive = favoritesOnly || categoryFilter !== "all" || Boolean(normalizedSearch);
  const matchCount = filtered.length;

  const errorBox = errors.length
    ? `<div class="alert">Configs manquantes : ${errors.join(", ")}</div>`
    : "";

  return `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Catalogue</p>
          <h2>Choisis ton mini-jeu</h2>
        </div>
      </div>
      <div class="filters">
        <div class="filter search">
          <span class="search-icon">🔎</span>
          <input
            id="search-games"
            type="text"
            placeholder="Rechercher un jeu par nom ou description…"
            value="${safeSearch}"
          />
        </div>
        <div class="filter group">
          <button class="chip-btn ${categoryFilter === "all" ? "active" : ""}" data-category="all">Toutes</button>
          ${categories
            .map(
              (cat) =>
                `<button class="chip-btn ${cat === categoryFilter ? "active" : ""}" data-category="${cat}">${cat}</button>`,
            )
            .join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${favoritesOnly ? "active" : ""}" id="filter-fav">
            ★ Favoris ${favorites.size ? `<span class="badge">${favorites.size}</span>` : ""}
          </button>
          <span class="muted small">${matchCount}/${registry.games.length} jeux</span>
          ${
            filterActive
              ? `<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>`
              : ""
          }
        </div>
      </div>
      ${errorBox}
      <div class="grid">${cards || "<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `;
}

function renderAchievements() {
  const unlocked = new Set(snapshot.save.achievementsUnlocked);
  const list = achievementsConfig.achievements
    .map((ach) => {
      const isUnlocked = unlocked.has(ach.id);
      return `
        <article class="card achievement ${isUnlocked ? "unlocked" : ""}">
          <div class="pill accent">${ach.icon || "⭐️"}</div>
          <div>
            <h3>${ach.title}</h3>
            <p>${ach.description}</p>
            <p class="muted">${describeCondition(ach)}</p>
          </div>
          <div class="reward">+${ach.rewardXP ?? 0} XP</div>
        </article>
      `;
    })
    .join("");

  return `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${unlocked.size} / ${achievementsConfig.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${list}</div>
    </section>
  `;
}

function describeCondition(achievement: (typeof achievementsConfig.achievements)[number]) {
  const c = achievement.condition as any;
  if (c.type === "eventCount") return `${c.count}x ${c.event}`;
  if (c.type === "xpReached") return `${c.xp} XP globaux`;
  if (c.type === "gamesPlayed") return `${c.count} jeux différents`;
  if (c.type === "streak") return `${c.count} ${c.event} d'affilée`;
  if (c.type === "playerXpName") return `${c.xp} XP et pseudo "${c.name}"`;
  return "";
}

function renderCloudPanel() {
  if (!cloudState.ready) {
    return `
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Supabase</h2>
            <p class="muted">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer la synchro.</p>
          </div>
          <span class="chip warning">Inactif</span>
        </div>
      </section>
    `;
  }

  if (cloudState.user) {
    return `
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Connecté</h2>
            <p class="muted">Identifiant : ${formatCloudIdentity()}</p>
          </div>
          <span class="chip ghost">Dernière sync ${cloudState.lastSyncedAt ? formatDate(cloudState.lastSyncedAt) : "Jamais"}</span>
        </div>
        <div class="actions wrap">
          <button class="btn primary" id="cloud-save" ${cloudState.loading ? "disabled" : ""}>Sauvegarder vers cloud</button>
          <button class="btn ghost" id="cloud-load" ${cloudState.loading ? "disabled" : ""}>Charger depuis cloud</button>
          <button class="btn ghost danger" id="cloud-logout" ${cloudState.loading ? "disabled" : ""}>Déconnexion</button>
        </div>
        ${
          cloudState.message
            ? `<p class="status ok">${cloudState.message}</p>`
            : `<p class="status info">Synchronise tes saves entre appareils.</p>`
        }
        ${cloudState.error ? `<p class="status error">${cloudState.error}</p>` : ""}
      </section>
    `;
  }

  return `
    <section class="card cloud">
      <div class="section-head">
        <div>
          <p class="eyebrow">Cloud</p>
          <h2>Supabase</h2>
          <p class="muted small">Créé pour rester optionnel : invité/local ou compte cloud.</p>
        </div>
      </div>
      <div class="profile-form two-cols">
        <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
        <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
      </div>
      <div class="actions wrap">
        <button class="btn primary" id="cloud-login" ${cloudState.loading ? "disabled" : ""}>Connexion</button>
        <button class="btn ghost" id="cloud-register" ${cloudState.loading ? "disabled" : ""}>Créer un compte</button>
      </div>
      ${
        cloudState.error
          ? `<p class="status error">${cloudState.error}</p>`
          : `<p class="status info">Aucune donnée n'est envoyée sans action manuelle.</p>`
      }
    </section>
  `;
}

function renderStats() {
  const save = snapshot.save;
  const gamesEntries = Object.entries(save.games || {});
  const maxTime = Math.max(
    1,
    ...gamesEntries.map(([, game]) => Math.max(game.timePlayedMs ?? 0, 1)),
  );
  const achievementsUnlocked = save.achievementsUnlocked.length;
  const totalAchievements = achievementsConfig.achievements.length;
  const lastPlayed = gamesEntries
    .map(([id, game]) => ({ id, last: game.lastPlayedAt || 0 }))
    .sort((a, b) => b.last - a.last)[0];
  const lastPlayedTitle =
    lastPlayed && lastPlayed.last
      ? registry.games.find((g) => g.id === lastPlayed.id)?.title || lastPlayed.id
      : "Aucun jeu";
  const gameBars =
    gamesEntries.length === 0
      ? "<p class='muted'>Pas encore de données de jeu.</p>"
      : gamesEntries
          .map(([id, game]) => {
            const title = registry.games.find((g) => g.id === id)?.title || id;
            const percent = Math.max(
              5,
              Math.round(((game.timePlayedMs || 0) / maxTime) * 100),
            );
            return `
            <div class="chart-row">
              <div>
                <strong>${title}</strong>
                <p class="muted small">${formatDuration(game.timePlayedMs)} · ${
                  game.bestScore ? `Best ${game.bestScore}` : "Aucun score"
                } · ${game.lastPlayedAt ? formatDate(game.lastPlayedAt) : "Jamais"}</p>
              </div>
              <div class="chart-bar">
                <span style="width:${percent}%"></span>
              </div>
            </div>
          `;
          })
          .join("");

  return `
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Stats</p>
          <h2>Vue d'ensemble</h2>
          <p class="muted">Activité, temps de jeu et progression globale.</p>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat-card">
          <p class="label">Temps total</p>
          <strong>${formatDuration(save.globalStats.timePlayedMs)}</strong>
          <p class="muted small">${save.globalStats.totalSessions} sessions</p>
        </div>
        <div class="stat-card">
          <p class="label">Jeux joués</p>
          <strong>${Object.keys(save.games).length}/${registry.games.length}</strong>
          <p class="muted small">Dernier : ${lastPlayedTitle}</p>
        </div>
        <div class="stat-card">
          <p class="label">Succès</p>
          <strong>${achievementsUnlocked}/${totalAchievements}</strong>
          <p class="muted small">Schema v${save.schemaVersion}</p>
        </div>
        <div class="stat-card">
          <p class="label">Jeu le plus joué</p>
          <strong>${mostPlayedGameTitle(save).title}</strong>
          <p class="muted small">${mostPlayedGameTitle(save).duration}</p>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Temps par jeu</p>
          <h2>Répartition</h2>
          <p class="muted">Temps passé, scores et derniers lancements.</p>
        </div>
      </div>
      <div class="chart-list">
        ${gameBars}
      </div>
    </section>
  `;
}

function renderProfileTab() {
  const save = snapshot.save;
  const games = Object.entries(save.games || {});
  const mostPlayed = mostPlayedGameTitle(save);
  const lastSync = cloudState.lastSyncedAt ? formatDate(cloudState.lastSyncedAt) : "Jamais";
  const lastPlayed =
    save.playerProfile.lastPlayedGameId &&
    registry.games.find((g) => g.id === save.playerProfile.lastPlayedGameId)?.title;
  const avatarUrl = profileAvatarUrl();
  const helper = getAvatarHelperText(Boolean(avatarUrl));

  return `
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Profil</p>
          <h2>Identité & avatar</h2>
          <p class="muted small">Pseudo lié au compte cloud. Emoji modifiable, image stockée sur Supabase.</p>
        </div>
        <span class="chip ghost">Sync : ${lastSync}</span>
      </div>
      <div class="profile-identity">
        <div class="avatar-panel">
          <div class="avatar ${avatarUrl ? "has-image" : ""}" id="profile-avatar-preview">
            ${avatarUrl ? `<img src="${avatarUrl}" alt="Avatar" />` : save.playerProfile.avatar || "🎮"}
          </div>
          <p class="muted small" id="profile-avatar-helper">${helper}</p>
          <label class="file-drop">
            <input type="file" id="profile-avatar-upload" accept="image/*" />
            <strong>Image Supabase</strong>
            <span class="muted small">PNG/JPG · 1.5 Mo max</span>
          </label>
          <button class="btn ghost danger" id="profile-avatar-clear" type="button" ${
            avatarUrl ? "" : "disabled"
          }>Revenir à l'emoji</button>
        </div>
        <div class="profile-form two-cols">
          <label>Pseudo <input id="player-name" value="${save.playerProfile.name}" disabled /></label>
          <label>Avatar (emoji) <input id="player-avatar" value="${save.playerProfile.avatar || "🎮"}" maxlength="4" /></label>
          <div class="actions-grid">
            <button class="btn primary" id="profile-save" type="button">Enregistrer</button>
            <button class="btn ghost" id="export-save" type="button">Exporter JSON</button>
          </div>
          <div class="info-grid">
            <div>
              <span class="label">Dernier jeu</span>
              <strong>${lastPlayed || "Aucun jeu lancé"}</strong>
            </div>
            <div>
              <span class="label">Jeu le plus joué</span>
              <strong>${mostPlayed.title}</strong>
              <p class="muted small">${mostPlayed.duration}</p>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${save.globalStats.totalSessions}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card cloud">
      <div class="section-head">
        <div>
          <p class="eyebrow">Cloud</p>
          <h2>Supabase</h2>
          <p class="muted small">Sauvegarde manuelle sur ton compte connecté.</p>
        </div>
        <span class="chip success">Connecté : ${formatCloudIdentity()}</span>
      </div>
      <div class="actions-grid">
        <button class="btn primary" id="cloud-save" ${cloudState.loading ? "disabled" : ""}>Sauvegarder vers cloud</button>
        <button class="btn ghost" id="cloud-load" ${cloudState.loading ? "disabled" : ""}>Charger depuis cloud</button>
        <button class="btn ghost danger" id="cloud-logout" ${cloudState.loading ? "disabled" : ""}>Déconnexion</button>
      </div>
      <p class="muted small">Dernière synchro : ${lastSync}</p>
      ${
        cloudState.message
          ? `<p class="status ok">${cloudState.message}</p>`
          : `<p class="status info">Tes données locales sont synchronisées sur demande.</p>`
      }
      ${cloudState.error ? `<p class="status error">${cloudState.error}</p>` : ""}
    </section>

    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Sauvegardes locales</p>
          <h2>Export / Import</h2>
          <p class="muted small">Exporter, importer ou remettre à zéro la progression locale.</p>
        </div>
        <button class="btn ghost danger" id="reset-save" type="button">Reset global</button>
      </div>
      <label class="import">
        <span class="label">Import JSON</span>
        <textarea id="import-text" placeholder="Colle ici ton export JSON"></textarea>
        <button class="btn primary" id="import-btn" type="button">Importer</button>
      </label>
      <div class="save-meta">
        <div>
          <span class="label">Temps global</span>
          <strong>${formatDuration(save.globalStats.timePlayedMs)}</strong>
        </div>
        <div>
          <span class="label">Jeux joués</span>
          <strong>${Object.keys(save.games).length}/${registry.games.length}</strong>
        </div>
        <div>
          <span class="label">Succès</span>
          <strong>${save.achievementsUnlocked.length}/${achievementsConfig.achievements.length}</strong>
        </div>
      </div>
      <div class="save-list">
        ${
          games.length
            ? games
                .map(
                  ([id, game]) => `
          <div class="save-row">
            <div>
              <strong>${id}</strong>
              <p class="muted small">v${game.saveSchemaVersion} · Dernier : ${formatDate(game.lastPlayedAt)}</p>
            </div>
            <div class="chips-row">
              <span class="chip ghost">⏱ ${formatDuration(game.timePlayedMs)}</span>
              <span class="chip ghost">🏆 ${game.bestScore ?? "—"}</span>
            </div>
          </div>
        `,
                )
                .join("")
            : "<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"
        }
      </div>
    </section>
  `;
}

function renderHub() {
  if (!cloudState.user) {
    app.innerHTML = renderAuthGate();
    wireAuthGate();
    return;
  }

  app.innerHTML = `
    <div class="layout">
      ${renderNav()}
      ${renderHero()}
      ${activeTab === "hub" ? renderGameGrid() : ""}
      ${activeTab === "achievements" ? renderAchievements() : ""}
      ${activeTab === "stats" ? renderStats() : ""}
      ${activeTab === "profile" ? renderProfileTab() : ""}
    </div>
  `;

  wireEvents();
}

function wireAuthGate() {
  const loginBtn = document.getElementById("gate-login");
  const registerBtn = document.getElementById("gate-register");

  loginBtn?.addEventListener("click", async () => {
    const identifier =
      (document.getElementById("gate-identifier") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("gate-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("login", { identifier, password });
  });

  registerBtn?.addEventListener("click", async () => {
    const identifier =
      (document.getElementById("gate-identifier") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("gate-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("register", { identifier, password });
  });
}

function wireEvents() {
  document.querySelectorAll<HTMLButtonElement>(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab as Tab;
      renderHub();
    });
  });

  const openProfile = document.getElementById("open-profile");
  openProfile?.addEventListener("click", () => {
    activeTab = "profile";
    renderHub();
  });

  const nameInput = document.getElementById("player-name") as HTMLInputElement | null;
  const avatarInput = document.getElementById("player-avatar") as HTMLInputElement | null;
  if (nameInput && avatarInput && activeTab !== "profile") {
    nameInput.addEventListener("change", () =>
      handleProfileChange(nameInput.value, avatarInput?.value || "🎮"),
    );
    avatarInput.addEventListener("change", () =>
      handleProfileChange(nameInput?.value || "Joueur", avatarInput.value),
    );
  }

  document.querySelectorAll<HTMLButtonElement>(".help-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.help!;
      const config = gameConfigs.find((g) => g.id === id);
      if (config) {
        showToast(config.uiText.help, "info");
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".favorite-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.game;
      if (id) toggleFavorite(id);
    });
  });

  const exportBtn = document.getElementById("export-save");
  exportBtn?.addEventListener("click", handleExport);

  const resetBtn = document.getElementById("reset-save");
  resetBtn?.addEventListener("click", () => handleReset());

  document.querySelectorAll<HTMLButtonElement>(".reset-game").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.game!;
      handleReset(id);
    });
  });

  const importBtn = document.getElementById("import-btn");
  const importText = document.getElementById("import-text") as HTMLTextAreaElement | null;
  importBtn?.addEventListener("click", () => importText && handleImport(importText.value));

  const loginBtn = document.getElementById("cloud-login");
  const registerBtn = document.getElementById("cloud-register");
  const logoutBtn = document.getElementById("cloud-logout");
  const cloudSaveBtn = document.getElementById("cloud-save");
  const cloudLoadBtn = document.getElementById("cloud-load");

  loginBtn?.addEventListener("click", async () => {
    const identifier =
      (document.getElementById("cloud-identifier") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("login", { identifier, password });
  });
  registerBtn?.addEventListener("click", async () => {
    const identifier =
      (document.getElementById("cloud-identifier") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("register", { identifier, password });
  });
  logoutBtn?.addEventListener("click", async () => {
    await connectCloud("logout");
    profileAvatarFile = null;
    profileAvatarReset = false;
    clearProfileAvatarPreview();
  });
  cloudSaveBtn?.addEventListener("click", handleCloudSaveAction);
  cloudLoadBtn?.addEventListener("click", handleCloudLoadAction);

  const avatarUpload = document.getElementById("profile-avatar-upload") as HTMLInputElement | null;
  const avatarClear = document.getElementById("profile-avatar-clear") as HTMLButtonElement | null;
  const profileSave = document.getElementById("profile-save");

  avatarUpload?.addEventListener("change", (event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Seules les images sont autorisées.", "error");
      input.value = "";
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      showToast("Image trop lourde (1.5 Mo max).", "error");
      input.value = "";
      return;
    }
    clearProfileAvatarPreview();
    profileAvatarFile = file;
    profileAvatarPreview = URL.createObjectURL(file);
    profileAvatarReset = false;
    refreshProfileAvatarPreviewDom();
  });

  avatarClear?.addEventListener("click", () => {
    profileAvatarReset = true;
    profileAvatarFile = null;
    clearProfileAvatarPreview();
    refreshProfileAvatarPreviewDom();
  });

  profileSave?.addEventListener("click", async () => {
    const emojiInput = document.getElementById("player-avatar") as HTMLInputElement | null;
    const nextEmoji = (emojiInput?.value || "🎮").slice(0, 4);

    const previousPath = snapshot.save.playerProfile.avatarStoragePath;
    let nextAvatarUrl = snapshot.save.playerProfile.avatarUrl;
    let nextAvatarPath = previousPath;

    if (profileAvatarFile) {
      const upload = await uploadAvatarImage(profileAvatarFile, previousPath || undefined);
      if (!upload.url || !upload.path || upload.error) {
        showToast(upload.error || "Upload avatar impossible", "error");
        return;
      }
      nextAvatarUrl = upload.url;
      nextAvatarPath = upload.path;
    } else if (profileAvatarReset) {
      nextAvatarUrl = undefined;
      nextAvatarPath = undefined;
      if (previousPath && cloudState.ready && cloudState.user) {
        await removeAvatarImage(previousPath);
      }
    }

    updateSave((state) => {
      state.playerProfile.avatar = nextEmoji;
      state.playerProfile.avatarUrl = nextAvatarUrl;
      state.playerProfile.avatarStoragePath = nextAvatarPath;
      state.playerProfile.avatarType = nextAvatarUrl ? "image" : "emoji";
    });

    profileAvatarFile = null;
    profileAvatarReset = false;
    clearProfileAvatarPreview();
    showToast("Profil mis à jour", "success");
    refresh();
  });

  const searchInput = document.getElementById("search-games") as HTMLInputElement | null;
  const favoritesBtn = document.getElementById("filter-fav");
  const categoryChips = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".chip-btn[data-category]"),
  );
  const clearBtn = document.getElementById("clear-filters");

  searchInput?.addEventListener("input", () => {
    searchTerm = searchInput.value;
    renderHub();
  });

  categoryChips.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryFilter = btn.dataset.category || "all";
      renderHub();
    });
  });

  favoritesBtn?.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;
    renderHub();
  });

  clearBtn?.addEventListener("click", () => {
    searchTerm = "";
    categoryFilter = "all";
    favoritesOnly = false;
    renderHub();
  });

  refreshProfileAvatarPreviewDom();
}

function refresh() {
  snapshot = getProgressionSnapshot();
  applyTheme(findTheme(registry.hubTheme));
  renderHub();
}

renderHub();
