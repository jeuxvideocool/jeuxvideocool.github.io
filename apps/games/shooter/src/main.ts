import "./style.css";
import "@core/launch-menu.css";
import { createHybridInput, createMobileControlManager } from "@core/input";
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
const heartImg = new Image();
heartImg.src = new URL("../assets/heart.svg", import.meta.url).href;
const boostImg = new Image();
boostImg.src = new URL("../assets/boost.svg", import.meta.url).href;

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
overlay.className = "launch-overlay";
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

const mobileControls = createMobileControlManager({
  gameId: GAME_ID,
  container: document.body,
  input,
  touch: {
    mapping: {
      left: controls.left,
      right: controls.right,
      actionA: controls.shoot,
      actionALabel: "Tir",
    },
    showPad: true,
    gestureEnabled: false,
  },
  motion: {
    input,
    axis: {
      x: { negative: controls.left, positive: controls.right },
    },
    actions: [{ code: controls.shoot, trigger: "tiltForward", mode: "hold", threshold: 14 }],
  },
  hints: {
    touch: "Flèches pour bouger, bouton Tir.",
    motion: "Incliner pour bouger, pencher vers l'avant pour tirer.",
  },
});

const difficultyPresets = {
  easy: { label: "Facile", waves: 10, lives: 5, heartRate: 0.003, boostRate: 0.002 },
  medium: { label: "Moyen", waves: 20, lives: 4, heartRate: 0.002, boostRate: 0.0014 },
  hard: { label: "Difficile", waves: 30, lives: 3, heartRate: 0.001, boostRate: 0.0009 },
  extreme: { label: "Extrême", waves: 50, lives: 1, heartRate: 0, boostRate: 0 },
  endless: { label: "Infini", waves: Infinity, lives: 3, heartRate: 0.0012, boostRate: 0.0009 },
} as const;
type DifficultyKey = keyof typeof difficultyPresets;
let selectedDifficulty: DifficultyKey = "medium";

type Bullet = { x: number; y: number; speed: number };
type Enemy = { x: number; y: number; speed: number; vx: number };
type Heart = { x: number; y: number; vy: number };
type Boost = { x: number; y: number; vy: number; duration: number };

const state = {
  running: false,
  width: 0,
  height: 0,
  player: { x: 0, y: 0, r: 14 },
  bullets: [] as Bullet[],
  enemies: [] as Enemy[],
  hearts: [] as Heart[],
  boosts: [] as Boost[],
  score: 0,
  combo: 0,
  comboTimer: 0,
  lastShot: 0,
  fireCooldown: 0.28,
  cooldownPaused: 0,
  heat: 0,
  overheat: false,
  spawnTimer: 0,
  wave: 1,
  waveTimer: config?.difficultyParams.waveLength ?? 30,
  lives: 3,
  maxLives: 5,
  maxWave: config?.difficultyParams.wavesToWin ?? 3,
  heartSpawnRate: 0.0018,
  boostSpawnRate: 0.001,
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
  mobileControls.show();
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  state.running = true;
  state.player.x = state.width / 2;
  state.player.y = state.height * 0.78;
  state.bullets = [];
  state.enemies = [];
  state.hearts = [];
  state.boosts = [];
  state.score = 0;
  state.combo = 0;
  state.comboTimer = 0;
  state.spawnTimer = 0;
  state.wave = 1;
  state.waveTimer = config.difficultyParams.waveLength;
  state.maxWave = preset.waves;
  state.lives = preset.lives;
  state.maxLives = preset.lives;
  state.heartSpawnRate = preset.heartRate;
  state.boostSpawnRate = preset.boostRate;
  state.cooldownPaused = 0;
  state.heat = 0;
  state.overheat = false;
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  mobileControls.hide();
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
  mobileControls.hide();
  overlay.style.display = "grid";
  const shortDescription = config?.uiText.shortDescription || "";
  const description = body || config?.uiText.help || "";
  const controlsList = (config?.uiText.controls || [])
    .map((item) => `<span class="launch-chip">${item}</span>`)
    .join("");
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  const difficultyOptions = Object.entries(difficultyPresets)
    .map(
      ([key, option]) => `
        <button class="launch-option diff-btn ${key === selectedDifficulty ? "is-active" : ""}" data-diff="${key}">
          <span class="launch-option-title">${option.label}</span>
          <span class="launch-option-meta">${option.waves === Infinity ? "∞" : option.waves} vagues · ${option.lives} vie${
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
        <span class="launch-row-label">Objectif</span>
        <div class="launch-row-value">
          <span class="launch-chip">${preset.waves === Infinity ? "Infini" : `${preset.waves} vagues`}</span>
        </div>
      </div>
    </div>
  `;
  overlay.innerHTML = `
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${config?.uiText.title || "Pixel Shooter"}</span>
        </div>
        <h2 class="launch-title">${title}</h2>
        ${shortDescription ? `<p class="launch-subtitle">${shortDescription}</p>` : ""}
      </div>
      <div class="launch-grid">
        <section class="launch-section">
          <h3 class="launch-section-title">Briefing</h3>
          <p class="launch-text">${description}</p>
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
      </div>
      <div class="launch-actions">
        ${showStart ? `<button class="launch-btn primary" id="launch-start">Lancer</button>` : ""}
        <a class="launch-btn ghost" href="${withBasePath("/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
    </div>
  `;
  mobileControls.attachOverlay(overlay);
  const play = document.getElementById("launch-start");
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

showOverlay(config?.uiText.title || "Pixel Shooter", config?.uiText.help || "");

function update(dt: number) {
  if (!state.running || !config) return;
  state.lastShot += dt;
  state.cooldownPaused = Math.max(0, state.cooldownPaused - dt);
  const heatCoolRate = 0.35;
  state.heat = clamp(state.heat - heatCoolRate * dt, 0, 1.2);
  if (state.overheat && state.heat < 0.2) {
    state.overheat = false;
  }
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
  state.player.x += moveX * config.difficultyParams.playerSpeed * (dt * 60);
  state.player.x = clamp(state.player.x, state.player.r, state.width - state.player.r);
  state.player.y = state.height * 0.78;

  // Shooting
  const shootKey = controls.shoot;
  const shootingNow = isDownAny(shootKey, controls.altShoot);
  const cooldown = state.fireCooldown;
  const heatBlocked = state.overheat;
  if (shootingNow && !heatBlocked && state.lastShot > cooldown) {
    state.bullets.push({
      x: state.player.x,
      y: state.player.y - 8,
      speed: config.difficultyParams.bulletSpeed,
    });
    state.lastShot = 0;
    if (state.cooldownPaused <= 0) {
      const heatPerShot = 0.18;
      state.heat = clamp(state.heat + heatPerShot, 0, 1.2);
      if (state.heat >= 1) {
        state.overheat = true;
      }
    }
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
  if (state.heartSpawnRate > 0 && Math.random() < state.heartSpawnRate * dt * 60) {
    state.hearts.push({
      x: rand(20, state.width - 20),
      y: -20,
      vy: rand(0.6, 1.1),
    });
  }

  // Spawn cooldown boosts (rarer)
  if (state.boostSpawnRate > 0 && Math.random() < state.boostSpawnRate * dt * 60) {
    state.boosts.push({
      x: rand(20, state.width - 20),
      y: -20,
      vy: rand(0.7, 1.2),
      duration: rand(2, 10),
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

  // Boosts movement + pickup (pause heat gain)
  state.boosts = state.boosts.filter((boost) => {
    boost.y += boost.vy;
    const dx = boost.x - state.player.x;
    const dy = boost.y - state.player.y;
    if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 14) {
      state.cooldownPaused = Math.max(state.cooldownPaused, boost.duration);
      emitEvent({ type: "ITEM_COLLECTED", gameId: GAME_ID, payload: { type: "cooldown" } });
      return false;
    }
    return boost.y < state.height + 30;
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

  // Bullet/heart collision (destroy heart without heal)
  for (let i = state.hearts.length - 1; i >= 0; i--) {
    const heart = state.hearts[i];
    for (let j = state.bullets.length - 1; j >= 0; j--) {
      const b = state.bullets[j];
      const dx = heart.x - b.x;
      const dy = heart.y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < 18) {
        state.hearts.splice(i, 1);
        state.bullets.splice(j, 1);
        break;
      }
    }
  }

  // Bullet/boost collision (destroy without effect)
  for (let i = state.boosts.length - 1; i >= 0; i--) {
    const boost = state.boosts[i];
    for (let j = state.bullets.length - 1; j >= 0; j--) {
      const b = state.bullets[j];
      const dx = boost.x - b.x;
      const dy = boost.y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < 18) {
        state.boosts.splice(i, 1);
        state.bullets.splice(j, 1);
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
    const heatRatio = clamp(state.heat, 0, 1);
    if (bulletImg.complete) {
      const tint = heatRatio > 0.7 ? theme.colors.accent : theme.colors.primary;
      ctx.filter = `drop-shadow(0 0 10px ${tint})`;
      ctx.drawImage(bulletImg, b.x - 8, b.y - 18, 16, 30);
      ctx.filter = "none";
    } else {
      const color = heatRatio > 0.7 ? theme.colors.accent : theme.colors.secondary;
      ctx.fillStyle = color;
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

  // Hearts
  state.hearts.forEach((h) => {
    if (heartImg.complete) {
      ctx.drawImage(heartImg, h.x - 14, h.y - 12, 28, 24);
    } else {
      ctx.fillStyle = "#ff7ee2";
      ctx.beginPath();
      ctx.arc(h.x, h.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Boosts
  state.boosts.forEach((b) => {
    if (boostImg.complete) {
      ctx.drawImage(boostImg, b.x - 14, b.y - 14, 28, 28);
    } else {
      ctx.fillStyle = "#7cffe1";
      ctx.beginPath();
      ctx.rect(b.x - 12, b.y - 12, 24, 24);
      ctx.fill();
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
  const waveLabel = state.maxWave === Infinity ? "∞" : state.maxWave;
  const heatPercent = Math.round(state.heat * 100);
  hud.innerHTML = `
    <div class="pill">Score ${state.score}</div>
    <div class="pill">Wave ${state.wave}/${waveLabel}</div>
    <div class="pill">Combo ${state.combo} (${state.comboTimer.toFixed(1)}s)</div>
    <div class="pill">Vies ${state.lives}/${state.maxLives}</div>
    ${
      state.cooldownPaused > 0
        ? `<div class="pill">Chaleur figée ${state.cooldownPaused.toFixed(1)}s</div>`
        : ""
    }
    <div class="pill ${state.overheat ? "danger" : ""}">Chaleur ${heatPercent}%${state.overheat ? " (Overheat)" : ""}</div>
  `;
  ui.appendChild(hud);
}
