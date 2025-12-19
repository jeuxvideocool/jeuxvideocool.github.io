import "./style.css";
import { withBasePath } from "@core/utils";
import { getProgressionSnapshot } from "@progression";
import { updateSave } from "@storage";
import {
  connectCloud,
  getAuthState,
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

function formatCloudIdentity(user?: any): string {
  if (!user) return "connecté";
  const metaId = user.user_metadata?.identifier;
  const email = user.email as string | undefined;
  if (metaId) return metaId;
  if (email?.endsWith("@user.local")) return email.replace("@user.local", "");
  return email || "connecté";
}

function render() {
  const snapshot = getProgressionSnapshot();
  const pseudo = snapshot.save.playerProfile.name || "Joueur";
  const avatar = snapshot.save.playerProfile.avatar || "🎮";
  const profilLink = withBasePath("/apps/profil/", basePath);
  const hubLink = withBasePath("/", basePath);
  const supaStatus = cloudState.user
    ? `Connecté : ${formatCloudIdentity(cloudState.user)}`
    : cloudState.ready
      ? "Mode invité (local)"
      : "Supabase non configuré (.env)";

  app.innerHTML = `
    <div class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Arcade Galaxy</p>
          <h1>Invité ou compte cloud</h1>
          <p class="muted">Choisis : jouer en invité (aucune donnée externe) ou créer un compte pour synchroniser tes saves via Supabase.</p>
          <div class="chips">
            <span class="chip">Pseudo actuel : ${pseudo}</span>
            <span class="chip ghost">Avatar : ${avatar}</span>
            <span class="chip ${cloudState.user ? "success" : cloudState.ready ? "ghost" : "warning"}">${supaStatus}</span>
          </div>
        </div>
        <div class="hero-card">
          <div class="avatar">${avatar}</div>
          <p class="muted small">Ton profil reste partagé entre hub et jeux.</p>
          <div class="hero-actions">
            <a class="btn ghost" href="${hubLink}">Hub</a>
            <a class="btn ghost" href="${profilLink}">Profil</a>
          </div>
        </div>
      </header>

      <main class="grid">
        <section class="card guest">
          <div class="section-head">
            <div>
              <p class="eyebrow">Mode invité</p>
              <h2>Sans compte</h2>
              <p class="muted small">Sauvegarde locale uniquement. Aucune connexion Supabase.</p>
            </div>
            <span class="pill">Local</span>
          </div>
          <div class="form">
            <label>Pseudo <input id="guest-name" type="text" value="${pseudo}" maxlength="18" /></label>
            <label>Avatar (emoji) <input id="guest-avatar" type="text" value="${avatar}" maxlength="4" /></label>
            <button class="btn primary" id="guest-continue">Continuer en invité</button>
          </div>
          <p class="muted small">Ton pseudo/avatar sont stockés dans le navigateur. La synchro cloud reste désactivée.</p>
        </section>

        <section class="card cloud">
          <div class="section-head">
            <div>
              <p class="eyebrow">Compte cloud</p>
              <h2>Supabase</h2>
              <p class="muted small">Identifiant + mot de passe pour synchroniser ta sauvegarde entre appareils.</p>
            </div>
            <span class="pill accent">Cloud</span>
          </div>

          ${
            !cloudState.ready
              ? `<div class="status error">Configure VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer la connexion.</div>`
              : cloudState.user
                ? `<div class="status ok">Connecté en cloud : ${formatCloudIdentity(cloudState.user)}</div>
                   <p class="muted small">La synchro s'enclenche automatiquement dès qu'une save locale change.</p>
                   <div class="actions wrap">
                     <button class="btn primary" id="cloud-sync" ${cloudState.loading ? "disabled" : ""}>Forcer une sync</button>
                     <a class="btn ghost" href="${hubLink}">Aller au hub</a>
                     <button class="btn ghost danger" id="cloud-logout" ${cloudState.loading ? "disabled" : ""}>Déconnexion</button>
                   </div>
                   ${
                     cloudState.message
                       ? `<p class="status info">${cloudState.message}</p>`
                       : `<p class="status info">Dernière sync : ${
                           cloudState.lastSyncedAt
                             ? new Date(cloudState.lastSyncedAt).toLocaleString("fr-FR", {
                                 dateStyle: "medium",
                                 timeStyle: "short",
                               })
                             : "Jamais"
                         }</p>`
                   }
                   ${cloudState.error ? `<p class="status error">${cloudState.error}</p>` : ""}`
                : `<div class="form">
                     <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
                     <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                     <div class="actions wrap">
                       <button class="btn primary" id="cloud-login" ${cloudState.loading ? "disabled" : ""}>Connexion</button>
                       <button class="btn ghost" id="cloud-register" ${cloudState.loading ? "disabled" : ""}>Créer un compte</button>
                     </div>
                   </div>
                   ${
                     cloudState.error
                       ? `<p class="status error">${cloudState.error}</p>`
                       : `<p class="status info">Compte utilisé uniquement pour la sauvegarde cloud (pas d'email requis).</p>`
                   }`
          }
        </section>
      </main>

      <section class="card info">
        <div class="info-grid">
          <div>
            <p class="eyebrow">Clair et simple</p>
            <h3>Deux options</h3>
            <p class="muted">1) Invité : données 100% locales. 2) Cloud : identifiant/mot de passe Supabase pour retrouver ta progression partout.</p>
          </div>
          <div class="bullets">
            <div class="bullet">🚀 Synchro auto quand la save change (si connecté).</div>
            <div class="bullet">🔒 Pas d'email obligatoire, identifiant seul suffit.</div>
            <div class="bullet">📤 Export/Import possibles depuis la page Profil.</div>
          </div>
        </div>
      </section>
    </div>
  `;

  wire();
}

function wire() {
  const guestBtn = document.getElementById("guest-continue");
  const guestName = document.getElementById("guest-name") as HTMLInputElement | null;
  const guestAvatar = document.getElementById("guest-avatar") as HTMLInputElement | null;

  guestBtn?.addEventListener("click", () => {
    const name = (guestName?.value || "Joueur").trim().slice(0, 18);
    const avatar = (guestAvatar?.value || "🎮").trim().slice(0, 4);
    updateSave((state) => {
      state.playerProfile.name = name || "Joueur";
      state.playerProfile.avatar = avatar || "🎮";
    });
    showToast("Mode invité prêt");
    window.location.href = withBasePath("/", basePath);
  });

  const loginBtn = document.getElementById("cloud-login");
  const registerBtn = document.getElementById("cloud-register");
  const logoutBtn = document.getElementById("cloud-logout");
  const syncBtn = document.getElementById("cloud-sync");

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
    showToast("Déconnecté du cloud", "info");
  });

  syncBtn?.addEventListener("click", async () => {
    const current = getProgressionSnapshot();
    const ok = await saveCloud(current.save);
    showToast(ok ? "Sauvegarde envoyée" : cloudState.error || "Erreur cloud", ok ? "success" : "error");
  });
}

render();
