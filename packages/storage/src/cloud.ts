import { createClient, Session, User } from "@supabase/supabase-js";
import { importSave, loadSave, subscribeToSaveChanges, updateSave } from "./index";
import type { SaveState } from "./index";

const AVATAR_BUCKET = (import.meta.env.VITE_SUPABASE_AVATAR_BUCKET as string | undefined) || "avatars";
const MAX_AVATAR_SIZE_BYTES = 1.5 * 1024 * 1024;
export type CloudState = {
  ready: boolean;
  user: User | null;
  message?: string;
  error?: string;
  session?: Session | null;
  loading?: boolean;
  lastSyncedAt?: number;
};

type SaveCloudOptions = {
  allowEmpty?: boolean;
  silent?: boolean;
};

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
let supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

let cloudState: CloudState = { ready: Boolean(supabase), user: null };
const AUTO_SYNC_DELAY_MS = 600;
let pendingAutoSync: SaveState | null = null;
let pendingAutoSyncForce = false;
let autoSyncTimer: ReturnType<typeof setTimeout> | null = null;
const PSEUDO_DOMAIN = "user.local";
let allowAutoSync = true;
let forceNextCloudSync = false;

type Listener = (state: CloudState) => void;
const listeners: Listener[] = [];

function notify() {
  listeners.forEach((fn) => fn(cloudState));
}

export function subscribe(fn: Listener) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function requireClient(): boolean {
  if (!supabase) {
    cloudState = { ready: false, user: null, error: "Supabase non configuré." };
    notify();
    return false;
  }
  return true;
}

export function getAuthState(): CloudState {
  return cloudState;
}

export function requestCloudResetSync() {
  forceNextCloudSync = true;
}

export function getAvatarPublicUrl(path?: string | null): string | null {
  if (!path || !supabaseUrl) return null;
  const baseUrl = supabaseUrl.replace(/\/+$/, "");
  const safePath = path.replace(/^\/+/, "");
  return `${baseUrl}/storage/v1/object/public/${AVATAR_BUCKET}/${safePath}`;
}

type AuthAction = "login" | "register" | "logout";

function toPseudoEmail(identifier: string): string {
  if (identifier.includes("@")) {
    return identifier.trim().toLowerCase();
  }
  const safe = identifier
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
  return `${safe || "player"}@${PSEUDO_DOMAIN}`;
}

function extractIdentifier(user: User | null, provided?: string): string {
  const fromProvided = provided?.trim();
  const meta = (user?.user_metadata?.identifier as string | undefined)?.trim();
  const email = user?.email;
  if (fromProvided) return fromProvided;
  if (meta) return meta;
  if (email?.endsWith(`@${PSEUDO_DOMAIN}`)) return email.replace(`@${PSEUDO_DOMAIN}`, "");
  if (email) return email.split("@")[0];
  return "Joueur";
}

function enforceProfileName(identifier: string) {
  const name = (identifier || "Joueur").slice(0, 18);
  updateSave((state) => {
    state.playerProfile.name = name || "Joueur";
  });
}

async function hydrateFromCloud(): Promise<boolean> {
  if (!supabase || !cloudState.user) return false;
  const res = await loadCloudSave();
  if (res?.state) {
    importSave(JSON.stringify(res.state));
    return true;
  }
  return false;
}

function isEmptySave(save: SaveState): boolean {
  if (save.globalXP > 0) return false;
  if (save.globalLevel > 1) return false;
  if (save.achievementsUnlocked.length > 0) return false;
  if (Object.keys(save.games || {}).length > 0) return false;
  const stats = save.globalStats;
  if (stats.gamesPlayed > 0) return false;
  if (stats.totalSessions > 0) return false;
  if ((stats.timePlayedMs ?? 0) > 0) return false;
  if (stats.currentSessionStartedAt) return false;
  if (Object.keys(stats.events || {}).length > 0) return false;
  if (Object.keys(stats.streaks || {}).length > 0) return false;
  return true;
}

export async function connectCloud(
  action: AuthAction,
  params?: { email?: string; password?: string; identifier?: string },
) {
  if (!requireClient()) return cloudState;

  if (action === "logout") {
    cloudState = { ...cloudState, loading: true, error: undefined };
    notify();
    await supabase!.auth.signOut();
    pendingAutoSync = null;
    pendingAutoSyncForce = false;
    forceNextCloudSync = false;
    if (autoSyncTimer) {
      clearTimeout(autoSyncTimer);
      autoSyncTimer = null;
    }
    cloudState = { ready: true, user: null, session: null, message: "Déconnecté" };
    notify();
    return cloudState;
  }

  const identifier = (params?.identifier || params?.email || "").trim();
  const password = params?.password || "";
  if (!identifier || password.length < 6) {
    cloudState = { ...cloudState, error: "Identifiant/mot de passe invalide." };
    notify();
    return cloudState;
  }
  const pseudoEmail = toPseudoEmail(identifier);

  cloudState = { ...cloudState, loading: true, error: undefined, message: undefined };
  notify();

  const auth = supabase!.auth;
  try {
    if (action === "login") {
      const { data, error } = await auth.signInWithPassword({ email: pseudoEmail, password });
      if (error) throw error;
      enforceProfileName(identifier);
      cloudState = {
        ready: true,
        user: data.user,
        session: data.session,
        message: "Connecté",
      };
      allowAutoSync = false;
      await hydrateFromCloud();
      allowAutoSync = true;
    } else if (action === "register") {
      const { data, error } = await auth.signUp({
        email: pseudoEmail,
        password,
        options: { data: { identifier } },
      });
      if (error) throw error;
      enforceProfileName(identifier);
      cloudState = {
        ready: true,
        user: data.user,
        session: data.session,
        message: "Compte créé (identifiant).",
      };
      allowAutoSync = false;
      await hydrateFromCloud();
      allowAutoSync = true;
    }
  } catch (err: any) {
    cloudState = { ...cloudState, error: err?.message || "Erreur d'auth Supabase" };
  }

  cloudState = { ...cloudState, loading: false };
  notify();
  if (cloudState.user) {
    scheduleAutoSync(loadSave());
  }
  return cloudState;
}

export async function saveCloud(save: SaveState, options: SaveCloudOptions = {}): Promise<boolean> {
  if (!requireClient()) return false;
  if (!cloudState.user) {
    cloudState = { ...cloudState, error: "Connecte-toi pour synchroniser." };
    notify();
    return false;
  }
  if (!options.allowEmpty && isEmptySave(save)) {
    if (!options.silent) {
      cloudState = {
        ...cloudState,
        error: "Sauvegarde vide. Joue ou fais un reset pour synchroniser.",
        message: undefined,
        loading: false,
      };
      notify();
    }
    return false;
  }
  cloudState = { ...cloudState, loading: true, error: undefined, message: undefined };
  notify();

  const { error } = await supabase!
    .from("saves")
    .upsert({ user_id: cloudState.user.id, save, updated_at: new Date().toISOString() });
  cloudState = {
    ...cloudState,
    loading: false,
    lastSyncedAt: Date.now(),
    message: error ? undefined : "Sauvegarde envoyée.",
    error: error?.message,
  };
  notify();
  return !Boolean(error);
}

export async function loadCloudSave(): Promise<{ state?: SaveState; error?: string }> {
  if (!requireClient()) return { error: "Supabase non configuré." };
  if (!cloudState.user) return { error: "Connecte-toi pour charger." };

  cloudState = { ...cloudState, loading: true, error: undefined, message: undefined };
  notify();
  const { data, error } = await supabase!
    .from("saves")
    .select("save, updated_at")
    .eq("user_id", cloudState.user.id)
    .maybeSingle();
  cloudState = {
    ...cloudState,
    loading: false,
    lastSyncedAt: data ? Date.now() : cloudState.lastSyncedAt,
    message: error ? undefined : data ? "Sauvegarde cloud récupérée." : cloudState.message,
    error: error?.message,
  };
  notify();

  if (error) return { error: error.message };
  if (!data) return { error: "Aucune sauvegarde trouvée." };
  return { state: data.save as SaveState };
}

export async function uploadAvatarImage(
  file: File,
  previousPath?: string,
): Promise<{ url?: string; path?: string; error?: string }> {
  if (!requireClient()) return { error: "Supabase non configuré." };
  if (!cloudState.user) return { error: "Connexion cloud requise." };
  if (file.size > MAX_AVATAR_SIZE_BYTES) return { error: "Image trop lourde (1.5 Mo max)." };

  const extension = (file.name.split(".").pop() || "png").replace(/[^a-z0-9]/gi, "") || "png";
  const targetPath = previousPath || `${cloudState.user.id}/avatar-${Date.now()}.${extension}`;

  cloudState = { ...cloudState, loading: true, error: undefined };
  notify();

  const storage = supabase!.storage.from(AVATAR_BUCKET);
  const { data, error } = await storage.upload(targetPath, file, {
    upsert: true,
    cacheControl: "3600",
    contentType: file.type || "image/png",
  });

  if (error) {
    cloudState = { ...cloudState, loading: false, error: error.message };
    notify();
    return { error: error.message };
  }

  const { data: publicUrl } = storage.getPublicUrl(data.path);
  cloudState = { ...cloudState, loading: false, message: "Avatar mis à jour." };
  notify();

  return { url: publicUrl.publicUrl, path: data.path };
}

export async function removeAvatarImage(path?: string) {
  if (!requireClient() || !path) return;
  try {
    await supabase!.storage.from(AVATAR_BUCKET).remove([path]);
  } catch (err) {
    console.warn("Impossible de supprimer l'ancien avatar", err);
  }
}

function scheduleAutoSync(state: SaveState) {
  if (!supabase || !cloudState.user || !allowAutoSync) return;
  const isEmpty = isEmptySave(state);
  if (isEmpty && !forceNextCloudSync) return;
  pendingAutoSync = state;
  pendingAutoSyncForce = pendingAutoSyncForce || forceNextCloudSync;
  forceNextCloudSync = false;
  if (autoSyncTimer) return;

  autoSyncTimer = setTimeout(async () => {
    autoSyncTimer = null;
    if (!pendingAutoSync) return;
    const payload = pendingAutoSync;
    const allowEmpty = pendingAutoSyncForce;
    pendingAutoSync = null;
    pendingAutoSyncForce = false;
    if (!supabase || !cloudState.user) return;
    await saveCloud(payload, { allowEmpty, silent: true });
  }, AUTO_SYNC_DELAY_MS);
}

subscribeToSaveChanges((state) => {
  scheduleAutoSync(state);
});

if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    cloudState = {
      ready: true,
      user: session?.user ?? null,
      session,
      message: session?.user ? "Connecté" : "Non connecté",
      error: undefined,
      loading: false,
      lastSyncedAt: cloudState.lastSyncedAt,
    };
    notify();
    if (session?.user) {
      enforceProfileName(extractIdentifier(session.user));
      allowAutoSync = false;
      hydrateFromCloud().finally(() => {
        allowAutoSync = true;
      });
    }
  });
}
