import "./style.css";
import { createHybridInput, createMobileControls } from "@core/input";
import { createGameLoop } from "@core/loop";
import { clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "quest";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = themes.find((t) => t.id === config?.themeId) || themes[0];
attachProgressionListener();

const playerImg = new Image();
playerImg.src = new URL("../assets/player.svg", import.meta.url).href;
const itemImg = new Image();
itemImg.src = new URL("../assets/item.svg", import.meta.url).href;
const trapImg = new Image();
trapImg.src = new URL("../assets/trap.svg", import.meta.url).href;
const gateImg = new Image();
gateImg.src = new URL("../assets/gate.svg", import.meta.url).href;
const enemyImg = new Image();
enemyImg.src = new URL("../assets/enemy.svg", import.meta.url).href;

if (theme) {
  const root = document.documentElement.style;
  root.setProperty("--color-primary", theme.colors.primary);
  root.setProperty("--color-secondary", theme.colors.secondary);
  root.setProperty("--color-accent", theme.colors.accent);
  root.setProperty("--color-text", theme.colors.text);
  root.setProperty("--color-muted", theme.colors.muted);
  document.body.style.background = theme.gradient || document.body.style.background;
}

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ui = document.getElementById("ui") as HTMLDivElement;
const ctx = canvas.getContext("2d")!;
const input = createHybridInput();
const overlay = document.createElement("div");
overlay.className = "overlay";
overlay.style.display = "none";
ui.appendChild(overlay);

const controls = {
  up: config?.input.keys.up || "ArrowUp",
  down: config?.input.keys.down || "ArrowDown",
  left: config?.input.keys.left || "ArrowLeft",
  right: config?.input.keys.right || "ArrowRight",
};

const difficultyPresets = {
  easy: {
    label: "Facile",
    timeLimit: 80,
    itemCount: 6,
    trapCount: 3,
    enemyCount: 2,
    enemySpeed: 1.1,
    hitPenalty: 5,
  },
  medium: {
    label: "Moyen",
    timeLimit: config?.difficultyParams.timeLimitSeconds ?? 60,
    itemCount: config?.difficultyParams.itemCount ?? 6,
    trapCount: config?.difficultyParams.trapCount ?? 4,
    enemyCount: config?.difficultyParams.enemyCount ?? 3,
    enemySpeed: config?.difficultyParams.enemySpeed ?? 1.5,
    hitPenalty: config?.difficultyParams.hitPenalty ?? 6,
  },
  hard: {
    label: "Difficile",
    timeLimit: 55,
    itemCount: 7,
    trapCount: 5,
    enemyCount: 4,
    enemySpeed: 1.8,
    hitPenalty: 8,
  },
  extreme: {
    label: "Extrême",
    timeLimit: 50,
    itemCount: 8,
    trapCount: 6,
    enemyCount: 5,
    enemySpeed: 2.1,
    hitPenalty: 10,
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
  },
});

type Point = { x: number; y: number };
type Item = Point & { collected: boolean };
type Trap = Point & { active: boolean };
type Enemy = Point & { vx: number; vy: number };

const state = {
  running: false,
  width: 0,
  height: 0,
  player: { x: 0, y: 0, r: 12 },
  items: [] as Item[],
  traps: [] as Trap[],
  enemies: [] as Enemy[],
  gate: { x: 0, y: 0, open: false },
  timer: config?.difficultyParams.timeLimitSeconds ?? 60,
  collected: 0,
  enemySpeed: config?.difficultyParams.enemySpeed ?? 1.5,
  hitPenalty: config?.difficultyParams.hitPenalty ?? 6,
  invulnerable: 0,
  level: 1,
  baseTime: config?.difficultyParams.timeLimitSeconds ?? 60,
  timeDecay: 5,
};

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  state.width = canvas.width / devicePixelRatio;
  state.height = canvas.height / devicePixelRatio;
}
resize();
window.addEventListener("resize", resize);

const loop = createGameLoop({
  update: (dt) => update(dt),
  render,
  fps: 60,
});

function startGame() {
  if (!config) {
    showOverlay("Config manquante", "Ajoute configs/games/quest.config.json", false);
    return;
  }
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  state.running = true;
  state.baseTime = preset.timeLimit;
  state.timeDecay = 5;
  state.level = 1;
  state.enemySpeed = preset.enemySpeed;
  state.hitPenalty = preset.hitPenalty;
  state.invulnerable = 1;
  prepareLevel(preset);
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function prepareLevel(preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium) {
  state.player.x = state.width * 0.15;
  state.player.y = state.height / 2;
  state.items = [];
  state.traps = [];
  state.enemies = [];
  state.collected = 0;
  state.gate = { x: state.width * 0.85, y: state.height / 2, open: false };
  const timeBudget = Math.max(10, state.baseTime - (state.level - 1) * state.timeDecay);
  state.timer = timeBudget;
  spawnItems(preset.itemCount);
  spawnTraps(preset.trapCount);
  spawnEnemies(preset.enemyCount);
}

function spawnItems(count: number) {
  for (let i = 0; i < count; i++) {
    state.items.push({
      x: rand(state.width * 0.25, state.width * 0.8),
      y: rand(50, state.height - 50),
      collected: false,
    });
  }
}

function spawnTraps(count: number) {
  for (let i = 0; i < count; i++) {
    state.traps.push({
      x: rand(state.width * 0.2, state.width * 0.8),
      y: rand(60, state.height - 60),
      active: true,
    });
  }
}

function spawnEnemies(count: number) {
  for (let i = 0; i < count; i++) {
    state.enemies.push({
      x: rand(state.width * 0.3, state.width * 0.8),
      y: rand(80, state.height - 80),
      vx: rand(-1, 1) || 0.5,
      vy: rand(-0.6, 0.6),
    });
  }
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  const eventType = win ? "QUEST_COMPLETE" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { remaining: state.timer } });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const best = (game.state.bestTime as number | undefined) || 0;
    if (win && state.timer > best) {
      game.state.bestTime = state.timer;
      game.bestScore = state.timer;
    }
  });
  showOverlay(win ? "Porte franchie" : "Temps écoulé", config?.uiText.help || "");
}

function showOverlay(title: string, body: string, showStart = true) {
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Mini Quest · ${preset.label}</p>
      <h2>${title}</h2>
      <p>${body}</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin:10px 0 6px;">
        ${Object.entries(difficultyPresets)
          .map(
            ([key, p]) => `
              <button class="btn ghost diff-btn ${key === selectedDifficulty ? "active" : ""}" data-diff="${key}">
                ${p.label} · ${p.itemCount} items · ${p.timeLimit}s
              </button>
            `,
          )
          .join("")}
      </div>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:12px; flex-wrap:wrap;">
        ${showStart ? `<button class="btn" id="play-btn">Lancer</button>` : ""}
        <a class="btn secondary" href="${withBasePath("/apps/hub/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
    </div>
  `;
  const play = document.getElementById("play-btn");
  play?.addEventListener("click", startGame);
  document.querySelectorAll<HTMLButtonElement>(".diff-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const diff = btn.dataset.diff as DifficultyKey | undefined;
      if (diff && difficultyPresets[diff]) {
        selectedDifficulty = diff;
        showOverlay(title, body, showStart);
      }
    });
  });
}

showOverlay(config?.uiText.title || "Mini Quest", config?.uiText.help || "");

function update(dt: number) {
  if (!state.running || !config) return;
  state.timer -= dt;
  state.invulnerable = Math.max(0, state.invulnerable - dt);
  if (state.timer <= 0) {
    endGame(false);
    return;
  }

  const moveX = (input.isDown(controls.right) ? 1 : 0) + (input.isDown(controls.left) ? -1 : 0);
  const moveY = (input.isDown(controls.down) ? 1 : 0) + (input.isDown(controls.up) ? -1 : 0);
  state.player.x += moveX * config.difficultyParams.playerSpeed * (dt * 60);
  state.player.y += moveY * config.difficultyParams.playerSpeed * (dt * 60);
  state.player.x = clamp(state.player.x, state.player.r, state.width - state.player.r);
  state.player.y = clamp(state.player.y, state.player.r, state.height - state.player.r);

  // Enemies
  state.enemies.forEach((enemy) => {
    enemy.x += enemy.vx * state.enemySpeed * (dt * 60);
    enemy.y += enemy.vy * state.enemySpeed * (dt * 60);
    if (enemy.x < 20 || enemy.x > state.width - 20) enemy.vx *= -1;
    if (enemy.y < 40 || enemy.y > state.height - 40) enemy.vy *= -1;
    if (Math.random() < 0.01) {
      enemy.vx += rand(-0.2, 0.2);
      enemy.vy += rand(-0.2, 0.2);
    }
    enemy.vx = clamp(enemy.vx, -1.4, 1.4);
    enemy.vy = clamp(enemy.vy, -1.2, 1.2);
  });

  // Enemy collisions
  if (state.invulnerable <= 0) {
    for (const enemy of state.enemies) {
      const dx = enemy.x - state.player.x;
      const dy = enemy.y - state.player.y;
      if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 14) {
        state.timer = Math.max(0, state.timer - state.hitPenalty);
        state.invulnerable = 1.2;
        state.player.x = state.width * 0.15;
        state.player.y = state.height / 2;
        emitEvent({ type: "PLAYER_HIT", gameId: GAME_ID });
        break;
      }
    }
  }

  // Items
  state.items.forEach((item) => {
    if (item.collected) return;
    const dx = item.x - state.player.x;
    const dy = item.y - state.player.y;
    if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 10) {
      item.collected = true;
      state.collected += 1;
      emitEvent({ type: "ITEM_COLLECTED", gameId: GAME_ID });
      if (state.collected >= state.items.length) {
        state.gate.open = true;
        emitEvent({ type: "GATE_UNLOCKED", gameId: GAME_ID });
      }
    }
  });

  // Traps
  state.traps.forEach((trap) => {
    if (!trap.active) return;
    const dx = trap.x - state.player.x;
    const dy = trap.y - state.player.y;
    if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 10) {
      trap.active = false;
      endGame(false);
      emitEvent({ type: "TRAP_TRIGGERED", gameId: GAME_ID });
    }
  });

  // Gate
  const dxGate = state.gate.x - state.player.x;
  const dyGate = state.gate.y - state.player.y;
  if (state.gate.open && Math.sqrt(dxGate * dxGate + dyGate * dyGate) < state.player.r + 16) {
    state.level += 1;
    prepareLevel();
  }
}

function render() {
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);

  // Gate
  if (gateImg.complete) {
    ctx.globalAlpha = state.gate.open ? 1 : 0.65;
    ctx.drawImage(gateImg, state.gate.x - 20, state.gate.y - 50, 40, 100);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = state.gate.open ? theme.colors.accent : "rgba(255,255,255,0.1)";
    ctx.fillRect(state.gate.x - 14, state.gate.y - 24, 28, 48);
  }

  // Items
  state.items.forEach((item) => {
    if (item.collected) {
      ctx.globalAlpha = 0.35;
    }
    if (itemImg.complete) {
      ctx.drawImage(itemImg, item.x - 16, item.y - 16, 32, 32);
    } else {
      ctx.fillStyle = item.collected ? "rgba(255,255,255,0.2)" : theme.colors.secondary;
      ctx.beginPath();
      ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });

  // Traps
  state.traps.forEach((trap) => {
    if (!trap.active) return;
    if (trapImg.complete) {
      ctx.drawImage(trapImg, trap.x - 22, trap.y - 16, 44, 32);
    } else {
      ctx.fillStyle = "rgba(255,95,109,0.9)";
      ctx.beginPath();
      ctx.moveTo(trap.x, trap.y - 10);
      ctx.lineTo(trap.x - 10, trap.y + 10);
      ctx.lineTo(trap.x + 10, trap.y + 10);
      ctx.closePath();
      ctx.fill();
    }
  });

  // Enemies
  state.enemies.forEach((enemy) => {
    if (enemyImg.complete) {
      ctx.drawImage(enemyImg, enemy.x - 18, enemy.y - 18, 36, 36);
    } else {
      ctx.fillStyle = theme.colors.accent;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Player
  const playerSize = state.player.r * 2.6;
  if (playerImg.complete) {
    ctx.drawImage(playerImg, state.player.x - playerSize / 2, state.player.y - playerSize / 2, playerSize, playerSize);
  } else {
    ctx.fillStyle = theme.colors.primary;
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  renderHUD();
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hud = document.createElement("div");
  hud.className = "hud";
  hud.innerHTML = `
    <div class="pill">Temps ${state.timer.toFixed(1)}s</div>
    <div class="pill">Objets ${state.collected}/${state.items.length}</div>
    <div class="pill">Porte ${state.gate.open ? "ouverte" : "fermée"}</div>
    <div class="pill">Ennemis ${state.enemies.length}</div>
    <div class="pill">Difficulté ${difficultyPresets[selectedDifficulty].label}</div>
    <div class="pill">Niveau ${state.level}</div>
  `;
  ui.appendChild(hud);
}
