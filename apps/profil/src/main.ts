import "./style.css";
import { emitEvent } from "@core/events";
import { withBasePath } from "@core/utils";
import { getAchievementsConfig, getRegistry } from "@config";
import { getProgressionSnapshot } from "@progression";
import { exportSave, importSave, resetSave, updateSave } from "@storage";
import { connectCloud, getAuthState, loadCloudSave, saveCloud } from "./sync";

const basePath = import.meta.env.BASE_URL || "/";
const app = document.getElementById("app")!;

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

function render() {
  const snapshot = getProgressionSnapshot();
  const achievements = getAchievementsConfig().achievements;
  const unlocked = new Set(snapshot.save.achievementsUnlocked);
  const registry = getRegistry();
  const authState = getAuthState();
  const games = Object.entries(snapshot.save.games);

  app.innerHTML = `
    <div class="shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Profil joueur</p>
          <h1>${snapshot.save.playerProfile.avatar} ${snapshot.save.playerProfile.name}</h1>
          <p class="muted">Niveau ${snapshot.save.globalLevel} · ${snapshot.save.globalXP} XP · ${unlocked.size}/${achievements.length} succès</p>
        </div>
        <div class="actions">
          <a class="btn ghost" href="${withBasePath("/apps/home/", basePath)}">Accueil</a>
          <a class="btn primary" href="${withBasePath("/", basePath)}">Hub de jeux</a>
        </div>
      </header>

      <section class="panel">
        <h2>Identité</h2>
        <div class="form">
          <label>Pseudo <input id="name" value="${snapshot.save.playerProfile.name}" maxlength="18" /></label>
          <label>Avatar (emoji) <input id="avatar" value="${snapshot.save.playerProfile.avatar}" maxlength="4" /></label>
          <button class="btn primary" id="save-profile">Enregistrer</button>
        </div>
      </section>

      <section class="panel">
        <h2>Progression</h2>
        <div class="stats">
          <div><span class="label">XP manquants</span><strong>${snapshot.nextLevelXP - snapshot.save.globalXP}</strong></div>
          <div><span class="label">Jeux joués</span><strong>${Object.keys(snapshot.save.games).length}/${registry.games.length}</strong></div>
          <div><span class="label">Succès</span><strong>${unlocked.size}/${achievements.length}</strong></div>
        </div>
      </section>

      <section class="panel">
        <h2>Backup</h2>
        <div class="form">
          <button class="btn ghost" id="export">Exporter JSON</button>
          <button class="btn ghost danger" id="reset">Reset global</button>
          <textarea id="import" placeholder="Colle ici ton export JSON"></textarea>
          <button class="btn primary" id="import-btn">Importer</button>
          <p class="muted small">Les données restent sur ton appareil (localStorage). Aucun service externe n'est utilisé.</p>
        </div>
      </section>

      <section class="panel">
        <h2>Sauvegardes locales</h2>
        <p class="muted small">Vue rapide de ce qui est stocké sur cet appareil (cloud ci-dessous).</p>
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
                  <p class="muted small">v${game.saveSchemaVersion} · Dernier : ${formatDate(
                    game.lastPlayedAt
                  )}</p>
                </div>
                <div class="chips">
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

      <section class="panel">
        <h2>Cloud (Supabase)</h2>
        <div class="form">
          <p class="muted small">Synchronisation cross-device via Supabase (Spark gratuit). Renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.</p>
          ${
            authState?.user
              ? `<div class="status ok">Connecté : ${authState.user.email || "compte sans email"}</div>
                 <div class="actions">
                    <button class="btn primary" id="cloud-save">Sauvegarder vers cloud</button>
                    <button class="btn ghost" id="cloud-load">Charger depuis cloud</button>
                    <button class="btn ghost danger" id="cloud-logout">Déconnexion</button>
                 </div>
                 <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save).</p>`
              : `<label>Email <input id="cloud-email" type="email" placeholder="mail@example.com" /></label>
                 <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                 <div class="actions">
                   <button class="btn primary" id="cloud-login">Connexion</button>
                   <button class="btn ghost" id="cloud-register">Créer un compte</button>
                 </div>
                 <div class="status ${authState?.error ? "error" : "info"}">${authState?.message ?? "Non connecté"}</div>`
          }
        </div>
      </section>

      <section class="panel">
        <h2>Succès</h2>
        <div class="ach-list">
          ${achievements
            .map(
              (ach) => `
                <article class="ach ${unlocked.has(ach.id) ? "ok" : ""}">
                  <div class="pill">${ach.icon || "⭐️"}</div>
                  <div>
                    <h3>${ach.title}</h3>
                    <p class="muted">${ach.description}</p>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    </div>
  `;

  wire();
}

function wire() {
  const name = document.getElementById("name") as HTMLInputElement | null;
  const avatar = document.getElementById("avatar") as HTMLInputElement | null;
  document.getElementById("save-profile")?.addEventListener("click", () => {
    updateSave((s) => {
      s.playerProfile.name = (name?.value || "Joueur").slice(0, 18);
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

  // Cloud
  document.getElementById("cloud-login")?.addEventListener("click", async () => {
    const email = (document.getElementById("cloud-email") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("login", { email, password });
    render();
  });
  document.getElementById("cloud-register")?.addEventListener("click", async () => {
    const email = (document.getElementById("cloud-email") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("register", { email, password });
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
}

render();
