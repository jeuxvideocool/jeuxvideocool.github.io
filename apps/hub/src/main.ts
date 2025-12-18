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
import { attachProgressionListener, getProgressionSnapshot } from "@progression";
import { exportSave, importSave, resetGameSave, resetSave, updateSave } from "@storage";
import {
  connectCloud,
  getAuthState,
  loadCloudSave,
  saveCloud,
  subscribe as subscribeCloud,
} from "@storage/cloud";

type Tab = "hub" | "achievements" | "saves";

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

function handleProfileChange(name: string, avatar: string) {
  const trimmedName = name.trim() || "Joueur";
  const trimmedAvatar = avatar.trim() || "🎮";
  updateSave((state) => {
    state.playerProfile.name = trimmedName.slice(0, 18);
    state.playerProfile.avatar = trimmedAvatar.slice(0, 4);
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
      <button class="nav-btn ${activeTab === "saves" ? "active" : ""}" data-tab="saves">Saves</button>
    </nav>
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

  const cloudBadge = cloudState.user
    ? `<span class="chip success">Cloud : ${cloudState.user.email || "connecté"}</span>`
    : cloudState.ready
      ? `<span class="chip ghost">Mode invité · données locales</span>`
      : `<span class="chip warning">Supabase non configuré (.env)</span>`;

  return `
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          <div class="avatar">${save.playerProfile.avatar || "🎮"}</div>
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${save.playerProfile.name || "Joueur"}</h1>
            <p class="muted">${lastGame ? `Dernier jeu : ${lastGame}` : "Aucun jeu lancé"}</p>
            <div class="chips">
              ${cloudBadge}
              <span class="chip">⏱ ${totalTime}</span>
              <span class="chip">🎮 ${sessionCount} sessions</span>
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
        </div>
      </div>
      <div class="level-row ${levelUp ? "level-up" : ""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${xpBarStyle}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(snapshot.levelProgress * 100)}% · ${
          snapshot.nextLevelXP - save.globalXP
        } XP restants</div>
      </div>
      <div class="profile-form">
        <label>
          Pseudo
          <input id="player-name" type="text" value="${save.playerProfile.name}" maxlength="18" />
        </label>
        <label>
          Avatar (emoji)
          <input id="player-avatar" type="text" value="${save.playerProfile.avatar}" maxlength="4" />
        </label>
      </div>
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
            <p class="muted">${cloudState.user.email || "Compte sans email"}</p>
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
        <label>Email <input id="cloud-email" type="email" placeholder="mail@example.com" /></label>
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

function renderSaves() {
  const save = snapshot.save;
  const games = Object.entries(save.games);
  const gameRows = games
    .map(([id, game]) => {
      return `
        <div class="save-row">
          <div>
            <strong>${id}</strong>
            <p class="muted">v${game.saveSchemaVersion} · Dernier : ${formatDate(game.lastPlayedAt)}</p>
          </div>
          <div class="row-meta">
            <span class="chip ghost">⏱ ${formatDuration(game.timePlayedMs)}</span>
            <button class="btn ghost reset-game" data-game="${id}">Reset</button>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="panel-grid">
      <section class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Saves</p>
            <h2>Gestion</h2>
            <p class="muted">Schema v${save.schemaVersion}</p>
          </div>
          <div class="actions">
            <button class="btn ghost" id="export-save">Exporter</button>
            <button class="btn ghost danger" id="reset-save">Reset global</button>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${formatDuration(save.globalStats.timePlayedMs)}</strong>
          </div>
          <div class="stat-card">
            <p class="label">Jeux joués</p>
            <strong>${Object.keys(save.games).length}/${registry.games.length}</strong>
          </div>
          <div class="stat-card">
            <p class="label">Sessions</p>
            <strong>${save.globalStats.totalSessions}</strong>
          </div>
        </div>
        <label class="import">
          Import JSON
          <textarea id="import-text" placeholder="Colle ici ta sauvegarde"></textarea>
          <button class="btn primary" id="import-btn">Importer</button>
        </label>
      </section>
      ${renderCloudPanel()}
    </div>
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Par jeu</p>
          <h2>Saves détaillées</h2>
        </div>
      </div>
      <div class="save-list">
        ${gameRows || "<p class='muted'>Aucune save par jeu pour le moment.</p>"}
      </div>
    </section>
  `;
}

function renderHub() {
  app.innerHTML = `
    <div class="layout">
      ${renderNav()}
      ${renderHero()}
      ${activeTab === "hub" ? renderGameGrid() : ""}
      ${activeTab === "achievements" ? renderAchievements() : ""}
      ${activeTab === "saves" ? renderSaves() : ""}
    </div>
  `;

  wireEvents();
}

function wireEvents() {
  document.querySelectorAll<HTMLButtonElement>(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab as Tab;
      renderHub();
    });
  });

  const nameInput = document.getElementById("player-name") as HTMLInputElement | null;
  const avatarInput = document.getElementById("player-avatar") as HTMLInputElement | null;
  nameInput?.addEventListener("change", () =>
    handleProfileChange(nameInput.value, avatarInput?.value || "🎮"),
  );
  avatarInput?.addEventListener("change", () =>
    handleProfileChange(nameInput?.value || "Joueur", avatarInput.value),
  );

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
    const email = (document.getElementById("cloud-email") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("login", { email, password });
  });
  registerBtn?.addEventListener("click", async () => {
    const email = (document.getElementById("cloud-email") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("register", { email, password });
  });
  logoutBtn?.addEventListener("click", async () => {
    await connectCloud("logout");
  });
  cloudSaveBtn?.addEventListener("click", handleCloudSaveAction);
  cloudLoadBtn?.addEventListener("click", handleCloudLoadAction);

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
}

function refresh() {
  snapshot = getProgressionSnapshot();
  applyTheme(findTheme(registry.hubTheme));
  renderHub();
}

renderHub();
