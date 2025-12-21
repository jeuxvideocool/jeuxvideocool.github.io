import "./style.css";
import { emitEvent } from "@core/events";
import { withBasePath } from "@core/utils";
import { getAchievementsConfig, getRegistry } from "@config";
import { getProgressionSnapshot } from "@progression";
import { exportSave, importSave, resetSave, updateSave } from "@storage";
import {
  connectCloud,
  getAvatarPublicUrl,
  getAuthState,
  loadCloudSave,
  requestCloudResetSync,
  saveCloud,
  subscribe as subscribeCloud,
  uploadAvatarImage,
  removeAvatarImage,
} from "@storage/cloud";

const basePath = import.meta.env.BASE_URL || "/";
const app = document.getElementById("app")!;
let cloudState = getAuthState();
let currentSnapshot = getProgressionSnapshot();
let pendingAvatarFile: File | null = null;
let pendingAvatarPreview: string | null = null;
let pendingAvatarReset = false;
let suppressCloudRender = false;
const MAX_AVATAR_UPLOAD_BYTES = 1.5 * 1024 * 1024;

subscribeCloud((state) => {
  cloudState = state;
  if (!suppressCloudRender) {
    render();
  }
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

function renderAvatarVisual(
  id: string,
  url: string | null | undefined,
  emoji: string,
  storagePath?: string | null,
) {
  const resolvedUrl = resolveAvatarUrl(url, storagePath);
  const hasImage = Boolean(resolvedUrl);
  return `<div class="avatar ${hasImage ? "has-image" : ""}" id="${id}">
    ${hasImage ? `<img src="${resolvedUrl}" alt="Avatar" />` : `<span>${emoji}</span>`}
  </div>`;
}

function getAvatarHelperText(hasImage: boolean) {
  if (hasImage) return "Image utilisée pour l'avatar (stockée sur Supabase). L'emoji reste disponible en secours.";
  if (!cloudState.ready) return "Supabase non configuré (.env).";
  if (!cloudState.user) return "Connecte-toi au cloud pour utiliser une image. Emoji disponible hors-ligne.";
  return "Choisis une image, elle sera envoyée sur Supabase.";
}

function updateAvatarPreview() {
  const emoji = (document.getElementById("avatar") as HTMLInputElement | null)?.value || "🎮";
  const previewEl = document.getElementById("avatar-preview");
  const helper = document.getElementById("avatar-helper");
  const clearBtn = document.getElementById("avatar-clear") as HTMLButtonElement | null;
  const storedUrl = resolveAvatarUrl(
    currentSnapshot.save.playerProfile.avatarUrl,
    currentSnapshot.save.playerProfile.avatarStoragePath,
  );
  const url = pendingAvatarReset ? null : pendingAvatarPreview || storedUrl;
  const hasImage = Boolean(url);

  if (previewEl) {
    previewEl.classList.toggle("has-image", hasImage);
    previewEl.innerHTML = hasImage ? `<img src="${url}" alt="Avatar" />` : `<span>${emoji}</span>`;
  }
  if (helper) helper.textContent = getAvatarHelperText(hasImage);
  if (clearBtn) clearBtn.disabled = !hasImage;
}

function render() {
  currentSnapshot = getProgressionSnapshot();
  const snapshot = currentSnapshot;
  const achievements = getAchievementsConfig().achievements;
  const unlocked = new Set(snapshot.save.achievementsUnlocked);
  const registry = getRegistry();
  const games = Object.entries(snapshot.save.games);
  const nameDisabled = cloudState?.user ? "disabled" : "";
  const mostPlayed = mostPlayedGameTitle(snapshot);
  const lastSync = cloudState.lastSyncedAt ? formatDate(cloudState.lastSyncedAt) : "Jamais";
  const avatarEmoji = snapshot.save.playerProfile.avatar || "🎮";
  const storedAvatarUrl = resolveAvatarUrl(
    snapshot.save.playerProfile.avatarUrl,
    snapshot.save.playerProfile.avatarStoragePath,
  );
  const avatarPreviewUrl = pendingAvatarReset
    ? null
    : pendingAvatarPreview || storedAvatarUrl;
  const avatarHelper = getAvatarHelperText(Boolean(avatarPreviewUrl));
  const lastPlayedTitle = snapshot.save.playerProfile.lastPlayedGameId
    ? registry.games.find((g) => g.id === snapshot.save.playerProfile.lastPlayedGameId)?.title ?? "Inconnu"
    : null;
  const cloudChip =
    cloudState.user
      ? `<span class="chip success">Cloud : ${formatCloudIdentity(cloudState.user)}</span>`
      : cloudState.ready
        ? `<span class="chip ghost">Cloud : non connecté</span>`
        : `<span class="chip warning">Supabase non configuré</span>`;

  app.innerHTML = `
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            ${renderAvatarVisual(
              "avatar-hero",
              storedAvatarUrl,
              avatarEmoji,
              snapshot.save.playerProfile.avatarStoragePath,
            )}
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>${snapshot.save.playerProfile.name || "Joueur"}</h1>
              <p class="muted">${lastPlayedTitle ? `Dernier jeu : ${lastPlayedTitle}` : "Aucun jeu lancé"}</p>
            </div>
          </div>
          <div class="chips">
            ${cloudChip}
            <span class="chip ghost">Sync : ${lastSync}</span>
            <span class="chip">⏱ ${formatDuration(snapshot.save.globalStats.timePlayedMs)}</span>
            <span class="chip">🎮 ${snapshot.save.globalStats.totalSessions} sessions</span>
          </div>
          <div class="identity-actions">
            <a class="btn primary strong" href="${withBasePath("/", basePath)}">Retour hub</a>
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
            <div class="section-head">
              <div>
                <h2>Identité</h2>
                <p class="muted small">Pseudo verrouillé si connecté en cloud. Avatar toujours modifiable.</p>
              </div>
              <span class="chip ghost">Avatar image</span>
            </div>
            <div class="identity-grid">
            <div class="avatar-panel">
                ${renderAvatarVisual(
                  "avatar-preview",
                  avatarPreviewUrl,
                  avatarEmoji,
                  snapshot.save.playerProfile.avatarStoragePath,
                )}
                <p class="muted small" id="avatar-helper">${avatarHelper}</p>
                <div class="avatar-actions">
                  <label class="file-drop">
                    <input type="file" id="avatar-upload" accept="image/*" />
                    <strong>Image de profil (Supabase)</strong>
                    <span class="muted small">PNG/JPG · 1.5 Mo max</span>
                  </label>
                  <button class="btn ghost danger" id="avatar-clear" type="button" ${avatarPreviewUrl ? "" : "disabled"}>Revenir à l'emoji</button>
                </div>
              </div>
              <div class="form">
                <label>Pseudo <input id="name" value="${snapshot.save.playerProfile.name}" maxlength="18" ${nameDisabled} /></label>
                <label>Avatar (emoji) <input id="avatar" value="${avatarEmoji}" maxlength="4" /></label>
                <div class="actions stretch">
                  <button class="btn primary" id="save-profile" type="button">Enregistrer</button>
                  <button class="btn ghost danger" id="reset" type="button">Reset global</button>
                </div>
              </div>
            </div>
          </section>

          <section class="card">
            <h2>Cloud Supabase</h2>
            <p class="muted small">Synchronisation cross-device (Spark gratuit). Identifiant + mot de passe.</p>
            ${
              cloudState?.user
                ? `<div class="status ok">Connecté : ${formatCloudIdentity(cloudState.user)}</div>
                   <div class="actions stretch">
                     <button class="btn primary" id="cloud-save" type="button">Sauvegarder vers cloud</button>
                     <button class="btn ghost" id="cloud-load" type="button">Charger depuis cloud</button>
                     <button class="btn ghost danger" id="cloud-logout" type="button">Déconnexion</button>
                   </div>
                   <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save). Dernière synchro : ${lastSync}.</p>`
                : `<div class="form">
                     <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
                     <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                     <div class="actions stretch">
                       <button class="btn primary" id="cloud-login" type="button">Connexion</button>
                       <button class="btn ghost" id="cloud-register" type="button">Créer un compte</button>
                     </div>
                     <div class="status ${cloudState?.error ? "error" : "info"}">${cloudState?.message ?? "Non connecté"}</div>
                   </div>`
            }
          </section>
        </div>

        <section class="card">
          <div class="section-head">
            <div>
              <h2>Gestion des sauvegardes</h2>
              <p class="muted small">Export/Import JSON et stats locales. Les actions cloud ci-dessus restent disponibles.</p>
            </div>
            <span class="chip ghost">Local</span>
          </div>
          <div class="actions stretch">
            <button class="btn ghost" id="export" type="button">Exporter JSON</button>
            <button class="btn ghost danger" id="reset-save" type="button">Reset global</button>
          </div>
          <label>Import JSON
            <textarea id="import" placeholder="Colle ici ton export JSON"></textarea>
            <button class="btn primary" id="import-btn" type="button">Importer</button>
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

  const avatarUpload = document.getElementById("avatar-upload") as HTMLInputElement | null;
  const clearAvatarBtn = document.getElementById("avatar-clear") as HTMLButtonElement | null;

  avatar?.addEventListener("input", updateAvatarPreview);

  avatarUpload?.addEventListener("change", (event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!cloudState.ready) {
      showToast("Supabase non configuré pour les avatars.", "error");
      input.value = "";
      return;
    }
    if (!cloudState.user) {
      showToast("Connecte-toi au cloud pour envoyer une image.", "error");
      input.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      showToast("Seules les images sont autorisées.", "error");
      input.value = "";
      return;
    }
    if (file.size > MAX_AVATAR_UPLOAD_BYTES) {
      showToast("Image trop lourde (1.5 Mo max).", "error");
      input.value = "";
      return;
    }
    if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview);
    pendingAvatarFile = file;
    pendingAvatarPreview = URL.createObjectURL(file);
    pendingAvatarReset = false;
    updateAvatarPreview();
  });

  clearAvatarBtn?.addEventListener("click", () => {
    pendingAvatarReset = true;
    pendingAvatarFile = null;
    if (pendingAvatarPreview) {
      URL.revokeObjectURL(pendingAvatarPreview);
      pendingAvatarPreview = null;
    }
    updateAvatarPreview();
  });

  document.getElementById("save-profile")?.addEventListener("click", async () => {
    suppressCloudRender = true;
    try {
      const currentName = currentSnapshot.save.playerProfile.name;
      const nextName = cloudState?.user ? currentName : (name?.value || "Joueur").slice(0, 18);
      const nextEmoji = (avatar?.value || "🎮").slice(0, 4);

      const previousPath = currentSnapshot.save.playerProfile.avatarStoragePath;
      let nextAvatarUrl = currentSnapshot.save.playerProfile.avatarUrl;
      let nextAvatarPath = previousPath;

      if (pendingAvatarFile) {
        const upload = await uploadAvatarImage(pendingAvatarFile, previousPath || undefined);
        if (!upload.url || !upload.path || upload.error) {
          showToast(upload.error || "Upload avatar impossible", "error");
          return;
        }
        nextAvatarUrl = upload.url;
        nextAvatarPath = upload.path;
      } else if (pendingAvatarReset) {
        nextAvatarUrl = undefined;
        nextAvatarPath = undefined;
        if (previousPath && cloudState.ready && cloudState.user) {
          await removeAvatarImage(previousPath);
        }
      }

      updateSave((s) => {
        const enforcedName = cloudState?.user ? s.playerProfile.name : nextName;
        s.playerProfile.name = enforcedName;
        s.playerProfile.avatar = nextEmoji;
        s.playerProfile.avatarUrl = nextAvatarUrl;
        s.playerProfile.avatarStoragePath = nextAvatarPath;
        s.playerProfile.avatarType = nextAvatarUrl ? "image" : "emoji";
      });

      pendingAvatarFile = null;
      if (pendingAvatarPreview) {
        URL.revokeObjectURL(pendingAvatarPreview);
        pendingAvatarPreview = null;
      }
      pendingAvatarReset = false;

      emitEvent({ type: "PROFILE_UPDATED" });
      showToast("Profil mis à jour", "success");
      render();
    } finally {
      suppressCloudRender = false;
    }
  });

  document.getElementById("export")?.addEventListener("click", () => {
    try {
      const data = exportSave();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "arcade-galaxy-save.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Export JSON prêt", "success");
    } catch (err) {
      console.error("Export JSON failed", err);
      showToast("Export impossible", "error");
    }
  });

  document.getElementById("reset")?.addEventListener("click", () => {
    requestCloudResetSync();
    resetSave();
    pendingAvatarFile = null;
    if (pendingAvatarPreview) {
      URL.revokeObjectURL(pendingAvatarPreview);
      pendingAvatarPreview = null;
    }
    pendingAvatarReset = false;
    showToast("Progression réinitialisée", "info");
    render();
  });

  document.getElementById("import-btn")?.addEventListener("click", () => {
    const text = (document.getElementById("import") as HTMLTextAreaElement | null)?.value || "";
    const res = importSave(text);
    if (res.success) {
      pendingAvatarFile = null;
      if (pendingAvatarPreview) {
        URL.revokeObjectURL(pendingAvatarPreview);
        pendingAvatarPreview = null;
      }
      pendingAvatarReset = false;
      showToast("Import réussi", "success");
      render();
    } else {
      showToast(res.error || "Import impossible", "error");
    }
  });

  document.getElementById("reset-save")?.addEventListener("click", () => {
    requestCloudResetSync();
    resetSave();
    showToast("Sauvegarde locale réinitialisée", "info");
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
    pendingAvatarFile = null;
    if (pendingAvatarPreview) {
      URL.revokeObjectURL(pendingAvatarPreview);
      pendingAvatarPreview = null;
    }
    pendingAvatarReset = false;
    render();
  });
  document.getElementById("cloud-save")?.addEventListener("click", async () => {
    const snapshot = getProgressionSnapshot();
    const ok = await saveCloud(snapshot.save);
    showToast(ok ? "Sauvegarde envoyée dans le cloud." : cloudState.error || "Erreur cloud", ok ? "success" : "error");
  });
  document.getElementById("cloud-load")?.addEventListener("click", async () => {
    const res = await loadCloudSave();
    if (res?.state) {
      importSave(JSON.stringify(res.state));
      pendingAvatarFile = null;
      if (pendingAvatarPreview) {
        URL.revokeObjectURL(pendingAvatarPreview);
        pendingAvatarPreview = null;
      }
      pendingAvatarReset = false;
      showToast("Sauvegarde cloud importée.", "success");
      render();
    } else if (res?.error) {
      showToast(res.error, "error");
    }
  });

  updateAvatarPreview();
}

render();
