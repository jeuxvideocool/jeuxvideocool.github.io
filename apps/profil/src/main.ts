import "./style.css";
import { emitEvent } from "@core/events";
import { withBasePath } from "@core/utils";
import { getAchievementsConfig, getRegistry } from "@config";
import { getProgressionSnapshot } from "@progression";
import { exportSave, importSave, resetSave, updateSave } from "@storage";
import {
  connectCloud,
  getAuthState,
  loadCloudSave,
  saveCloud,
  subscribe as subscribeCloud,
} from "@storage/cloud";

const basePath = import.meta.env.BASE_URL || "/";
const app = document.getElementById("app")!;
let cloudState = getAuthState();

subscribeCloud((state) => {
  cloudState = state;
  render();
});

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

function formatCloudIdentity(user: any): string {
  if (!user) return "connecté";
  const metaId = user.user_metadata?.identifier;
  const email = user.email as string | undefined;
  if (metaId) return metaId;
  if (email?.endsWith("@user.local")) return email.replace("@user.local", "");
  return email || "connecté";
}

function mostPlayedGameTitle(snapshot: ReturnType<typeof getProgressionSnapshot>) {
  const entries = Object.entries(snapshot.save.games || {});
  if (!entries.length) return { title: "Aucun jeu", duration: "0m" };
  const [id, game] = entries.sort((a, b) => (b[1].timePlayedMs || 0) - (a[1].timePlayedMs || 0))[0];
  const reg = getRegistry().games.find((g) => g.id === id);
  return { title: reg?.title || id, duration: formatDuration(game.timePlayedMs) };
}

function showToast(message: string, variant: "success" | "error" | "info" = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${variant}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 240);
  }, 2400);
}

function render() {
  const snapshot = getProgressionSnapshot();
  const achievements = getAchievementsConfig().achievements;
  const unlocked = new Set(snapshot.save.achievementsUnlocked);
  const registry = getRegistry();
  const games = Object.entries(snapshot.save.games);
  const nameDisabled = cloudState?.user ? "disabled" : "";
  const mostPlayed = mostPlayedGameTitle(snapshot);

  app.innerHTML = `
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            <div class="avatar">${snapshot.save.playerProfile.avatar || "🎮"}</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>${snapshot.save.playerProfile.name || "Joueur"}</h1>
              <p class="muted">${snapshot.save.playerProfile.lastPlayedGameId ? `Dernier jeu : ${registry.games.find((g) => g.id === snapshot.save.playerProfile.lastPlayedGameId)?.title ?? "Inconnu"}` : "Aucun jeu lancé"}</p>
            </div>
          </div>
          <div class="chips">
            ${
              cloudState.user
                ? `<span class="chip success">Cloud : ${formatCloudIdentity(cloudState.user)}</span>`
                : cloudState.ready
                  ? `<span class="chip warning">Cloud : non connecté</span>`
                  : `<span class="chip warning">Supabase non configuré</span>`
            }
            <span class="chip">⏱ ${formatDuration(snapshot.save.globalStats.timePlayedMs)}</span>
            <span class="chip">🎮 ${snapshot.save.globalStats.totalSessions} sessions</span>
          </div>
          <div class="identity-actions">
            <a class="btn primary strong" href="${withBasePath("/", basePath)}">Retour hub</a>
            <button class="btn ghost" id="cloud-save-now">Sauvegarder cloud</button>
            <button class="btn ghost" id="cloud-load-now">Charger cloud</button>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <p class="label">Niveau</p>
            <strong>${snapshot.save.globalLevel}</strong>
            <p class="muted small">${snapshot.save.globalXP} XP</p>
          </div>
          <div class="stat-card">
            <p class="label">Succès</p>
            <strong>${unlocked.size}/${achievements.length}</strong>
            <p class="muted small">Schema v${snapshot.save.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${formatDuration(snapshot.save.globalStats.timePlayedMs)}</strong>
            <p class="muted small">Sessions ${snapshot.save.globalStats.totalSessions}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${mostPlayed.title}</strong>
            <p class="muted small">${mostPlayed.duration}</p>
          </div>
        </div>
      </header>

      <div class="sections">
        <div class="grid-two">
          <section class="card">
            <h2>Identité</h2>
            <p class="muted small">Pseudo verrouillé si connecté en cloud. Avatar toujours modifiable.</p>
            <div class="form">
              <label>Pseudo <input id="name" value="${snapshot.save.playerProfile.name}" maxlength="18" ${nameDisabled} /></label>
              <label>Avatar (emoji) <input id="avatar" value="${snapshot.save.playerProfile.avatar}" maxlength="4" /></label>
              <div class="actions">
                <button class="btn primary" id="save-profile">Enregistrer</button>
                <button class="btn ghost danger" id="reset">Reset global</button>
              </div>
            </div>
          </section>

          <section class="card">
            <h2>Cloud Supabase</h2>
            <p class="muted small">Synchronisation cross-device (Spark gratuit). Identifiant + mot de passe.</p>
            ${
              cloudState?.user
                ? `<div class="status ok">Connecté : ${formatCloudIdentity(cloudState.user)}</div>
                   <div class="actions">
                     <button class="btn primary" id="cloud-save">Sauvegarder vers cloud</button>
                     <button class="btn ghost" id="cloud-load">Charger depuis cloud</button>
                     <button class="btn ghost danger" id="cloud-logout">Déconnexion</button>
                   </div>
                   <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save).</p>`
                : `<div class="form">
                     <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
                     <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                     <div class="actions">
                       <button class="btn primary" id="cloud-login">Connexion</button>
                       <button class="btn ghost" id="cloud-register">Créer un compte</button>
                     </div>
                     <div class="status ${cloudState?.error ? "error" : "info"}">${cloudState?.message ?? "Non connecté"}</div>
                   </div>`
            }
          </section>
        </div>

        <section class="card">
          <h2>Gestion des sauvegardes</h2>
          <p class="muted small">Export/Import JSON et stats locales. Les actions cloud ci-dessus restent disponibles.</p>
          <div class="actions">
            <button class="btn ghost" id="export">Exporter JSON</button>
            <button class="btn ghost danger" id="reset-save">Reset global</button>
          </div>
          <label>Import JSON
            <textarea id="import" placeholder="Colle ici ton export JSON"></textarea>
            <button class="btn primary" id="import-btn">Importer</button>
          </label>
          <div class="save-meta">
            <div>
              <span class="label">Temps global</span>
              <strong>${formatDuration(snapshot.save.globalStats.timePlayedMs)}</strong>
            </div>
            <div>
              <span class="label">Jeux joués</span>
              <strong>${Object.keys(snapshot.save.games).length}/${registry.games.length}</strong>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${snapshot.save.globalStats.totalSessions}</strong>
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
      </div>
    </div>
  `;

  wire();
}

function wire() {
  const name = document.getElementById("name") as HTMLInputElement | null;
  const avatar = document.getElementById("avatar") as HTMLInputElement | null;

  document.getElementById("save-profile")?.addEventListener("click", () => {
    updateSave((s) => {
      const currentName = s.playerProfile.name;
      const nextName = cloudState?.user ? currentName : (name?.value || "Joueur").slice(0, 18);
      s.playerProfile.name = nextName;
      s.playerProfile.avatar = (avatar?.value || "🎮").slice(0, 4);
    });
    emitEvent({ type: "PROFILE_UPDATED" });
    render();
  });

  document.getElementById("export")?.addEventListener("click", () => {
    const data = exportSave();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arcade-galaxy-save.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("reset")?.addEventListener("click", () => {
    resetSave();
    render();
  });

  document.getElementById("import-btn")?.addEventListener("click", () => {
    const text = (document.getElementById("import") as HTMLTextAreaElement | null)?.value || "";
    const res = importSave(text);
    if (res.success) {
      render();
    } else {
      alert(res.error || "Import impossible");
    }
  });

  document.getElementById("reset-save")?.addEventListener("click", () => {
    resetSave();
    render();
  });

  document.getElementById("cloud-login")?.addEventListener("click", async () => {
    const identifier =
      (document.getElementById("cloud-identifier") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("login", { identifier, password });
    render();
  });
  document.getElementById("cloud-register")?.addEventListener("click", async () => {
    const identifier =
      (document.getElementById("cloud-identifier") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("register", { identifier, password });
    render();
  });
  document.getElementById("cloud-logout")?.addEventListener("click", async () => {
    await connectCloud("logout");
    render();
  });
  document.getElementById("cloud-save")?.addEventListener("click", async () => {
    const snapshot = getProgressionSnapshot();
    const ok = await saveCloud(snapshot.save);
    if (ok) alert("Sauvegarde envoyée dans le cloud.");
  });
  document.getElementById("cloud-load")?.addEventListener("click", async () => {
    const res = await loadCloudSave();
    if (res?.state) {
      importSave(JSON.stringify(res.state));
      alert("Sauvegarde cloud importée.");
      render();
    } else if (res?.error) {
      alert(res.error);
    }
  });
  document.getElementById("cloud-save-now")?.addEventListener("click", async () => {
    const snapshot = getProgressionSnapshot();
    const ok = await saveCloud(snapshot.save);
    showToast(ok ? "Sauvegarde envoyée" : "Erreur cloud", ok ? "success" : "error");
  });
  document.getElementById("cloud-load-now")?.addEventListener("click", async () => {
    const res = await loadCloudSave();
    if (res?.state) {
      importSave(JSON.stringify(res.state));
      showToast("Sauvegarde cloud importée", "success");
      render();
    } else if (res?.error) {
      showToast(res.error, "error");
    }
  });
}

render();
