import "./style.css";
import { createHybridInput, createMobileControls } from "@core/input";
import { createGameLoop } from "@core/loop";
import { chance, clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { loadSave, updateGameState } from "@storage";

type Cell = { x: number; y: number };
type Dir = Cell;
type Food = Cell & { type: "core" | "prism" };
type Particle = { x: number; y: number; r: number; alpha: number; decay: number; color: string };

const GAME_ID = "snake";
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
  document.body.style.background = theme.gradient || theme.colors.background;
}

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ui = document.getElementById("ui") as HTMLDivElement;
const ctx = canvas.getContext("2d")!;
const input = createHybridInput();
const overlay = document.createElement("div");
overlay.className = "overlay";
overlay.style.display = "none";
ui.appendChild(overlay);

const fruitImg = new Image();
fruitImg.src = new URL("../assets/fruit.svg", import.meta.url).href;
const prismImg = new Image();
prismImg.src = new URL("../assets/prism.svg", import.meta.url).href;
const gridImg = new Image();
gridImg.src = new URL("../assets/grid.svg", import.meta.url).href;

const controls = {
  up: config?.input.keys.up || "ArrowUp",
  down: config?.input.keys.down || "ArrowDown",
  left: config?.input.keys.left || "ArrowLeft",
  right: config?.input.keys.right || "ArrowRight",
  dash: config?.input.keys.dash || "Space",
};

const mobileControls = createMobileControls({
  container: document.body,
  input,
  mapping: {
    up: controls.up,
    down: controls.down,
    left: controls.left,
    right: controls.right,
    actionA: controls.dash,
    actionALabel: "Boost",
  },
  autoShow: false,
  showPad: false,
});

const difficultyPresets = {
  easy: {
    label: "Facile",
    boardSize: 20,
    tickMs: 170,
    speedRamp: 0.992,
    prismChance: 0.22,
    lengthTarget: 36,
    boostSeconds: 3.4,
    wallSolid: true,
  },
  medium: {
    label: "Moyen",
    boardSize: config?.difficultyParams.boardSize ?? 21,
    tickMs: config?.difficultyParams.baseTickMs ?? 140,
    speedRamp: config?.difficultyParams.speedRamp ?? 0.985,
    prismChance: config?.difficultyParams.prismChance ?? 0.18,
    lengthTarget: config?.difficultyParams.targetLength ?? 46,
    boostSeconds: (config?.difficultyParams.boostDurationMs ?? 3200) / 1000,
    wallSolid: Boolean(config?.difficultyParams.wallIsSolid ?? 1),
  },
  hard: {
    label: "Difficile",
    boardSize: 19,
    tickMs: 120,
    speedRamp: 0.982,
    prismChance: 0.14,
    lengthTarget: 52,
    boostSeconds: 2.6,
    wallSolid: true,
  },
  extreme: {
    label: "Extrême",
    boardSize: 18,
    tickMs: 105,
    speedRamp: 0.978,
    prismChance: 0.1,
    lengthTarget: 60,
    boostSeconds: 2.4,
    wallSolid: true,
  },
} as const;

type DifficultyKey = keyof typeof difficultyPresets;
let selectedDifficulty: DifficultyKey = "medium";

createMobileControls({
  container: document.body,
  input,
  mapping: {
    up: controls.up,
    down: controls.down,
    left: controls.left,
    right: controls.right,
    actionA: controls.dash,
    actionALabel: "Boost",
  },
});

const state = {
  running: false,
  boardSize: clamp(config?.difficultyParams.boardSize ?? 20, 12, 32),
  cellSize: 24,
  viewWidth: window.innerWidth,
  viewHeight: window.innerHeight,
  offsetX: 0,
  offsetY: 0,
  snake: [] as Cell[],
  dir: { x: 1, y: 0 } as Dir,
  pendingDir: { x: 1, y: 0 } as Dir,
  inputReady: true,
  food: null as Food | null,
  tickMs: config?.difficultyParams.baseTickMs ?? 140,
  timer: 0,
  boost: 0,
  score: 0,
  best: loadSave().games[GAME_ID]?.bestScore ?? 0,
  streak: 0,
  comboTimer: 0,
  particles: [] as Particle[],
  flash: 0,
  lengthTarget: config?.difficultyParams.targetLength ?? 42,
  wallSolid: Boolean(config?.difficultyParams.wallIsSolid ?? 1),
  speedRamp: config?.difficultyParams.speedRamp ?? 0.99,
  prismChance: config?.difficultyParams.prismChance ?? 0.16,
  boostSeconds: (config?.difficultyParams.boostDurationMs ?? 2600) / 1000,
  dpr: devicePixelRatio || 1,
};

const loop = createGameLoop({
  update: (dt) => update(dt),
  render,
  fps: 60,
});

function resize() {
  state.dpr = devicePixelRatio || 1;
  canvas.width = window.innerWidth * state.dpr;
  canvas.height = window.innerHeight * state.dpr;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  state.viewWidth = canvas.width / state.dpr;
  state.viewHeight = canvas.height / state.dpr;
  const usable = Math.min(state.viewWidth, state.viewHeight) * 0.88;
  state.cellSize = clamp(Math.floor(usable / state.boardSize), 18, 46);
  const boardPx = state.cellSize * state.boardSize;
  state.offsetX = (state.viewWidth - boardPx) / 2;
  state.offsetY = (state.viewHeight - boardPx) / 2;
}
resize();
window.addEventListener("resize", resize);

function startGame() {
  if (!config) {
    showOverlay("Config manquante", "Ajoute configs/games/snake.config.json", false);
    return;
  }
  mobileControls.show();
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  state.boardSize = clamp(preset.boardSize, 12, 32);
  resize();
  state.running = true;
  state.dir = { x: 1, y: 0 };
  state.pendingDir = { x: 1, y: 0 };
  state.inputReady = true;
  const mid = Math.floor(state.boardSize / 2);
  state.snake = [
    { x: mid - 2, y: mid },
    { x: mid - 1, y: mid },
    { x: mid, y: mid },
  ];
  state.food = null;
  state.tickMs = preset.tickMs;
  state.timer = 0;
  state.boost = 0;
  state.score = 0;
  state.streak = 0;
  state.comboTimer = 0;
  state.particles = [];
  state.flash = 0.9;
  state.lengthTarget = preset.lengthTarget;
  state.wallSolid = preset.wallSolid;
  state.speedRamp = preset.speedRamp;
  state.prismChance = preset.prismChance;
  state.boostSeconds = preset.boostSeconds;
  spawnFood();
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  mobileControls.hide();
  const score = state.score;
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score } });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const bestLength = (game.state.bestLength as number | undefined) || 0;
    game.state.bestLength = Math.max(bestLength, state.snake.length);
    const best = game.bestScore || 0;
    if (score > best) {
      game.bestScore = score;
    }
  });
  state.best = Math.max(state.best, score);
  const subtitle = win ? "Flow parfait" : "Collision détectée";
  showOverlay(subtitle, config?.uiText.help || "", true, score);
}

function spawnFood() {
  const occupied = new Set(state.snake.map((p) => `${p.x},${p.y}`));
  let cell: Cell = { x: 0, y: 0 };
  let guard = 0;
  do {
    cell = {
      x: Math.floor(rand(0, state.boardSize)),
      y: Math.floor(rand(0, state.boardSize)),
    };
    guard += 1;
  } while (occupied.has(`${cell.x},${cell.y}`) && guard < 400);
  const prism = chance(state.prismChance);
  state.food = { ...cell, type: prism ? "prism" : "core" };
}

function setDirection(next: Dir) {
  if (!state.inputReady) return;
  const isOpposite = next.x === -state.dir.x && next.y === -state.dir.y;
  if (isOpposite) return;
  state.pendingDir = next;
  state.inputReady = false;
}

function pollInput() {
  if (!config) return;
  const keys = config.input.keys;
  const pressed = (code?: string) => (code ? input.isDown(code) : false);
  if (pressed(keys.left) || pressed(keys.altLeft)) setDirection({ x: -1, y: 0 });
  if (pressed(keys.right) || pressed(keys.altRight)) setDirection({ x: 1, y: 0 });
  if (pressed(keys.up) || pressed(keys.altUp)) setDirection({ x: 0, y: -1 });
  if (pressed(keys.down) || pressed(keys.altDown)) setDirection({ x: 0, y: 1 });

  const dashKey = keys.dash || "Space";
  if (pressed(dashKey) && state.boost <= 0.1) {
    state.boost = state.boostSeconds;
    state.flash = 1;
  }
}

function step() {
  state.dir = state.pendingDir;
  const head = state.snake[state.snake.length - 1];
  let next: Cell = { x: head.x + state.dir.x, y: head.y + state.dir.y };

  if (!state.wallSolid) {
    next.x = (next.x + state.boardSize) % state.boardSize;
    next.y = (next.y + state.boardSize) % state.boardSize;
  } else if (
    next.x < 0 ||
    next.y < 0 ||
    next.x >= state.boardSize ||
    next.y >= state.boardSize
  ) {
    endGame(false);
    return;
  }

  if (state.snake.some((segment) => segment.x === next.x && segment.y === next.y)) {
    endGame(false);
    return;
  }

  state.snake.push(next);
  let ate = false;
  if (state.food && next.x === state.food.x && next.y === state.food.y) {
    ate = true;
    handleEat(state.food);
  }

  if (!ate) {
    state.snake.shift();
  }

  state.inputReady = true;
}

function handleEat(food: Food) {
  state.flash = 1;
  state.comboTimer = 2.8;
  state.streak += 1;
  const gain = food.type === "prism" ? 18 : 9;
  state.score += gain + Math.floor(Math.max(0, state.streak - 1) * 1.5);
  emitEvent({
    type: food.type === "prism" ? "PRISM_FRUIT_EATEN" : "FRUIT_EATEN",
    gameId: GAME_ID,
    payload: { score: state.score },
  });
  if (food.type === "prism") {
    state.boost = Math.max(state.boost, state.boostSeconds);
    emitEvent({ type: "STREAK_BONUS", gameId: GAME_ID });
  }

  state.tickMs = Math.max(75, state.tickMs * state.speedRamp);
  spawnFood();
  state.particles.push({
    x: food.x,
    y: food.y,
    r: state.cellSize * 1.2,
    alpha: 0.65,
    decay: 0.9,
    color: food.type === "prism" ? theme.colors.accent : theme.colors.primary,
  });

  if (state.snake.length >= state.lengthTarget) {
    endGame(true);
  }
}

function update(dt: number) {
  if (!state.running) return;
  const speedBoost = state.boost > 0 ? 1.25 : 1;
  state.timer += dt * 1000 * speedBoost;
  state.boost = Math.max(0, state.boost - dt);
  state.flash = Math.max(0, state.flash - dt * 0.8);
  state.comboTimer = Math.max(0, state.comboTimer - dt);
  if (state.comboTimer === 0) {
    state.streak = 0;
  }

  pollInput();
  while (state.timer >= state.tickMs) {
    state.timer -= state.tickMs;
    step();
  }

  state.particles = state.particles
    .map((p) => ({ ...p, alpha: p.alpha - dt * p.decay }))
    .filter((p) => p.alpha > 0.02);
}

function drawRoundedRect(x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function render() {
  ctx.save();
  ctx.scale(state.dpr, state.dpr);
  ctx.clearRect(0, 0, state.viewWidth, state.viewHeight);

  const grad = ctx.createLinearGradient(0, 0, state.viewWidth, state.viewHeight);
  grad.addColorStop(0, "rgba(124,255,225,0.08)");
  grad.addColorStop(0.5, "rgba(123,140,255,0.08)");
  grad.addColorStop(1, "rgba(255,126,226,0.08)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, state.viewWidth, state.viewHeight);

  if (gridImg.complete) {
    ctx.globalAlpha = 0.16;
    ctx.drawImage(gridImg, 0, 0, state.viewWidth, state.viewHeight);
    ctx.globalAlpha = 1;
  }

  const boardSizePx = state.cellSize * state.boardSize;
  const boardX = state.offsetX;
  const boardY = state.offsetY;
  const boardGrad = ctx.createLinearGradient(boardX, boardY, boardX, boardY + boardSizePx);
  boardGrad.addColorStop(0, "rgba(255,255,255,0.04)");
  boardGrad.addColorStop(1, "rgba(255,255,255,0.02)");
  ctx.fillStyle = boardGrad;
  drawRoundedRect(boardX, boardY, boardSizePx, boardSizePx, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 0.8;
  for (let i = 1; i < state.boardSize; i++) {
    const x = boardX + i * state.cellSize;
    const y = boardY + i * state.cellSize;
    ctx.beginPath();
    ctx.moveTo(x, boardY);
    ctx.lineTo(x, boardY + boardSizePx);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(boardX, y);
    ctx.lineTo(boardX + boardSizePx, y);
    ctx.stroke();
  }

  state.particles.forEach((p) => {
    const px = boardX + p.x * state.cellSize + state.cellSize / 2;
    const py = boardY + p.y * state.cellSize + state.cellSize / 2;
    const radial = ctx.createRadialGradient(px, py, 2, px, py, p.r);
    radial.addColorStop(0, `${p.color}bf`);
    radial.addColorStop(1, "transparent");
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(px, py, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  if (state.food) {
    const fx = boardX + state.food.x * state.cellSize;
    const fy = boardY + state.food.y * state.cellSize;
    const img = state.food.type === "prism" ? prismImg : fruitImg;
    if (img.complete) {
      ctx.drawImage(img, fx, fy, state.cellSize, state.cellSize);
    } else {
      ctx.fillStyle = state.food.type === "prism" ? theme.colors.accent : theme.colors.primary;
      drawRoundedRect(fx + 3, fy + 3, state.cellSize - 6, state.cellSize - 6, 10);
      ctx.fill();
    }
  }

  const len = state.snake.length;
  state.snake.forEach((segment, idx) => {
    const px = boardX + segment.x * state.cellSize + 2;
    const py = boardY + segment.y * state.cellSize + 2;
    const t = idx / Math.max(1, len - 1);
    const base = idx === len - 1 ? theme.colors.primary : theme.colors.secondary;
    const alpha = idx === len - 1 ? 0.95 : 0.55 + t * 0.35;
    ctx.fillStyle = `${base}${Math.floor(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
    drawRoundedRect(px, py, state.cellSize - 4, state.cellSize - 4, 9);
    ctx.fill();

    if (idx === len - 1) {
      ctx.strokeStyle = theme.colors.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        boardX + segment.x * state.cellSize + state.cellSize / 2,
        boardY + segment.y * state.cellSize + state.cellSize / 2,
        state.cellSize * 0.18 + state.flash * 4,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
  });

  ctx.restore();
  renderHUD();
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hudTop = document.createElement("div");
  hudTop.className = "hud";
  hudTop.innerHTML = `
    <div class="chip">Score <strong>${state.score}</strong></div>
    <div class="chip">Longueur <strong>${state.snake.length}/${state.lengthTarget}</strong></div>
    <div class="chip ghost">Vitesse <span>${(1000 / state.tickMs).toFixed(1)} t/s</span></div>
    <div class="chip ghost">Record <span>${state.best}</span></div>
  `;
  ui.appendChild(hudTop);

  const hudBottom = document.createElement("div");
  hudBottom.className = "hud bottom";
  hudBottom.innerHTML = `
    <div class="pill ${state.boost > 0 ? "glow" : ""}">Boost ${state.boost > 0 ? "actif" : "off"}</div>
    <div class="pill">Flow ${Math.max(1, state.streak)}x</div>
  `;
  ui.appendChild(hudBottom);
}

function showOverlay(title: string, body: string, showStart = true, lastScore?: number) {
  mobileControls.hide();
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Prism Snake · ${preset.label}</p>
      <h2>${title}</h2>
      ${lastScore !== undefined ? `<p class="muted">Score ${lastScore} · Longueur ${state.snake.length}</p>` : ""}
      <p class="muted">${body}</p>
      <div class="panel-actions" style="flex-wrap:wrap; justify-content:center;">
        ${Object.entries(difficultyPresets)
          .map(
            ([key, preset]) => `
              <button class="btn ghost diff-btn ${key === selectedDifficulty ? "active" : ""}" data-diff="${key}">
                ${preset.label} · ${preset.lengthTarget} segments
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="panel-actions">
        ${showStart ? `<button class="btn" id="start-btn">Lancer</button>` : ""}
        <a class="btn ghost" href="${withBasePath("/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
      <div class="inline-metrics">
        <div><span>Record</span><strong>${state.best}</strong></div>
        <div><span>Objectif</span><strong>${preset.lengthTarget}</strong></div>
        <div><span>Cadence</span><strong>${(1000 / preset.tickMs).toFixed(1)} t/s</strong></div>
      </div>
    </div>
  `;
  document.getElementById("start-btn")?.addEventListener("click", startGame);
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

showOverlay(config?.uiText.title || "Prism Snake", config?.uiText.help || "Serpent néon premium.");
render();
