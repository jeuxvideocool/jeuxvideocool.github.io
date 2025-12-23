import "./style.css";
import { onEvent } from "@core/events";
import { withBasePath } from "@core/utils";
import {
  getAchievementsConfig,
  getGameConfigs,
  getRegistry,
  getThemes,
  getXPConfig,
  ThemeConfig,
} from "@config";
import { ALEX_SECRET, attachProgressionListener, canAccessAlexPage, getProgressionSnapshot } from "@progression";
import { exportSave, importSave, resetGameSave, resetSave, updateSave } from "@storage";
import {
  connectCloud,
  getAvatarPublicUrl,
  getAuthState,
  requestCloudResetSync,
  saveCloud,
  syncCloudToLocal,
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
let snapshot: ReturnType<typeof getProgressionSnapshot>;
let lastLevel = 1;
let hasSnapshot = false;
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
  if (hasImage) return "Image stockée sur Supabase.";
  if (!cloudState.ready) return "Supabase non configuré (.env).";
  if (!cloudState.user) return "Connecte-toi au cloud pour utiliser une image.";
  return "Choisis une image, elle sera envoyée sur Supabase.";
}

attachProgressionListener();
applyTheme(findTheme(registry.hubTheme));

subscribeCloud((state) => {
  cloudState = state;
  refresh();
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function shortLabel(value: string) {
  return value.trim().slice(0, 3).toUpperCase();
}

type ChartPoint = { x: number; y: number };

function buildLineChart(values: number[], progressIndex?: number) {
  if (values.length < 2) return null;
  const safeValues = values.map((value) => (Number.isFinite(value) ? value : 0));
  const width = 100;
  const height = 42;
  const padding = 4;
  const max = Math.max(...safeValues, 1);
  const min = Math.min(...safeValues, 0);
  const range = max - min || 1;
  const step = (width - padding * 2) / Math.max(1, safeValues.length - 1);

  const points: ChartPoint[] = safeValues.map((value, index) => {
    const x = padding + step * index;
    const ratio = (value - min) / range;
    const y = padding + (height - padding * 2) * (1 - ratio);
    return { x, y };
  });

  const pointString = points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  const area = `${padding},${height - padding} ${pointString} ${width - padding},${height - padding}`;

  const targetIndex = progressIndex === undefined ? points.length - 1 : progressIndex;
  const clampedIndex = Math.max(0, Math.min(targetIndex, points.length - 1));
  const baseIndex = Math.floor(clampedIndex);
  const fraction = clampedIndex - baseIndex;
  const progressPoints = points.slice(0, baseIndex + 1);
  if (fraction > 0 && baseIndex < points.length - 1) {
    const start = points[baseIndex];
    const end = points[baseIndex + 1];
    progressPoints.push({
      x: start.x + (end.x - start.x) * fraction,
      y: start.y + (end.y - start.y) * fraction,
    });
  }
  const progress = progressPoints
    .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(" ");
  const marker = progressPoints[progressPoints.length - 1];

  return { points: pointString, area, progress, marker };
}

function renderCurveChart(
  chart: ReturnType<typeof buildLineChart>,
  idPrefix: string,
) {
  if (!chart) {
    return `<div class="chart-empty">Pas encore assez de données.</div>`;
  }

  return `
    <div class="curve-chart">
      <svg viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="${idPrefix}-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--chart-primary)" />
            <stop offset="100%" stop-color="var(--chart-secondary)" />
          </linearGradient>
          <linearGradient id="${idPrefix}-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--chart-primary)" stop-opacity="0.35" />
            <stop offset="100%" stop-color="var(--chart-primary)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polyline class="chart-line base" points="${chart.points}" />
        <polygon class="chart-area" points="${chart.area}" fill="url(#${idPrefix}-fill)" />
        <polyline class="chart-line progress" points="${chart.progress}" stroke="url(#${idPrefix}-line)" />
        <circle class="chart-marker" cx="${chart.marker.x}" cy="${chart.marker.y}" r="2.6" />
      </svg>
    </div>
  `;
}

function mostPlayedGameTitle(save: SaveState): { title: string; duration: string } {
  const entries = Object.entries(save.games || {});
  if (!entries.length) return { title: "Aucun jeu", duration: "0m" };
  const [id, game] = entries.sort((a, b) => (b[1].timePlayedMs || 0) - (a[1].timePlayedMs || 0))[0];
  const reg = registry.games.find((g) => g.id === id);
  return { title: reg?.title || id, duration: formatDuration(game.timePlayedMs) };
}

function isAbsoluteAvatarUrl(value: string) {
  return /^https?:\/\//i.test(value) || value.startsWith("blob:") || value.startsWith("data:");
}

function resolveAvatarUrl(url?: string | null, storagePath?: string | null) {
  if (url) {
    const trimmed = url.trim();
    if (isAbsoluteAvatarUrl(trimmed)) return trimmed;
    const path = storagePath || trimmed;
    return getAvatarPublicUrl(path) || null;
  }
  return getAvatarPublicUrl(storagePath) || null;
}

function renderAvatar(url?: string | null, emoji?: string, storagePath?: string | null) {
  const safeEmoji = (emoji || "🎮").slice(0, 4);
  const resolvedUrl = resolveAvatarUrl(url, storagePath);
  return `<div class="avatar ${resolvedUrl ? "has-image" : ""}">${
    resolvedUrl ? `<img src="${resolvedUrl}" alt="Avatar" />` : safeEmoji
  }</div>`;
}

function profileAvatarUrl() {
  if (profileAvatarReset) return null;
  const savedUrl = resolveAvatarUrl(
    snapshot.save.playerProfile.avatarUrl,
    snapshot.save.playerProfile.avatarStoragePath,
  );
  return profileAvatarPreview || savedUrl;
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

async function handleImport(text: string) {
  const result = importSave(text);
  if (result.success) {
    showToast("Import réussi", "success");
    clearProfileAvatarPreview();
    profileAvatarFile = null;
    profileAvatarReset = false;
    refresh();
    if (cloudState.user) {
      try {
        const ok = await saveCloud(snapshot.save, { allowEmpty: true });
        showToast(ok ? "Sauvegarde cloud remplacée" : cloudState.error || "Erreur cloud", ok ? "success" : "error");
      } catch (err) {
        console.error("Cloud save failed after import", err);
        showToast("Erreur cloud", "error");
      }
    } else if (cloudState.ready) {
      showToast("Connecte-toi pour envoyer l'import sur le cloud", "info");
    }
  } else {
    showToast(result.error || "Import impossible", "error");
  }
}

function handleReset(gameId?: string) {
  requestCloudResetSync();
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
  const ok = await syncCloudToLocal();
  if (ok) {
    showToast("Sauvegarde cloud importée", "success");
    clearProfileAvatarPreview();
    profileAvatarFile = null;
    profileAvatarReset = false;
    refresh();
  } else if (cloudState.error) {
    showToast(cloudState.error, "error");
  } else {
    showToast("Import cloud impossible", "error");
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

function renderSyncGate() {
  return `
    <div class="layout">
      <header class="card hero auth-gate">
        <div class="hero-glow"></div>
        <div class="hero-top">
          <div class="profile">
            <div class="avatar">☁️</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>Synchronisation cloud en cours</h1>
              <p class="muted">Chargement de ta sauvegarde avant d'accéder au hub.</p>
              <div class="chips">
                <span class="chip accent">Sauvegarde cloud</span>
                <span class="chip ghost">${cloudState.loading ? "Chargement..." : "En attente"}</span>
              </div>
            </div>
          </div>
        </div>
        ${cloudState.error ? `<p class="status error">${cloudState.error}</p>` : ""}
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
  const displayName = cloudState.user ? formatCloudIdentity() : save.playerProfile.name || "Joueur";
  const heroSubtitle = lastGame ? `Dernier jeu : ${lastGame}` : "Aucun jeu lancé";

  return `
    <header class="card hero hero-premium">
      <div class="hero-glow"></div>
      <div class="hero-top hero-premium-top">
        <div class="profile hero-profile">
          ${renderAvatar(
            save.playerProfile.avatarUrl,
            save.playerProfile.avatar,
            save.playerProfile.avatarStoragePath,
          )}
          <div class="hero-identity">
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${displayName}</h1>
            <p class="hero-subtitle">${heroSubtitle}</p>
            <div class="hero-badges">
              <span class="hero-badge">⏱ ${totalTime}</span>
              <span class="hero-badge">🎮 ${sessionCount} sessions</span>
            </div>
          </div>
        </div>
        <div class="stat-grid compact hero-stats">
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
      <div class="level-row hero-progress ${levelUp ? "level-up" : ""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${xpBarStyle}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(snapshot.levelProgress * 100)}% · ${
          snapshot.nextLevelXP - save.globalXP
        } XP restants</div>
      </div>
      <p class="muted small hero-note">Profil accessible via l'onglet Profil.</p>
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
  const total = achievementsConfig.achievements.length;
  const progress = total ? Math.round((unlocked.size / total) * 100) : 0;
  const message = snapshot.save.playerProfile.achievementMessage || "";
  const safeMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  const previewMessage = message.trim() ? safeMessage : "Ecris un message pour Alexiane.";
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
          <p class="muted">${unlocked.size} / ${total} débloqués</p>
        </div>
        <div class="pill accent">✨ ${progress}%</div>
      </div>
      <div class="achievement-spotlight">
        <div class="card achievement-message">
          <div class="card-top">
            <div>
              <p class="eyebrow">Message perso</p>
              <h3>Pour Alexiane</h3>
              <p class="muted small">Un mot doux qui s'affiche dans la collection.</p>
            </div>
            <span class="chip ghost">Privé</span>
          </div>
          <textarea id="achievement-note" placeholder="Alexiane, ...">${safeMessage}</textarea>
          <div class="message-preview">
            <span class="label">Aperçu</span>
            <p id="achievement-note-preview">${previewMessage}</p>
          </div>
        </div>
        <div class="card achievement-progress">
          <p class="eyebrow">Progression</p>
          <h3>${unlocked.size} succès</h3>
          <div class="progress-ring" style="--progress:${progress}">
            <span>${progress}%</span>
          </div>
          <p class="muted small">${total} objectifs pour une collection premium.</p>
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
          <p class="muted small">Sauvegarde cloud obligatoire : Supabase est la source de vérité.</p>
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
          : `<p class="status info">Connecte-toi pour charger ta sauvegarde cloud.</p>`
      }
    </section>
  `;
}

function renderStats() {
  const save = snapshot.save;
  const gamesEntries = Object.entries(save.games || {});
  const games = gamesEntries.map(([id, game]) => {
    const title = registry.games.find((g) => g.id === id)?.title || id;
    return {
      id,
      title,
      timePlayedMs: game.timePlayedMs ?? 0,
      bestScore: game.bestScore,
      xpEarned: game.xpEarned ?? 0,
      lastPlayedAt: game.lastPlayedAt ?? 0,
    };
  });
  const gamesPlayed = games.length;
  const totalTimeMs = save.globalStats.timePlayedMs ?? 0;
  const totalSessions = save.globalStats.totalSessions ?? 0;
  const avgSessionMs = totalSessions ? totalTimeMs / totalSessions : 0;
  const wins = save.globalStats.events["SESSION_WIN"] ?? 0;
  const fails = save.globalStats.events["SESSION_FAIL"] ?? 0;
  const winRate = wins + fails > 0 ? Math.round((wins / (wins + fails)) * 100) : 0;
  const achievementsUnlocked = save.achievementsUnlocked.length;
  const totalAchievements = achievementsConfig.achievements.length;
  const achievementRate = totalAchievements
    ? Math.round((achievementsUnlocked / totalAchievements) * 100)
    : 0;
  const bestStreak = Math.max(0, ...Object.values(save.globalStats.streaks || {}));
  const gamesByTime = [...games].sort((a, b) => b.timePlayedMs - a.timePlayedMs);
  const lastPlayed = [...games]
    .filter((game) => game.lastPlayedAt)
    .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)[0];
  const lastPlayedTitle = lastPlayed?.title || "Aucun jeu";
  const lastPlayedDate = lastPlayed?.lastPlayedAt ? formatDate(lastPlayed.lastPlayedAt) : "Jamais";
  const mostPlayed = mostPlayedGameTitle(save);

  const xpConfig = getXPConfig();
  const levels = [...xpConfig.levels].sort((a, b) => a.level - b.level);
  const levelValues = levels.map((level) => level.requiredXP);
  const currentLevelIndex = Math.max(
    0,
    levels.findIndex((level) => level.level === save.globalLevel),
  );
  const xpProgressIndex = currentLevelIndex + snapshot.levelProgress;
  const xpChart = buildLineChart(levelValues, xpProgressIndex);
  const xpProgressPercent = Math.round(snapshot.levelProgress * 100);
  const xpToNext = Math.max(0, snapshot.nextLevelXP - save.globalXP);

  const recentGames = [...games]
    .filter((game) => game.lastPlayedAt)
    .sort((a, b) => a.lastPlayedAt - b.lastPlayedAt)
    .slice(-8);
  const activityGames =
    recentGames.length >= 2
      ? recentGames
      : gamesByTime.filter((game) => game.timePlayedMs > 0).slice(0, 8);
  const activityValues = activityGames.map((game) => game.timePlayedMs);
  const activityChart = buildLineChart(activityValues);
  const activityHint = recentGames.length >= 2 ? "Derniers jeux lancés" : "Top temps de jeu";
  const activityLabels = activityGames.length
    ? `<div class="curve-labels">
        ${activityGames
          .map((game) => `<span title="${game.title}">${shortLabel(game.title)}</span>`)
          .join("")}
      </div>`
    : "";

  const gameTimeTotal = games.reduce((sum, game) => sum + game.timePlayedMs, 0);
  const topGames = gamesByTime.filter((game) => game.timePlayedMs > 0).slice(0, 5);
  const topTime = topGames.reduce((sum, game) => sum + game.timePlayedMs, 0);
  const otherTime = Math.max(0, gameTimeTotal - topTime);
  const palette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
  ];

  let donutStyle = "";
  let donutLegend = "";
  if (gameTimeTotal > 0 && topGames.length) {
    let cursor = 0;
    const segments = topGames.map((game, index) => {
      const pct = (game.timePlayedMs / gameTimeTotal) * 100;
      const start = cursor;
      cursor += pct;
      return `${palette[index % palette.length]} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
    });
    if (otherTime > 0) {
      segments.push(`var(--chart-6) ${cursor.toFixed(2)}% 100%`);
    }
    donutStyle = `style="--donut: conic-gradient(${segments.join(", ")})"`;
    donutLegend = topGames
      .map((game, index) => {
        const pct = Math.round((game.timePlayedMs / gameTimeTotal) * 100);
        return `
          <div class="legend-item">
            <span class="legend-dot" style="--dot:${palette[index % palette.length]}"></span>
            <div>
              <strong>${game.title}</strong>
              <p class="muted small">${formatDuration(game.timePlayedMs)} · ${pct}%</p>
            </div>
          </div>
        `;
      })
      .join("");
    if (otherTime > 0) {
      const pct = Math.round((otherTime / gameTimeTotal) * 100);
      donutLegend += `
        <div class="legend-item">
          <span class="legend-dot" style="--dot:var(--chart-6)"></span>
          <div>
            <strong>Autres</strong>
            <p class="muted small">${formatDuration(otherTime)} · ${pct}%</p>
          </div>
        </div>
      `;
    }
  } else {
    donutLegend = `<p class="muted">Pas encore de temps de jeu enregistré.</p>`;
    donutStyle = `style="--donut: conic-gradient(rgba(255, 255, 255, 0.08) 0 100%)"`;
  }

  const xpEntries = [...games]
    .filter((game) => game.xpEarned > 0)
    .sort((a, b) => b.xpEarned - a.xpEarned)
    .slice(0, 6);
  const maxXP = Math.max(1, ...xpEntries.map((game) => game.xpEarned));
  const scoreRows = xpEntries.length
    ? xpEntries
        .map((game) => {
          const xp = game.xpEarned;
          const percent = Math.max(6, Math.round((xp / maxXP) * 100));
          return `
            <div class="score-row">
              <div class="score-info">
                <strong>${game.title}</strong>
                <span class="muted small">${formatDuration(game.timePlayedMs)} joués</span>
              </div>
              <div class="score-bar"><span style="width:${percent}%"></span></div>
              <div class="score-value">${formatNumber(xp)} XP</div>
            </div>
          `;
        })
        .join("")
    : `<p class="muted">Aucune XP enregistrée pour le moment.</p>`;

  return `
    <section class="card stats-kpi">
      <div class="section-head">
        <div>
          <p class="eyebrow">Stats</p>
          <h2>Dashboard KPI</h2>
          <p class="muted">Vue globale, progression et performance par jeu.</p>
        </div>
        <div class="kpi-badges">
          <span class="chip ghost">Dernier : ${lastPlayedTitle}</span>
          <span class="chip ghost">Dernière activité : ${lastPlayedDate}</span>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card" style="--kpi-accent: var(--chart-1)">
          <div class="kpi-top">
            <span class="kpi-icon">⏱</span>
            <span class="kpi-label">Temps total</span>
          </div>
          <strong>${formatDuration(totalTimeMs)}</strong>
          <p class="muted small">Session moyenne ${formatDuration(avgSessionMs)}</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-2)">
          <div class="kpi-top">
            <span class="kpi-icon">🎮</span>
            <span class="kpi-label">Sessions</span>
          </div>
          <strong>${formatNumber(totalSessions)}</strong>
          <p class="muted small">${wins} victoires · ${fails} défaites</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-3)">
          <div class="kpi-top">
            <span class="kpi-icon">⚡</span>
            <span class="kpi-label">XP globale</span>
          </div>
          <strong>${formatNumber(save.globalXP)} XP</strong>
          <p class="muted small">Niveau ${save.globalLevel} · ${xpProgressPercent}%</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-4)">
          <div class="kpi-top">
            <span class="kpi-icon">🧩</span>
            <span class="kpi-label">Jeux joués</span>
          </div>
          <strong>${gamesPlayed}/${registry.games.length}</strong>
          <p class="muted small">Top : ${mostPlayed.title}</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-5)">
          <div class="kpi-top">
            <span class="kpi-icon">🏆</span>
            <span class="kpi-label">Succès</span>
          </div>
          <strong>${achievementsUnlocked}/${totalAchievements}</strong>
          <p class="muted small">${achievementRate}% complétés</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-6)">
          <div class="kpi-top">
            <span class="kpi-icon">📈</span>
            <span class="kpi-label">Performance</span>
          </div>
          <strong>${winRate}%</strong>
          <p class="muted small">Streak max ${bestStreak}</p>
        </div>
      </div>
    </section>

    <section class="card stats-curves">
      <div class="section-head">
        <div>
          <p class="eyebrow">Progression</p>
          <h2>Courbes de progression</h2>
          <p class="muted">XP, niveaux et rythme d'activité.</p>
        </div>
      </div>
      <div class="curve-grid">
        <article class="curve-card" style="--chart-primary: var(--color-primary); --chart-secondary: var(--color-secondary)">
          <div class="curve-head">
            <div>
              <h3>Niveaux & XP</h3>
              <p class="muted small">Prochain niveau : ${formatNumber(snapshot.nextLevelXP)} XP</p>
            </div>
            <span class="chip ghost">+${formatNumber(xpToNext)} XP</span>
          </div>
          ${renderCurveChart(xpChart, "xp-curve")}
          <div class="curve-metrics">
            <div>
              <span class="label">XP globale</span>
              <strong>${formatNumber(save.globalXP)}</strong>
            </div>
            <div>
              <span class="label">Progression</span>
              <strong>${xpProgressPercent}%</strong>
            </div>
            <div>
              <span class="label">Niveau</span>
              <strong>${save.globalLevel}</strong>
            </div>
          </div>
        </article>
        <article class="curve-card" style="--chart-primary: var(--color-accent); --chart-secondary: var(--color-primary)">
          <div class="curve-head">
            <div>
              <h3>Rythme d'activité</h3>
              <p class="muted small">${activityHint}</p>
            </div>
            <span class="chip ghost">${winRate}% win</span>
          </div>
          ${renderCurveChart(activityChart, "activity-curve")}
          ${activityLabels}
          <div class="curve-metrics">
            <div>
              <span class="label">Sessions</span>
              <strong>${formatNumber(totalSessions)}</strong>
            </div>
            <div>
              <span class="label">Temps total</span>
              <strong>${formatDuration(totalTimeMs)}</strong>
            </div>
            <div>
              <span class="label">Jeu top</span>
              <strong>${mostPlayed.title}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="card stats-diagrams">
      <div class="section-head">
        <div>
          <p class="eyebrow">Jeux</p>
          <h2>Diagrammes & XP</h2>
          <p class="muted">Répartition des jeux les plus joués et XP générée.</p>
        </div>
      </div>
      <div class="diagram-grid">
        <article class="diagram-card">
          <div class="diagram-head">
            <div>
              <h3>Jeux les plus joués</h3>
              <p class="muted small">${gamesPlayed} jeux actifs</p>
            </div>
          </div>
          <div class="donut-wrap">
            <div class="donut" ${donutStyle}></div>
            <div class="donut-center">
              <span class="label">Temps total</span>
              <strong>${formatDuration(totalTimeMs)}</strong>
              <p class="muted small">${gamesPlayed} jeux</p>
            </div>
          </div>
          <div class="donut-legend">
            ${donutLegend}
          </div>
        </article>
        <article class="diagram-card">
          <div class="diagram-head">
            <div>
              <h3>XP générée</h3>
              <p class="muted small">Top jeux par XP gagnée.</p>
            </div>
          </div>
          <div class="score-list">
            ${scoreRows}
          </div>
        </article>
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
          <p class="muted small">Sauvegarde cloud (source de vérité) liée à ton compte.</p>
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
          : `<p class="status info">Synchronisation cloud active.</p>`
      }
      ${cloudState.error ? `<p class="status error">${cloudState.error}</p>` : ""}
    </section>

    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Sauvegardes</p>
          <h2>Export / Import</h2>
          <p class="muted small">Exporter, importer ou remettre à zéro ta progression.</p>
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
  if (!cloudState.ready || !cloudState.user) {
    app.innerHTML = renderAuthGate();
    wireAuthGate();
    return;
  }
  if (!cloudState.hydrated) {
    app.innerHTML = renderSyncGate();
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

  const noteInput = document.getElementById("achievement-note") as HTMLTextAreaElement | null;
  const notePreview = document.getElementById("achievement-note-preview");
  noteInput?.addEventListener("input", () => {
    const next = noteInput.value.slice(0, 280);
    if (noteInput.value !== next) noteInput.value = next;
    updateSave((state) => {
      state.playerProfile.achievementMessage = next;
    });
    if (notePreview) {
      notePreview.textContent = next.trim() ? next : "Ecris un message pour Alexiane.";
    }
  });

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
  if (!cloudState.ready || !cloudState.user || !cloudState.hydrated) {
    renderHub();
    return;
  }
  const nextSnapshot = getProgressionSnapshot();
  if (!hasSnapshot) {
    lastLevel = nextSnapshot.save.globalLevel;
    hasSnapshot = true;
  }
  snapshot = nextSnapshot;
  applyTheme(findTheme(registry.hubTheme));
  renderHub();
}

window.addEventListener("pageshow", () => {
  refresh();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    refresh();
  }
});

refresh();
