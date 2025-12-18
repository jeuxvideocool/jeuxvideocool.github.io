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

const CHASE_OFF = 10;
const CHASE_ON = 3;
let mobileControls:
  | {
      dispose: () => void;
    }
  | null = null;

const controls = {
  up: config?.input.keys.up || "ArrowUp",
  down: config?.input.keys.down || "ArrowDown",
  left: config?.input.keys.left || "ArrowLeft",
  right: config?.input.keys.right || "ArrowRight",
  attack: (config as any)?.input?.keys?.attack || (config as any)?.input?.keys?.interact || "Space",
};
function ensureMobileControls() {
  if (mobileControls) return;
  mobileControls = createMobileControls({
    container: document.body,
    input,
    mapping: {
      up: controls.up,
      down: controls.down,
      left: controls.left,
      right: controls.right,
      actionA: controls.attack,
      actionALabel: "Frappe",
    },
  });
}

type Point = { x: number; y: number };
type Item = Point & { collected: boolean };
type Trap = Point & { active: boolean };
type Enemy = Point & { vx: number; vy: number; wx: number; wy: number; wt: number };

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
  invulnerable: 0,
  level: 1,
  baseTime: config?.difficultyParams.timeLimitSeconds ?? 60,
  timeDecay: 5,
  baseItemCount: config?.difficultyParams.itemCount ?? 6,
  baseTrapCount: config?.difficultyParams.trapCount ?? 4,
  baseEnemyCount: config?.difficultyParams.enemyCount ?? 3,
  baseEnemySpeed: config?.difficultyParams.enemySpeed ?? 1.5,
  attackTimer: 0,
  chaseTimer: 0,
  chaseActive: false,
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
  ensureMobileControls();
  state.running = true;
  state.baseTime = config?.difficultyParams.timeLimitSeconds ?? 60;
  state.timeDecay = 5;
  state.level = 1;
  state.invulnerable = 0;
  state.attackTimer = 0;
  state.chaseTimer = 0;
  state.chaseActive = false;
  prepareLevel();
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function prepareLevel() {
  state.player.x = state.width * 0.15;
  state.player.y = state.height / 2;
  state.items = [];
  state.traps = [];
  state.enemies = [];
  state.collected = 0;
  state.gate = { x: state.width * 0.85, y: state.height / 2, open: false };
  const timeBudget = Math.max(10, state.baseTime - (state.level - 1) * state.timeDecay);
  state.timer = timeBudget;
  const levelFactor = state.level - 1;
  const itemCount = state.baseItemCount;
  const trapCount = state.baseTrapCount + Math.min(levelFactor, 4);
  const enemyCount = state.baseEnemyCount + Math.min(levelFactor, 6);
  const playerSpeed = config.difficultyParams.playerSpeed;
  const maxEnemySpeed = Math.max(0.5, playerSpeed * 0.9);
  state.enemySpeed = Math.min(state.baseEnemySpeed + levelFactor * 0.2, maxEnemySpeed);
  state.attackTimer = 0;
  state.chaseTimer = 0;
  state.chaseActive = false;
  spawnItems(itemCount);
  spawnTraps(trapCount);
  spawnEnemies(enemyCount);
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
    const angle = rand(0, Math.PI * 2);
    state.enemies.push({
      x: rand(state.width * 0.3, state.width * 0.8),
      y: rand(80, state.height - 80),
      vx: rand(-1, 1) || 0.5,
      vy: rand(-0.6, 0.6),
      wx: Math.cos(angle),
      wy: Math.sin(angle),
      wt: rand(1.2, 3),
    });
  }
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  mobileControls?.dispose();
  mobileControls = null;
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
  const description =
    body && body.trim().length
      ? body
      : "Récupère les artefacts, esquive les pièges et repousse les monstres pour atteindre la porte.";
  const attackLabel = controls.attack === " " ? "Espace" : controls.attack;
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Mini Quest · Montée en tension</p>
      <h2>${title}</h2>
      <p>${description}</p>
      <p class="subtext">Chaque porte réduit le temps disponible et renforce les ennemis : plus rapides, plus nombreux. Collecte tout, évite les pièges et frappe (${attackLabel}) pour les repousser.</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:12px; flex-wrap:wrap;">
        ${showStart ? `<button class="btn" id="play-btn">Lancer</button>` : ""}
        <a class="btn secondary" href="${withBasePath("/apps/hub/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
    </div>
  `;
  const play = document.getElementById("play-btn");
  play?.addEventListener("click", startGame);
}

showOverlay(config?.uiText.title || "Mini Quest", config?.uiText.help || "");

function update(dt: number) {
  if (!state.running || !config) return;
  state.timer -= dt;
  state.invulnerable = Math.max(0, state.invulnerable - dt);
  state.attackTimer = Math.max(0, state.attackTimer - dt);
  state.chaseTimer += dt;
  if (state.chaseActive && state.chaseTimer >= CHASE_ON) {
    state.chaseActive = false;
    state.chaseTimer = 0;
  } else if (!state.chaseActive && state.chaseTimer >= CHASE_OFF) {
    state.chaseActive = true;
    state.chaseTimer = 0;
  }
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
    enemy.wt -= dt;
    if (!state.chaseActive && enemy.wt <= 0) {
      const ang = rand(0, Math.PI * 2);
      enemy.wx = Math.cos(ang);
      enemy.wy = Math.sin(ang);
      enemy.wt = rand(1.4, 3.2);
    }
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const dirX = state.chaseActive ? dx / dist : enemy.wx;
    const dirY = state.chaseActive ? dy / dist : enemy.wy;
    const swayX = rand(-0.12, 0.12);
    const swayY = rand(-0.12, 0.12);
    const speed = state.enemySpeed;
    const followWeight = state.chaseActive ? 0.9 : 0.45;
    enemy.vx = clamp(enemy.vx * 0.8 + (dirX * followWeight + swayX) * 0.8, -1.8, 1.8);
    enemy.vy = clamp(enemy.vy * 0.8 + (dirY * followWeight + swayY) * 0.8, -1.6, 1.6);
    enemy.x += enemy.vx * speed * (dt * 60);
    enemy.y += enemy.vy * speed * (dt * 60);
    if (!state.chaseActive) {
      if (enemy.x < 20 || enemy.x > state.width - 20) enemy.wx = -enemy.wx;
      if (enemy.y < 40 || enemy.y > state.height - 40) enemy.wy = -enemy.wy;
    }
    enemy.x = clamp(enemy.x, 20, state.width - 20);
    enemy.y = clamp(enemy.y, 40, state.height - 40);
  });

  // Enemy collisions
  if (state.invulnerable <= 0) {
    for (const enemy of state.enemies) {
      const dx = enemy.x - state.player.x;
      const dy = enemy.y - state.player.y;
      if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 14) {
        endGame(false);
        emitEvent({ type: "PLAYER_HIT", gameId: GAME_ID });
        return;
      }
    }
  }

  // Attack (knockback enemies)
  if (state.attackTimer <= 0 && input.isDown(controls.attack)) {
    state.attackTimer = 0.6;
    state.invulnerable = 0.4;
    const radius = 80;
    state.enemies.forEach((enemy) => {
      const dx = enemy.x - state.player.x;
      const dy = enemy.y - state.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        const force = 2 + (radius - dist) / radius * 2;
        const nx = dist ? dx / dist : 1;
        const ny = dist ? dy / dist : 0;
        enemy.vx = nx * force;
        enemy.vy = ny * force;
        enemy.x += nx * 10;
        enemy.y += ny * 10;
      }
    });
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

  // Chase alert ring
  const timeToChase = CHASE_OFF - state.chaseTimer;
  if (!state.chaseActive && timeToChase <= 2) {
    const intensity = clamp(1 - timeToChase / 2, 0, 1);
    const pulse = 1 + Math.sin(performance.now() / 180) * 0.15;
    ctx.strokeStyle = `rgba(255, 96, 132, ${0.35 + intensity * 0.5})`;
    ctx.lineWidth = 3 + intensity * 2;
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, (playerSize * 0.65) * (1 + intensity * 0.35) * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
  renderHUD();
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hud = document.createElement("div");
  hud.className = "hud";
  const timeToChase = CHASE_OFF - state.chaseTimer;
  const chaseLabel = state.chaseActive ? "Chasse en cours" : timeToChase <= 2 ? "Chasse imminente" : "Repérage";
  hud.innerHTML = `
    <div class="pill">Niveau ${state.level}</div>
    <div class="pill">Temps ${state.timer.toFixed(1)}s</div>
    <div class="pill">Objets ${state.collected}/${state.items.length}</div>
    <div class="pill">Porte ${state.gate.open ? "ouverte" : "fermée"}</div>
    <div class="pill">Ennemis ${state.enemies.length}</div>
    <div class="pill">${chaseLabel}</div>
  `;
  ui.appendChild(hud);
}
