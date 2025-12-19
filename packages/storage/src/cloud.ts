import { createClient, Session, User } from "@supabase/supabase-js";
import { loadSave, subscribeToSaveChanges } from "./index";
import type { SaveState } from "./index";

export type CloudState = {
  ready: boolean;
  user: User | null;
  message?: string;
  error?: string;
  session?: Session | null;
  loading?: boolean;
  lastSyncedAt?: number;
};

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
let supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

let cloudState: CloudState = { ready: Boolean(supabase), user: null };
const AUTO_SYNC_DELAY_MS = 600;
let pendingAutoSync: SaveState | null = null;
let autoSyncTimer: ReturnType<typeof setTimeout> | null = null;
const PSEUDO_DOMAIN = "user.local";

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
      cloudState = {
        ready: true,
        user: data.user,
        session: data.session,
        message: "Connecté",
      };
    } else if (action === "register") {
      const { data, error } = await auth.signUp({
        email: pseudoEmail,
        password,
        options: { data: { identifier } },
      });
      if (error) throw error;
      cloudState = {
        ready: true,
        user: data.user,
        session: data.session,
        message: "Compte créé (identifiant).",
      };
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

export async function saveCloud(save: SaveState): Promise<boolean> {
  if (!requireClient()) return false;
  if (!cloudState.user) {
    cloudState = { ...cloudState, error: "Connecte-toi pour synchroniser." };
    notify();
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

function scheduleAutoSync(state: SaveState) {
  if (!supabase || !cloudState.user) return;
  pendingAutoSync = state;
  if (autoSyncTimer) return;

  autoSyncTimer = setTimeout(async () => {
    autoSyncTimer = null;
    if (!pendingAutoSync) return;
    const payload = pendingAutoSync;
    pendingAutoSync = null;
    if (!supabase || !cloudState.user) return;
    await saveCloud(payload);
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
      scheduleAutoSync(loadSave());
    }
  });
}
