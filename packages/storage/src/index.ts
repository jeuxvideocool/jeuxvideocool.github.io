import { z } from "zod";

export const CURRENT_SCHEMA_VERSION = 3;
export const LOCAL_STORAGE_KEY = "nintendo-hub-save";
const MAX_SAVE_BYTES = 200_000;

export type GameSaveState = {
  saveSchemaVersion: number;
  state: Record<string, any>;
  lastPlayedAt?: number;
  bestScore?: number;
  timePlayedMs?: number;
  sessionStartedAt?: number;
  xpEarned?: number;
};

export type SaveState = {
  schemaVersion: number;
  playerProfile: {
    name: string;
    avatar: string;
    avatarUrl?: string;
    avatarType?: "emoji" | "image";
    avatarStoragePath?: string;
    lastPlayedGameId?: string;
    achievementMessage: string;
  };
  globalXP: number;
  globalLevel: number;
  achievementsUnlocked: string[];
  globalStats: {
    events: Record<string, number>;
    gamesPlayed: number;
    totalSessions: number;
    streaks: Record<string, number>;
    timePlayedMs: number;
    currentSessionStartedAt?: number;
  };
  favorites: string[];
  games: Record<string, GameSaveState>;
};

const GameSaveSchema = z.object({
  saveSchemaVersion: z.number().int().default(1),
  state: z.record(z.any()).default({}),
  lastPlayedAt: z.number().optional(),
  bestScore: z.number().optional(),
  timePlayedMs: z.number().default(0),
  sessionStartedAt: z.number().optional(),
  xpEarned: z.number().default(0),
});

const SaveSchema = z.object({
  schemaVersion: z.number().int().default(CURRENT_SCHEMA_VERSION),
  playerProfile: z
    .object({
      name: z.string(),
      avatar: z.string(),
      avatarUrl: z.string().url().optional(),
      avatarType: z.enum(["emoji", "image"]).optional(),
      avatarStoragePath: z.string().optional(),
      lastPlayedGameId: z.string().optional(),
      achievementMessage: z.string().default(""),
    })
    .default({ name: "Joueur", avatar: "🎮", avatarType: "emoji", achievementMessage: "" }),
  globalXP: z.number().default(0),
  globalLevel: z.number().default(1),
  achievementsUnlocked: z.array(z.string()).default([]),
  globalStats: z
    .object({
      events: z.record(z.number()).default({}),
      gamesPlayed: z.number().default(0),
      totalSessions: z.number().default(0),
      streaks: z.record(z.number()).default({}),
      timePlayedMs: z.number().default(0),
      currentSessionStartedAt: z.number().optional(),
    })
    .default({ events: {}, gamesPlayed: 0, totalSessions: 0, streaks: {}, timePlayedMs: 0 }),
  favorites: z.array(z.string()).default([]),
  games: z.record(GameSaveSchema).default({}),
});

const MAX_NUMERIC_VALUE = Number.MAX_SAFE_INTEGER;

export function createEmptySave(): SaveState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    playerProfile: { name: "Joueur", avatar: "🎮", avatarType: "emoji", achievementMessage: "" },
    globalXP: 0,
    globalLevel: 1,
    achievementsUnlocked: [],
    globalStats: {
      events: {},
      gamesPlayed: 0,
      totalSessions: 0,
      streaks: {},
      timePlayedMs: 0,
    },
    favorites: [],
    games: {},
  };
}

function sanitizeNumber(value: number, fallback: number, min = -MAX_NUMERIC_VALUE, max = MAX_NUMERIC_VALUE) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function sanitizeNonNegative(value: number, fallback = 0, max = MAX_NUMERIC_VALUE) {
  return sanitizeNumber(value, fallback, 0, max);
}

function sanitizeOptionalNumber(
  value: number | undefined,
  fallback?: number,
  min = 0,
  max = MAX_NUMERIC_VALUE,
) {
  if (value === undefined) return undefined;
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function sanitizeSaveNumbers(save: SaveState): SaveState {
  save.globalXP = sanitizeNonNegative(save.globalXP, 0);
  save.globalLevel = Math.max(1, Math.trunc(sanitizeNonNegative(save.globalLevel, 1)));
  save.globalStats.gamesPlayed = Math.trunc(sanitizeNonNegative(save.globalStats.gamesPlayed, 0));
  save.globalStats.totalSessions = Math.trunc(sanitizeNonNegative(save.globalStats.totalSessions, 0));
  save.globalStats.timePlayedMs = sanitizeNonNegative(save.globalStats.timePlayedMs, 0);
  save.globalStats.currentSessionStartedAt = sanitizeOptionalNumber(
    save.globalStats.currentSessionStartedAt,
    undefined,
  );

  Object.entries(save.globalStats.events || {}).forEach(([key, value]) => {
    save.globalStats.events[key] = Math.trunc(sanitizeNonNegative(value, 0));
  });
  Object.entries(save.globalStats.streaks || {}).forEach(([key, value]) => {
    save.globalStats.streaks[key] = Math.trunc(sanitizeNonNegative(value, 0));
  });

  Object.values(save.games || {}).forEach((game) => {
    game.saveSchemaVersion = Math.max(1, Math.trunc(sanitizeNonNegative(game.saveSchemaVersion, 1)));
    game.lastPlayedAt = sanitizeOptionalNumber(game.lastPlayedAt, undefined);
    game.bestScore = sanitizeOptionalNumber(game.bestScore, undefined);
    game.timePlayedMs = sanitizeNonNegative(game.timePlayedMs ?? 0, 0);
    game.sessionStartedAt = sanitizeOptionalNumber(game.sessionStartedAt, undefined);
    game.xpEarned = sanitizeNonNegative(game.xpEarned ?? 0, 0);
  });

  return save;
}

function migrateSave(save: SaveState): SaveState {
  let current = { ...save };
  if (!current.schemaVersion || current.schemaVersion < 1) {
    current.schemaVersion = 1;
  }
  if (current.schemaVersion < 2) {
    current.globalStats.timePlayedMs = current.globalStats.timePlayedMs ?? 0;
    current.globalStats.currentSessionStartedAt = undefined;
    Object.values(current.games || {}).forEach((game) => {
      game.timePlayedMs = game.timePlayedMs ?? 0;
      game.sessionStartedAt = undefined;
    });
    current.schemaVersion = 2;
  }
  if (current.schemaVersion < 3) {
    current.favorites = Array.isArray(current.favorites)
      ? Array.from(new Set(current.favorites.filter((id) => typeof id === "string")))
      : [];
    current.schemaVersion = 3;
  }
  if (!current.playerProfile.avatarType) {
    current.playerProfile.avatarType = current.playerProfile.avatarUrl ? "image" : "emoji";
  }
  if (current.schemaVersion < CURRENT_SCHEMA_VERSION) {
    current.schemaVersion = CURRENT_SCHEMA_VERSION;
  }
  return sanitizeSaveNumbers(current);
}

export function loadSave(): SaveState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return createEmptySave();
    if (raw.length > MAX_SAVE_BYTES) {
      throw new Error("Save payload too large");
    }
    const parsed = JSON.parse(raw);
    const validated = SaveSchema.parse(parsed);
    return migrateSave(validated);
  } catch (err) {
    console.warn("Corrupt save detected, resetting.", err);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (removeErr) {
      console.warn("Failed to clear corrupt save.", removeErr);
    }
    return createEmptySave();
  }
}

export function persistSave(state: SaveState, options?: { force?: boolean }) {
  const payload = { ...state, schemaVersion: CURRENT_SCHEMA_VERSION };
  const nextRaw = JSON.stringify(payload);
  const currentRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!options?.force && currentRaw === nextRaw) return;
  localStorage.setItem(LOCAL_STORAGE_KEY, nextRaw);
  notifySaveListeners(payload);
}

export function updateSave(mutator: (state: SaveState) => void): SaveState {
  const state = loadSave();
  mutator(state);
  persistSave(state);
  return state;
}

export function exportSave(): string {
  const state = loadSave();
  return JSON.stringify(state, null, 2);
}

export function importSave(json: string): { success: boolean; error?: string; state?: SaveState } {
  try {
    if (json.length > MAX_SAVE_BYTES) {
      return { success: false, error: "Import trop volumineux" };
    }
    const parsed = JSON.parse(json);
    const validated = SaveSchema.parse(parsed);
    const migrated = migrateSave(validated);
    persistSave(migrated);
    return { success: true, state: migrated };
  } catch (err: any) {
    return { success: false, error: err?.message || "Import invalide" };
  }
}

export function resetSave() {
  const empty = createEmptySave();
  persistSave(empty, { force: true });
  return empty;
}

export function resetGameSave(gameId: string) {
  return updateSave((state) => {
    delete state.games[gameId];
  });
}

export function getGameState(state: SaveState, gameId: string, saveSchemaVersion = 1): GameSaveState {
  if (!state.games[gameId]) {
    state.games[gameId] = { saveSchemaVersion, state: {}, timePlayedMs: 0, xpEarned: 0 };
  } else if (state.games[gameId].xpEarned === undefined) {
    state.games[gameId].xpEarned = 0;
  }
  return state.games[gameId];
}

export function touchLastPlayed(state: SaveState, gameId: string) {
  state.playerProfile.lastPlayedGameId = gameId;
  const gameState = getGameState(state, gameId);
  gameState.lastPlayedAt = Date.now();
}

export function updateGameState(
  gameId: string,
  saveSchemaVersion: number,
  mutator: (game: GameSaveState) => void,
) {
  return updateSave((state) => {
    const gs = getGameState(state, gameId, saveSchemaVersion);
    gs.saveSchemaVersion = saveSchemaVersion;
    mutator(gs);
    touchLastPlayed(state, gameId);
  });
}

type SaveListener = (state: SaveState) => void;
const saveListeners: SaveListener[] = [];

function notifySaveListeners(state: SaveState) {
  saveListeners.forEach((listener) => listener(state));
}

export function subscribeToSaveChanges(listener: SaveListener) {
  saveListeners.push(listener);
  return () => {
    const idx = saveListeners.indexOf(listener);
    if (idx >= 0) saveListeners.splice(idx, 1);
  };
}

if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
  import("./cloud");
}
