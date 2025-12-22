import "./style.css";
import "@core/launch-menu.css";
import { createHybridInput, createMobileControls } from "@core/input";
import { createGameLoop } from "@core/loop";
import { chance, clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { loadSave, updateGameState } from "@storage";

type Brick = {
  x: number;
  y: number;
  w: number;
  h: number;
  row: number;
  col: number;
  alive: boolean;
  color: string;
};

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  stuck: boolean;
};

type PowerupKind = "bonus" | "malus";
type PowerupType =
  | "extra-ball"
  | "speed-up"
  | "invert-controls"
  | "screen-shake"
  | "paddle-shrink"
  | "paddle-slow"
  | "ball-small";

type PowerupDefinition = {
  type: PowerupType;
  label: string;
  symbol: string;
  color: string;
  kind: PowerupKind;
  duration?: number;
  speedMultiplier?: number;
  paddleWidthMultiplier?: number;
  paddleSpeedMultiplier?: number;
  ballRadiusMultiplier?: number;
  weight: number;
};

type Powerup = {
  x: number;
  y: number;
  vy: number;
  size: number;
  type: PowerupType;
  label: string;
  symbol: string;
  color: string;
  kind: PowerupKind;
  duration?: number;
  speedMultiplier?: number;
  paddleWidthMultiplier?: number;
  paddleSpeedMultiplier?: number;
  ballRadiusMultiplier?: number;
};

const GAME_ID = "breakout";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = themes.find((t) => t.id === config?.themeId) || themes[0];
attachProgressionListener();

if (theme) {
  const root = document.documentElement.style;
  root.setProperty("--color-primary", theme.colors.primary);
  root.setProperty("--color-secondary", theme.colors.secondary);
  root.setProperty("--color-accent", theme.colors.accent);
  root.setProperty("--color-text", theme.colors.text);
  root.setProperty("--color-muted", theme.colors.muted);
  root.setProperty("--color-bg", theme.colors.background);
  document.body.style.background = theme.gradient || theme.colors.background;
}

const gameRoot = document.getElementById("game-root") as HTMLDivElement;
const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ui = document.getElementById("ui") as HTMLDivElement;
const ctx = canvas.getContext("2d")!;
const input = createHybridInput();
const overlay = document.createElement("div");
overlay.className = "launch-overlay";
overlay.style.display = "none";
ui.appendChild(overlay);

const toastLayer = document.createElement("div");
toastLayer.className = "toast-layer";
gameRoot.appendChild(toastLayer);

const controls = {
  left: config?.input.keys.left || "ArrowLeft",
  right: config?.input.keys.right || "ArrowRight",
  altLeft: config?.input.keys.altLeft || "KeyQ",
  altRight: config?.input.keys.altRight || "KeyD",
  launch: config?.input.keys.launch || "Space",
};

const isMobile =
  typeof window !== "undefined" &&
  (window.matchMedia?.("(pointer: coarse)")?.matches || navigator.maxTouchPoints > 0);

const mobileControls = isMobile
  ? createMobileControls({
      container: document.body,
      input,
      mapping: {
        left: controls.left,
        right: controls.right,
        actionA: controls.launch,
        actionALabel: "Lancer",
      },
      autoShow: false,
      showPad: true,
      gestureEnabled: false,
      showOnDesktop: false,
    })
  : {
      show: () => {},
      hide: () => {},
      dispose: () => {},
    };

const baseRows = config?.difficultyParams.rows ?? 6;
const baseCols = config?.difficultyParams.cols ?? 10;
const baseLives = config?.difficultyParams.lives ?? 3;
const baseBallSpeed = config?.difficultyParams.ballSpeed ?? 320;
const basePoints = config?.difficultyParams.pointsPerBrick ?? 10;

const difficultyPresets = {
  easy: {
    label: "Facile",
    rows: baseRows + 1,
    cols: baseCols + 1,
    lives: Math.max(3, baseLives + 1),
    ballSpeed: Math.round(baseBallSpeed * 0.92),
    pointsPerBrick: Math.max(6, basePoints),
    brickDensity: 0.78,
    powerupChance: 0.24,
  },
  medium: {
    label: "Moyen",
    rows: baseRows + 2,
    cols: baseCols + 2,
    lives: baseLives,
    ballSpeed: baseBallSpeed,
    pointsPerBrick: basePoints,
    brickDensity: 0.86,
    powerupChance: 0.2,
  },
  hard: {
    label: "Difficile",
    rows: baseRows + 3,
    cols: baseCols + 3,
    lives: Math.max(2, baseLives - 1),
    ballSpeed: Math.round(baseBallSpeed * 1.1),
    pointsPerBrick: basePoints + 2,
    brickDensity: 0.92,
    powerupChance: 0.18,
  },
  extreme: {
    label: "Extreme",
    rows: baseRows + 4,
    cols: baseCols + 4,
    lives: 1,
    ballSpeed: Math.round(baseBallSpeed * 1.2),
    pointsPerBrick: basePoints + 4,
    brickDensity: 0.97,
    powerupChance: 0.16,
  },
} as const;

type DifficultyKey = keyof typeof difficultyPresets;
let selectedDifficulty: DifficultyKey = "medium";
const initialPreset = difficultyPresets[selectedDifficulty];

const powerupDefinitions: PowerupDefinition[] = [
  {
    type: "extra-ball",
    label: "Balles supplementaires",
    symbol: "+1",
    color: theme.colors.primary,
    kind: "bonus",
    weight: 2,
  },
  {
    type: "speed-up",
    label: "Vitesse acceleree",
    symbol: "V+",
    color: "#f97316",
    kind: "malus",
    duration: 6,
    speedMultiplier: 1.35,
    weight: 3,
  },
  {
    type: "invert-controls",
    label: "Touches inversees",
    symbol: "INV",
    color: "#fb7185",
    kind: "malus",
    duration: 6,
    weight: 3,
  },
  {
    type: "screen-shake",
    label: "Ecran qui tremble",
    symbol: "SHA",
    color: "#f43f5e",
    kind: "malus",
    duration: 1.4,
    weight: 2,
  },
  {
    type: "paddle-shrink",
    label: "Raquette reduite",
    symbol: "R-",
    color: "#f472b6",
    kind: "malus",
    duration: 8,
    paddleWidthMultiplier: 0.6,
    weight: 3,
  },
  {
    type: "paddle-slow",
    label: "Raquette lente",
    symbol: "LNT",
    color: "#fb923c",
    kind: "malus",
    duration: 6,
    paddleSpeedMultiplier: 0.6,
    weight: 2,
  },
  {
    type: "ball-small",
    label: "Balle minuscule",
    symbol: "MIN",
    color: "#38bdf8",
    kind: "malus",
    duration: 6,
    ballRadiusMultiplier: 0.7,
    weight: 2,
  },
];

const state = {
  running: false,
  width: 0,
  height: 0,
  dpr: devicePixelRatio || 1,
  play: { x: 0, y: 0, w: 0, h: 0 },
  paddle: { x: 0, y: 0, w: 120, h: 16, speed: 640 },
  paddleBaseWidth: 120,
  paddleWidthMultiplier: 1,
  paddleWidthTimer: 0,
  paddleSpeedMultiplier: 1,
  paddleSpeedTimer: 0,
  balls: [] as Ball[],
  ballRadius: 8,
  ballRadiusMultiplier: 1,
  ballRadiusTimer: 0,
  rows: initialPreset.rows,
  cols: initialPreset.cols,
  brickGap: clamp(config?.difficultyParams.brickGap ?? 8, 4, 14),
  brickHeight: 22,
  bricks: [] as Brick[],
  bricksRemaining: 0,
  totalBricks: 0,
  clearedRows: new Set<number>(),
  score: 0,
  best: loadSave().games[GAME_ID]?.bestScore ?? 0,
  lives: initialPreset.lives,
  ballSpeed: initialPreset.ballSpeed,
  ballSpeedMultiplier: 1,
  pointsPerBrick: initialPreset.pointsPerBrick,
  brickDensity: initialPreset.brickDensity,
  powerupChance: initialPreset.powerupChance,
  powerupSize: 20,
  powerupFallSpeed: 160,
  powerups: [] as Powerup[],
  invertTimer: 0,
  speedTimer: 0,
  shakeTimer: 0,
  shakeDuration: 0,
  launchHeld: false,
  flash: 0,
};

const loop = createGameLoop({
  update: (dt) => update(dt),
  render,
  fps: 60,
});

function resize() {
  const prevPlay = { ...state.play };
  state.dpr = devicePixelRatio || 1;
  canvas.width = window.innerWidth * state.dpr;
  canvas.height = window.innerHeight * state.dpr;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  state.width = canvas.width / state.dpr;
  state.height = canvas.height / state.dpr;
  layoutPlayfield();
  if (prevPlay.w > 0 && prevPlay.h > 0) {
    const paddleRatio = (state.paddle.x - prevPlay.x) / prevPlay.w;
    state.paddle.x = state.play.x + clamp(paddleRatio, 0, 1) * state.play.w;
    state.balls.forEach((ball) => {
      if (ball.stuck) return;
      const ballRatioX = (ball.x - prevPlay.x) / prevPlay.w;
      const ballRatioY = (ball.y - prevPlay.y) / prevPlay.h;
      ball.x = state.play.x + ballRatioX * state.play.w;
      ball.y = state.play.y + ballRatioY * state.play.h;
    });
    state.powerups.forEach((powerup) => {
      const powerupRatioX = (powerup.x - prevPlay.x) / prevPlay.w;
      const powerupRatioY = (powerup.y - prevPlay.y) / prevPlay.h;
      powerup.x = state.play.x + powerupRatioX * state.play.w;
      powerup.y = state.play.y + powerupRatioY * state.play.h;
    });
  } else {
    state.paddle.x = state.play.x + (state.play.w - state.paddle.w) / 2;
  }
  if (state.balls.some((ball) => ball.stuck)) {
    stickBallToPaddle();
  }
  positionBricks();
}

function layoutPlayfield() {
  const margin = Math.max(16, Math.min(state.width, state.height) * 0.05);
  const playWidth = Math.min(state.width - margin * 2, 920);
  const playHeight = state.height - margin * 2;
  state.play.x = (state.width - playWidth) / 2;
  state.play.y = margin;
  state.play.w = playWidth;
  state.play.h = playHeight;

  const basePaddleWidth = clamp(
    config?.difficultyParams.paddleWidth ?? playWidth * 0.24,
    playWidth * 0.16,
    playWidth * 0.34,
  );
  state.paddleBaseWidth = basePaddleWidth;
  state.paddle.w = clamp(
    basePaddleWidth * state.paddleWidthMultiplier,
    playWidth * 0.12,
    playWidth * 0.38,
  );
  state.paddle.h = clamp(Math.floor(playHeight * 0.03), 10, 18);
  state.paddle.y = state.play.y + state.play.h - state.paddle.h - Math.max(16, playHeight * 0.04);

  state.ballRadius = clamp(Math.floor(playWidth * 0.012), 6, 10);
  state.brickGap = clamp(config?.difficultyParams.brickGap ?? 6, 3, 10);
  const rows = Math.max(1, state.rows);
  const brickBand = Math.max(140, playHeight * 0.55);
  const maxBrickHeight = Math.floor((brickBand - state.brickGap * (rows - 1)) / rows);
  state.brickHeight = clamp(maxBrickHeight, 10, 22);
  state.powerupSize = clamp(Math.floor(playWidth * 0.03), 16, 26);
  state.powerupFallSpeed = clamp(playHeight * 0.22, 120, 240);

  updateBallRadius();
  state.powerups.forEach((powerup) => {
    powerup.size = state.powerupSize;
    powerup.vy = state.powerupFallSpeed;
  });
}

function positionBricks() {
  if (!state.bricks.length) return;
  const brickW = (state.play.w - state.brickGap * (state.cols - 1)) / state.cols;
  const startX = state.play.x;
  const startY = state.play.y + Math.max(18, state.play.h * 0.08);
  state.bricks.forEach((brick) => {
    brick.w = brickW;
    brick.h = state.brickHeight;
    brick.x = startX + brick.col * (brickW + state.brickGap);
    brick.y = startY + brick.row * (state.brickHeight + state.brickGap);
  });
}

function buildBricks() {
  const palette = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    "#ffd166",
    "#7ce7ff",
  ];
  const brickW = (state.play.w - state.brickGap * (state.cols - 1)) / state.cols;
  const startX = state.play.x;
  const startY = state.play.y + Math.max(18, state.play.h * 0.08);
  state.bricks = [];
  state.clearedRows = new Set();

  const density = clamp(state.brickDensity, 0.2, 1);
  const totalCells = state.rows * state.cols;
  const target = Math.round(totalCells * density);
  const minBricks = Math.max(8, Math.floor(target * 0.75));
  const emptySlots: Array<{ row: number; col: number }> = [];

  const addBrick = (row: number, col: number) => {
    state.bricks.push({
      x: startX + col * (brickW + state.brickGap),
      y: startY + row * (state.brickHeight + state.brickGap),
      w: brickW,
      h: state.brickHeight,
      row,
      col,
      alive: true,
      color: palette[row % palette.length],
    });
  };

  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      if (chance(density)) {
        addBrick(row, col);
      } else {
        emptySlots.push({ row, col });
      }
    }
  }

  if (state.bricks.length < minBricks && emptySlots.length > 0) {
    for (let i = emptySlots.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand(0, i + 1));
      [emptySlots[i], emptySlots[j]] = [emptySlots[j], emptySlots[i]];
    }
    for (const slot of emptySlots) {
      if (state.bricks.length >= minBricks) break;
      addBrick(slot.row, slot.col);
    }
  }

  if (state.bricks.length === 0) {
    addBrick(Math.floor(state.rows / 2), Math.floor(state.cols / 2));
  }

  state.totalBricks = state.bricks.length;
  state.bricksRemaining = state.totalBricks;
}

function stickBallToPaddle() {
  state.balls.forEach((ball) => {
    if (!ball.stuck) return;
    ball.x = state.paddle.x + state.paddle.w / 2;
    ball.y = state.paddle.y - ball.r - 4;
  });
}

function createBall(stuck: boolean) {
  const radius = getBallRadius();
  return {
    x: state.paddle.x + state.paddle.w / 2,
    y: state.paddle.y - radius - 4,
    vx: 0,
    vy: 0,
    r: radius,
    stuck,
  };
}

function resetBall() {
  state.balls = [createBall(true)];
}

function getBallSpeed() {
  return state.ballSpeed * state.ballSpeedMultiplier;
}

function setBallSpeedMultiplier(mult: number) {
  const next = clamp(mult, 0.6, 1.6);
  if (next === state.ballSpeedMultiplier) return;
  const ratio = next / state.ballSpeedMultiplier;
  state.ballSpeedMultiplier = next;
  state.balls.forEach((ball) => {
    if (ball.stuck) return;
    ball.vx *= ratio;
    ball.vy *= ratio;
  });
}

function getBallRadius() {
  return clamp(state.ballRadius * state.ballRadiusMultiplier, 4, 12);
}

function updateBallRadius() {
  const radius = getBallRadius();
  state.balls.forEach((ball) => {
    ball.r = radius;
  });
  if (state.balls.some((ball) => ball.stuck)) {
    stickBallToPaddle();
  }
}

function setBallRadiusMultiplier(mult: number) {
  const next = clamp(mult, 0.5, 1.4);
  if (next === state.ballRadiusMultiplier) return;
  state.ballRadiusMultiplier = next;
  updateBallRadius();
}

function applyBallRadiusEffect(multiplier: number, duration: number) {
  setBallRadiusMultiplier(multiplier);
  state.ballRadiusTimer = duration;
}

function setPaddleWidthMultiplier(mult: number) {
  const next = clamp(mult, 0.45, 1.5);
  if (next === state.paddleWidthMultiplier) return;
  state.paddleWidthMultiplier = next;
  const minW = state.play.w * 0.12;
  const maxW = state.play.w * 0.38;
  state.paddle.w = clamp(state.paddleBaseWidth * state.paddleWidthMultiplier, minW, maxW);
  state.paddle.x = clamp(state.paddle.x, state.play.x, state.play.x + state.play.w - state.paddle.w);
  if (state.balls.some((ball) => ball.stuck)) {
    stickBallToPaddle();
  }
}

function applyPaddleWidthEffect(multiplier: number, duration: number) {
  setPaddleWidthMultiplier(multiplier);
  state.paddleWidthTimer = duration;
}

function setPaddleSpeedMultiplier(mult: number) {
  const next = clamp(mult, 0.45, 1.6);
  state.paddleSpeedMultiplier = next;
}

function applyPaddleSpeedEffect(multiplier: number, duration: number) {
  setPaddleSpeedMultiplier(multiplier);
  state.paddleSpeedTimer = duration;
}

function applySpeedEffect(multiplier: number, duration: number) {
  setBallSpeedMultiplier(multiplier);
  state.speedTimer = duration;
}

function triggerShake(duration: number) {
  state.shakeTimer = duration;
  state.shakeDuration = duration;
}

function clearShake() {
  state.shakeTimer = 0;
  state.shakeDuration = 0;
  gameRoot.style.transform = "";
}

function launchBall() {
  const spread = Math.PI / 3;
  const speed = getBallSpeed();
  state.balls.forEach((ball) => {
    if (!ball.stuck) return;
    const angle = -Math.PI / 2 + rand(-spread / 2, spread / 2);
    ball.vx = Math.cos(angle) * speed;
    ball.vy = Math.sin(angle) * speed;
    ball.stuck = false;
  });
}

function spawnExtraBalls(count: number) {
  const radius = getBallRadius();
  const baseX = state.paddle.x + state.paddle.w / 2;
  const baseY = state.paddle.y - radius - 4;
  const spread = Math.PI / 2.2;
  const speed = getBallSpeed();
  for (let i = 0; i < count; i += 1) {
    const angle = -Math.PI / 2 + rand(-spread / 2, spread / 2);
    state.balls.push({
      x: baseX + rand(-12, 12),
      y: baseY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: radius,
      stuck: false,
    });
  }
}

function showToast(text: string, kind: PowerupKind) {
  const toast = document.createElement("div");
  toast.className = `toast ${kind}`;
  toast.textContent = text;
  toastLayer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });
  window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.remove(), 220);
  }, 1400);
}

function pickPowerupDefinition() {
  const totalWeight = powerupDefinitions.reduce((sum, def) => sum + def.weight, 0);
  let roll = rand(0, totalWeight);
  for (const def of powerupDefinitions) {
    roll -= def.weight;
    if (roll <= 0) return def;
  }
  return powerupDefinitions[0];
}

function spawnPowerup(x: number, y: number) {
  const def = pickPowerupDefinition();
  state.powerups.push({
    x,
    y,
    vy: state.powerupFallSpeed + rand(-20, 40),
    size: state.powerupSize,
    type: def.type,
    label: def.label,
    symbol: def.symbol,
    color: def.color,
    kind: def.kind,
    duration: def.duration,
    speedMultiplier: def.speedMultiplier,
    paddleWidthMultiplier: def.paddleWidthMultiplier,
    paddleSpeedMultiplier: def.paddleSpeedMultiplier,
    ballRadiusMultiplier: def.ballRadiusMultiplier,
  });
}

function maybeSpawnPowerup(brick: Brick) {
  if (!chance(state.powerupChance)) return;
  spawnPowerup(brick.x + brick.w / 2, brick.y + brick.h / 2);
}

function applyPowerup(powerup: Powerup) {
  const prefix = powerup.kind === "bonus" ? "Bonus" : "Malus";
  showToast(`${prefix}: ${powerup.label}`, powerup.kind);
  switch (powerup.type) {
    case "extra-ball":
      spawnExtraBalls(2);
      break;
    case "speed-up":
      applySpeedEffect(powerup.speedMultiplier ?? 1.3, powerup.duration ?? 6);
      break;
    case "invert-controls":
      state.invertTimer = powerup.duration ?? 6;
      break;
    case "screen-shake":
      triggerShake(powerup.duration ?? 1.2);
      break;
    case "paddle-shrink":
      applyPaddleWidthEffect(powerup.paddleWidthMultiplier ?? 0.6, powerup.duration ?? 8);
      break;
    case "paddle-slow":
      applyPaddleSpeedEffect(powerup.paddleSpeedMultiplier ?? 0.6, powerup.duration ?? 6);
      break;
    case "ball-small":
      applyBallRadiusEffect(powerup.ballRadiusMultiplier ?? 0.7, powerup.duration ?? 6);
      break;
    default:
      break;
  }
}

function updatePowerups(dt: number) {
  const paddle = state.paddle;
  const playBottom = state.play.y + state.play.h;
  state.powerups = state.powerups.filter((powerup) => {
    powerup.y += powerup.vy * dt;
    if (powerup.y - powerup.size > playBottom) return false;
    const hit =
      powerup.y + powerup.size / 2 >= paddle.y &&
      powerup.y - powerup.size / 2 <= paddle.y + paddle.h &&
      powerup.x >= paddle.x &&
      powerup.x <= paddle.x + paddle.w;
    if (hit) {
      applyPowerup(powerup);
      return false;
    }
    return true;
  });
}

function applyDifficulty(preset: (typeof difficultyPresets)[DifficultyKey]) {
  state.rows = preset.rows;
  state.cols = preset.cols;
  state.lives = preset.lives;
  state.ballSpeed = preset.ballSpeed;
  state.pointsPerBrick = preset.pointsPerBrick;
  state.brickDensity = clamp(preset.brickDensity, 0.2, 1);
  state.powerupChance = clamp(preset.powerupChance, 0.05, 0.4);
}

function resetEffects() {
  state.invertTimer = 0;
  state.speedTimer = 0;
  state.paddleWidthTimer = 0;
  state.paddleSpeedTimer = 0;
  state.ballRadiusTimer = 0;
  setBallSpeedMultiplier(1);
  setPaddleWidthMultiplier(1);
  setPaddleSpeedMultiplier(1);
  setBallRadiusMultiplier(1);
  clearShake();
}

function startGame() {
  if (!config) {
    showOverlay("Config manquante", "Ajoute configs/games/breakout.config.json", false);
    return;
  }
  mobileControls.show();
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  applyDifficulty(preset);
  layoutPlayfield();
  resetEffects();
  toastLayer.innerHTML = "";
  state.running = true;
  state.score = 0;
  state.flash = 0;
  state.powerups = [];
  state.paddle.x = state.play.x + (state.play.w - state.paddle.w) / 2;
  resetBall();
  buildBricks();
  overlay.style.display = "none";
  canvas.style.pointerEvents = "auto";
  ui.style.pointerEvents = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  mobileControls.hide();
  resetEffects();
  state.powerups = [];
  toastLayer.innerHTML = "";
  const score = state.score;
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score } });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const best = game.bestScore || 0;
    if (score > best) {
      game.bestScore = score;
    }
    const destroyed = state.totalBricks - state.bricksRemaining;
    const bestBricks = (game.state.bestBricks as number | undefined) || 0;
    if (destroyed > bestBricks) {
      game.state.bestBricks = destroyed;
    }
  });
  state.best = Math.max(state.best, score);
  const title = win ? "Victoire" : "Perdu";
  showOverlay(title, config?.uiText.help || "Relance une partie pour battre ton record.", true, score);
}

function loseLife() {
  state.lives = Math.max(0, state.lives - 1);
  state.flash = 1;
  if (state.lives <= 0) {
    endGame(false);
  } else {
    resetBall();
  }
}

function breakBrick(brick: Brick) {
  if (!brick.alive) return;
  brick.alive = false;
  state.bricksRemaining -= 1;
  state.score += state.pointsPerBrick;
  emitEvent({ type: "BRICK_BROKEN", gameId: GAME_ID, payload: { score: state.score } });
  maybeSpawnPowerup(brick);

  if (!state.clearedRows.has(brick.row)) {
    const rowCleared = !state.bricks.some((b) => b.alive && b.row === brick.row);
    if (rowCleared) {
      state.clearedRows.add(brick.row);
      emitEvent({ type: "ROW_CLEARED", gameId: GAME_ID });
    }
  }

  if (state.bricksRemaining <= 0) {
    endGame(true);
  }
}

function updateEffects(dt: number) {
  if (state.speedTimer > 0) {
    state.speedTimer = Math.max(0, state.speedTimer - dt);
    if (state.speedTimer === 0) {
      setBallSpeedMultiplier(1);
    }
  }
  if (state.paddleWidthTimer > 0) {
    state.paddleWidthTimer = Math.max(0, state.paddleWidthTimer - dt);
    if (state.paddleWidthTimer === 0) {
      setPaddleWidthMultiplier(1);
    }
  }
  if (state.paddleSpeedTimer > 0) {
    state.paddleSpeedTimer = Math.max(0, state.paddleSpeedTimer - dt);
    if (state.paddleSpeedTimer === 0) {
      setPaddleSpeedMultiplier(1);
    }
  }
  if (state.ballRadiusTimer > 0) {
    state.ballRadiusTimer = Math.max(0, state.ballRadiusTimer - dt);
    if (state.ballRadiusTimer === 0) {
      setBallRadiusMultiplier(1);
    }
  }
  if (state.invertTimer > 0) {
    state.invertTimer = Math.max(0, state.invertTimer - dt);
  }
  if (state.shakeTimer > 0) {
    state.shakeTimer = Math.max(0, state.shakeTimer - dt);
  }
  if (state.shakeTimer > 0) {
    const intensity = state.shakeDuration > 0 ? state.shakeTimer / state.shakeDuration : 0;
    const offset = Math.max(1, 8 * intensity);
    gameRoot.style.transform = `translate(${rand(-offset, offset)}px, ${rand(-offset, offset)}px)`;
  } else if (gameRoot.style.transform) {
    gameRoot.style.transform = "";
  }
}

function updateBalls(dt: number) {
  if (state.balls.some((ball) => ball.stuck)) {
    stickBallToPaddle();
  }
  for (let i = state.balls.length - 1; i >= 0; i -= 1) {
    const ball = state.balls[i];
    if (ball.stuck) continue;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    const lost = handleCollisions(ball);
    if (lost) {
      state.balls.splice(i, 1);
    }
  }
  if (state.balls.length === 0) {
    loseLife();
  }
}

function update(dt: number) {
  if (!state.running) return;
  updateEffects(dt);

  const leftDown = input.isDown(controls.left) || input.isDown(controls.altLeft);
  const rightDown = input.isDown(controls.right) || input.isDown(controls.altRight);
  const moveRaw = (rightDown ? 1 : 0) - (leftDown ? 1 : 0);
  const move = state.invertTimer > 0 ? -moveRaw : moveRaw;
  if (move !== 0) {
    state.paddle.x += move * state.paddle.speed * state.paddleSpeedMultiplier * dt;
  }
  state.paddle.x = clamp(state.paddle.x, state.play.x, state.play.x + state.play.w - state.paddle.w);

  const launchDown = input.isDown(controls.launch);
  if (state.balls.some((ball) => ball.stuck) && launchDown && !state.launchHeld) {
    launchBall();
  }
  state.launchHeld = launchDown;

  updateBalls(dt);
  if (!state.running) return;
  updatePowerups(dt);
  state.flash = Math.max(0, state.flash - dt * 2);
}

function handleCollisions(ball: Ball) {
  const play = state.play;
  if (ball.x - ball.r <= play.x) {
    ball.x = play.x + ball.r;
    ball.vx = Math.abs(ball.vx);
  }
  if (ball.x + ball.r >= play.x + play.w) {
    ball.x = play.x + play.w - ball.r;
    ball.vx = -Math.abs(ball.vx);
  }
  if (ball.y - ball.r <= play.y) {
    ball.y = play.y + ball.r;
    ball.vy = Math.abs(ball.vy);
  }
  if (ball.y - ball.r > play.y + play.h) {
    return true;
  }

  if (
    ball.vy > 0 &&
    ball.y + ball.r >= state.paddle.y &&
    ball.y - ball.r <= state.paddle.y + state.paddle.h &&
    ball.x >= state.paddle.x &&
    ball.x <= state.paddle.x + state.paddle.w
  ) {
    const hit = (ball.x - (state.paddle.x + state.paddle.w / 2)) / (state.paddle.w / 2);
    const clampedHit = clamp(hit, -1, 1);
    const angle = clampedHit * (Math.PI / 3);
    const speed = getBallSpeed();
    ball.vx = Math.sin(angle) * speed;
    ball.vy = -Math.cos(angle) * speed;
    ball.y = state.paddle.y - ball.r - 0.5;
  }

  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (
      ball.x + ball.r < brick.x ||
      ball.x - ball.r > brick.x + brick.w ||
      ball.y + ball.r < brick.y ||
      ball.y - ball.r > brick.y + brick.h
    ) {
      continue;
    }

    const overlapX = Math.min(
      ball.x + ball.r - brick.x,
      brick.x + brick.w - (ball.x - ball.r),
    );
    const overlapY = Math.min(
      ball.y + ball.r - brick.y,
      brick.y + brick.h - (ball.y - ball.r),
    );

    if (overlapX < overlapY) {
      ball.vx *= -1;
    } else {
      ball.vy *= -1;
    }

    breakBrick(brick);
    break;
  }

  return false;
}

function drawRoundedRect(x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function renderPowerups() {
  if (!state.powerups.length) return;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  state.powerups.forEach((powerup) => {
    const size = powerup.size;
    const half = size / 2;
    const grad = ctx.createLinearGradient(
      powerup.x - half,
      powerup.y - half,
      powerup.x + half,
      powerup.y + half,
    );
    grad.addColorStop(0, powerup.color);
    grad.addColorStop(1, `${powerup.color}cc`);
    ctx.fillStyle = grad;
    drawRoundedRect(powerup.x - half, powerup.y - half, size, size, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#0b1020";
    ctx.font = `700 ${Math.max(10, size * 0.45)}px "Space Grotesk", "Sora", system-ui, sans-serif`;
    ctx.fillText(powerup.symbol, powerup.x, powerup.y + 0.5);
  });
  ctx.restore();
}

function render() {
  ctx.save();
  ctx.scale(state.dpr, state.dpr);
  ctx.clearRect(0, 0, state.width, state.height);

  const bg = ctx.createLinearGradient(0, 0, state.width, state.height);
  bg.addColorStop(0, "rgba(96,165,250,0.08)");
  bg.addColorStop(0.5, "rgba(251,191,36,0.05)");
  bg.addColorStop(1, "rgba(244,114,182,0.08)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  drawRoundedRect(state.play.x, state.play.y, state.play.w, state.play.h, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  state.bricks.forEach((brick) => {
    if (!brick.alive) return;
    const grad = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.h);
    grad.addColorStop(0, brick.color);
    grad.addColorStop(1, `${brick.color}cc`);
    ctx.fillStyle = grad;
    drawRoundedRect(brick.x, brick.y, brick.w, brick.h, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  renderPowerups();

  const paddleGrad = ctx.createLinearGradient(
    state.paddle.x,
    state.paddle.y,
    state.paddle.x + state.paddle.w,
    state.paddle.y,
  );
  paddleGrad.addColorStop(0, theme.colors.secondary);
  paddleGrad.addColorStop(1, theme.colors.primary);
  ctx.fillStyle = paddleGrad;
  drawRoundedRect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h, 10);
  ctx.fill();

  state.balls.forEach((ball) => {
    const ballGlow = ctx.createRadialGradient(
      ball.x - ball.r * 0.4,
      ball.y - ball.r * 0.4,
      ball.r * 0.2,
      ball.x,
      ball.y,
      ball.r,
    );
    ballGlow.addColorStop(0, "#ffffff");
    ballGlow.addColorStop(1, theme.colors.accent);
    ctx.fillStyle = ballGlow;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
  renderHUD();
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const destroyed = state.totalBricks - state.bricksRemaining;
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  const hasStuck = state.balls.some((ball) => ball.stuck);
  const hudTop = document.createElement("div");
  hudTop.className = "hud";
  hudTop.innerHTML = `
    <div class="chip">Score <strong>${state.score}</strong></div>
    <div class="chip">Briques <strong>${destroyed}/${state.totalBricks}</strong></div>
    <div class="chip ghost">Vies <span>${state.lives}</span></div>
    <div class="chip ghost">Record <span>${state.best}</span></div>
    <div class="chip ghost">Niveau <span>${preset.label}</span></div>
  `;
  ui.appendChild(hudTop);

  const hudBottom = document.createElement("div");
  hudBottom.className = "hud bottom";
  hudBottom.innerHTML = `
    <div class="pill ${hasStuck ? "glow" : ""}">${
      hasStuck ? "Pret a lancer" : `Balles ${state.balls.length}`
    }</div>
    <div class="pill ghost">${hasStuck ? "Espace pour lancer" : "Attrape les bonus/malus"}</div>
  `;
  ui.appendChild(hudBottom);
}

function showOverlay(title: string, body: string, showStart = true, lastScore?: number) {
  mobileControls.hide();
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  overlay.style.display = "grid";
  ui.style.pointerEvents = "auto";
  canvas.style.pointerEvents = "none";
  const shortDescription = config?.uiText.shortDescription || "";
  const description = body || config?.uiText.help || "";
  const controlsList = (config?.uiText.controls || [])
    .map((item) => `<span class="launch-chip">${item}</span>`)
    .join("");
  const bricksEstimate = Math.round(preset.rows * preset.cols * preset.brickDensity);
  const extraHelp =
    "Bonus/Malus tombent : balles +, vitesse accélérée, touches inversées, écran qui tremble, raquette réduite, raquette lente, balle minuscule.";
  const difficultyOptions = Object.entries(difficultyPresets)
    .map(
      ([key, option]) => `
        <button class="launch-option diff-btn ${key === selectedDifficulty ? "is-active" : ""}" data-diff="${key}">
          <span class="launch-option-title">${option.label}</span>
          <span class="launch-option-meta">${option.rows}x${option.cols} · ${option.lives} vie${
            option.lives > 1 ? "s" : ""
          }</span>
        </button>
      `,
    )
    .join("");
  const settingsMarkup = `
    <div class="launch-rows">
      <div class="launch-row">
        <span class="launch-row-label">Difficulté</span>
        <div class="launch-row-value launch-options">
          ${difficultyOptions}
        </div>
      </div>
      <div class="launch-row">
        <span class="launch-row-label">Mode</span>
        <div class="launch-row-value">
          <span class="launch-chip">Standard</span>
        </div>
      </div>
    </div>
  `;
  const metricsMarkup = `
    <div class="launch-metrics">
      <div class="launch-metric"><span>Record</span><strong>${state.best}</strong></div>
      <div class="launch-metric"><span>Briques</span><strong>~${bricksEstimate}</strong></div>
      <div class="launch-metric"><span>Vies</span><strong>${preset.lives}</strong></div>
    </div>
  `;
  overlay.innerHTML = `
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${config?.uiText.title || "Casse-briques"}</span>
        </div>
        <h2 class="launch-title">${title}</h2>
        ${shortDescription ? `<p class="launch-subtitle">${shortDescription}</p>` : ""}
      </div>
      <div class="launch-grid">
        <section class="launch-section">
          <h3 class="launch-section-title">Briefing</h3>
          <p class="launch-text">${description}</p>
          ${lastScore !== undefined ? `<p class="launch-note">Dernier score : ${lastScore}</p>` : ""}
          <p class="launch-note">${extraHelp}</p>
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Paramètres</h3>
          ${settingsMarkup}
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Contrôles</h3>
          <div class="launch-chips">
            ${controlsList || `<span class="launch-chip muted">Contrôles à définir</span>`}
          </div>
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Repères</h3>
          ${metricsMarkup}
        </section>
      </div>
      <div class="launch-actions">
        ${showStart ? `<button class="launch-btn primary" id="launch-start">Lancer</button>` : ""}
        <a class="launch-btn ghost" href="${withBasePath("/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
    </div>
  `;
  document.getElementById("launch-start")?.addEventListener("click", startGame);
  document.querySelectorAll<HTMLButtonElement>(".diff-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const diff = btn.dataset.diff as DifficultyKey | undefined;
      if (diff && difficultyPresets[diff]) {
        selectedDifficulty = diff;
        showOverlay(title, body, showStart, lastScore);
      }
    });
  });
}

resize();
window.addEventListener("resize", resize);

applyDifficulty(initialPreset);
buildBricks();
state.paddle.x = state.play.x + (state.play.w - state.paddle.w) / 2;
resetBall();

showOverlay(config?.uiText.title || "Casse-briques", config?.uiText.help || "");
render();
