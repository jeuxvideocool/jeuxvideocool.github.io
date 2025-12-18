import "./style.css";
import { createHybridInput, createMobileControls } from "@core/input";
import { createGameLoop } from "@core/loop";
import { clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "shooter";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = themes.find((t) => t.id === config?.themeId) || themes[0];
attachProgressionListener();

const playerImg = new Image();
playerImg.src = new URL("../assets/player.svg", import.meta.url).href;
const enemyImg = new Image();
enemyImg.src = new URL("../assets/enemy.svg", import.meta.url).href;
const bulletImg = new Image();
bulletImg.src = new URL("../assets/bullet.svg", import.meta.url).href;

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
  shoot: config?.input.keys.shoot || "Space",
  altUp: "ArrowUp",
  altDown: "ArrowDown",
  altLeft: "ArrowLeft",
  altRight: "ArrowRight",
  altShoot: "Space",
};

createMobileControls({
  container: document.body,
  input,
  mapping: {
    up: controls.up,
    down: controls.down,
    left: controls.left,
    right: controls.right,
    actionA: controls.shoot,
    actionALabel: "Tir",
  },
});

type Bullet = { x: number; y: number; speed: number };
type Enemy = { x: number; y: number; speed: number; vx: number };
type Heart = { x: number; y: number; vy: number };

const state = {
  running: false,
  width: 0,
  height: 0,
  player: { x: 0, y: 0, r: 14 },
  bullets: [] as Bullet[],
  enemies: [] as Enemy[],
  hearts: [] as Heart[],
  score: 0,
  combo: 0,
  comboTimer: 0,
  lastShot: 0,
  fireCooldown: 0.28,
  spawnTimer: 0,
  wave: 1,
  waveTimer: config?.difficultyParams.waveLength ?? 30,
  lives: 3,
  maxLives: 5,
  maxWave: config?.difficultyParams.wavesToWin ?? 3,
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

function isDownAny(...codes: (string | undefined)[]) {
  return codes.some((c) => (c ? input.isDown(c) : false));
}

function startGame() {
  if (!config) {
    showOverlay("Config manquante", "Ajoute configs/games/shooter.config.json", false);
    return;
  }
  state.running = true;
  state.player.x = state.width / 2;
  state.player.y = state.height * 0.75;
  state.bullets = [];
  state.enemies = [];
  state.hearts = [];
  state.score = 0;
  state.combo = 0;
  state.comboTimer = 0;
  state.spawnTimer = 0;
  state.wave = 1;
  state.waveTimer = config.difficultyParams.waveLength;
  state.maxWave = config.difficultyParams.wavesToWin ?? 3;
  state.lives = 3;
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score: state.score } });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const best = (game.state.bestScore as number | undefined) || 0;
    if (state.score > best) {
      game.state.bestScore = state.score;
      game.bestScore = state.score;
    }
  });
  showOverlay(win ? "Vagues nettoyées" : "Drone détruit", config?.uiText.help || "");
}

function showOverlay(title: string, body: string, showStart = true) {
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Pixel Shooter</p>
      <h2>${title}</h2>
      <p>${body}</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:12px;">
        ${showStart ? `<button class="btn" id="play-btn">Lancer</button>` : ""}
        <a class="btn secondary" href="${withBasePath("/apps/hub/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
    </div>
  `;
  const play = document.getElementById("play-btn");
  play?.addEventListener("click", startGame);
}

showOverlay(config?.uiText.title || "Pixel Shooter", config?.uiText.help || "");

function update(dt: number) {
  if (!state.running || !config) return;
  state.lastShot += dt;
  state.spawnTimer += dt * 1000;
  state.comboTimer = Math.max(0, state.comboTimer - dt);
  if (state.comboTimer <= 0) state.combo = 0;
  state.waveTimer -= dt;
  if (state.waveTimer <= 0) {
    emitEvent({ type: "WAVE_CLEARED", gameId: GAME_ID });
    state.wave += 1;
    if (state.wave > state.maxWave) {
      endGame(true);
      return;
    }
    state.waveTimer = config.difficultyParams.waveLength;
    state.spawnTimer = 0;
  }

  // Movement
  const moveX =
    (isDownAny(controls.right, controls.altRight, "KeyD") ? 1 : 0) +
    (isDownAny(controls.left, controls.altLeft, "KeyQ", "KeyA") ? -1 : 0);
  const moveY =
    (isDownAny(controls.down, controls.altDown, "KeyS") ? 1 : 0) +
    (isDownAny(controls.up, controls.altUp, "KeyZ", "KeyW") ? -1 : 0);
  state.player.x += moveX * config.difficultyParams.playerSpeed * (dt * 60);
  state.player.y += moveY * config.difficultyParams.playerSpeed * (dt * 60);
  state.player.x = clamp(state.player.x, state.player.r, state.width - state.player.r);
  state.player.y = clamp(state.player.y, state.height * 0.35, state.height - state.player.r);

  // Shooting
  const shootKey = controls.shoot;
  if (isDownAny(shootKey, controls.altShoot) && state.lastShot > state.fireCooldown) {
    state.bullets.push({ x: state.player.x, y: state.player.y - 8, speed: config.difficultyParams.bulletSpeed });
    state.lastShot = 0;
  }

  // Spawn enemies
  if (state.spawnTimer >= config.difficultyParams.enemySpawnIntervalMs) {
    state.spawnTimer = 0;
    const targetX = rand(state.player.x - 60, state.player.x + 60);
    state.enemies.push({
      x: clamp(targetX, 20, state.width - 20),
      y: -20,
      speed: config.difficultyParams.enemySpeed + state.wave * 0.2,
      vx: rand(-0.4, 0.4),
    });
  }

  // Spawn hearts occasionally (rarer than enemies)
  if (Math.random() < 0.0018 * dt * 60) {
    state.hearts.push({
      x: rand(20, state.width - 20),
      y: -20,
      vy: rand(0.6, 1.1),
    });
  }

  // Update bullets
  state.bullets = state.bullets
    .map((b) => ({ ...b, y: b.y - b.speed }))
    .filter((b) => b.y > -10);

  // Update enemies
  state.enemies = state.enemies.filter((enemy) => {
    enemy.y += enemy.speed;
    enemy.x += enemy.vx;
    if (enemy.x < 10 || enemy.x > state.width - 10) enemy.vx *= -1;
    // Collision with player
    const dx = enemy.x - state.player.x;
    const dy = enemy.y - state.player.y;
    if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 14) {
      state.lives = Math.max(0, state.lives - 1);
      emitEvent({ type: "PLAYER_HIT", gameId: GAME_ID });
      return false;
    }
    return enemy.y < state.height + 20;
  });

  // Hearts movement + pickup
  state.hearts = state.hearts.filter((heart) => {
    heart.y += heart.vy;
    const dx = heart.x - state.player.x;
    const dy = heart.y - state.player.y;
    if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 14) {
      state.lives = Math.min(state.maxLives, state.lives + 1);
      emitEvent({ type: "ITEM_COLLECTED", gameId: GAME_ID, payload: { type: "heart" } });
      return false;
    }
    return heart.y < state.height + 30;
  });

  // Bullet/enemy collision
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];
    for (let j = state.bullets.length - 1; j >= 0; j--) {
      const b = state.bullets[j];
      const dx = enemy.x - b.x;
      const dy = enemy.y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < 16) {
        state.enemies.splice(i, 1);
        state.bullets.splice(j, 1);
        state.score += 5 * (1 + Math.floor(state.combo / 3));
        state.combo += 1;
        state.comboTimer = 2;
        emitEvent({ type: "ENEMY_KILLED", gameId: GAME_ID });
        if (state.combo > 0 && state.combo % 5 === 0) {
          emitEvent({ type: "COMBO_REACHED", gameId: GAME_ID, payload: { combo: state.combo } });
        }
        break;
      }
    }
  }

  if (state.lives <= 0) {
    endGame(false);
  }
}

function render() {
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);

  // Player
  const shipSize = state.player.r * 3;
  if (playerImg.complete) {
    ctx.drawImage(playerImg, state.player.x - shipSize / 2, state.player.y - shipSize / 2, shipSize, shipSize);
  } else {
    ctx.fillStyle = theme.colors.primary;
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bullets
  state.bullets.forEach((b) => {
    if (bulletImg.complete) {
      ctx.drawImage(bulletImg, b.x - 8, b.y - 18, 16, 30);
    } else {
      ctx.fillStyle = theme.colors.secondary;
      ctx.fillRect(b.x - 3, b.y - 10, 6, 12);
    }
  });

  // Enemies
  state.enemies.forEach((e) => {
    if (enemyImg.complete) {
      ctx.drawImage(enemyImg, e.x - 16, e.y - 16, 32, 32);
    } else {
      ctx.fillStyle = "#ff5afc";
      ctx.fillRect(e.x - 12, e.y - 12, 24, 24);
    }
  });

  ctx.restore();
  renderHUD();
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hud = document.createElement("div");
  hud.className = "hud";
  hud.innerHTML = `
    <div class="pill">Score ${state.score}</div>
    <div class="pill">Wave ${state.wave}/${state.maxWave}</div>
    <div class="pill">Combo ${state.combo} (${state.comboTimer.toFixed(1)}s)</div>
    <div class="pill">Vies ${state.lives}/${state.maxLives}</div>
  `;
  ui.appendChild(hud);
}
