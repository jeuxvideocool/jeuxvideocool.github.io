import "./style.css";
import { createHybridInput, createMobileControls } from "@core/input";
import { createGameLoop } from "@core/loop";
import { chance, clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "dodge";
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
    actionALabel: "Dash",
  },
  autoShow: false,
  showPad: false,
});

type Obstacle = { x: number; y: number; size: number; speed: number };
type Powerup = { x: number; y: number; size: number; duration: number };
type Star = { x: number; y: number; size: number; speed: number; alpha: number };
type Mode = "timed" | "endless";

const playerImg = new Image();
playerImg.src = new URL("../assets/player.svg", import.meta.url).href;
const obstacleImg = new Image();
obstacleImg.src = new URL("../assets/obstacle.svg", import.meta.url).href;
const powerupImg = new Image();
powerupImg.src = new URL("../assets/powerup.svg", import.meta.url).href;

const state = {
  running: false,
  width: 0,
  height: 0,
  player: { x: 0, y: 0, r: 14, dash: 0, dashCooldown: 0 },
  invulnerable: 0,
  dashIFrames: 0,
  time: 0,
  mode: "timed" as Mode,
  runDuration: config?.difficultyParams.winTimeSeconds ?? 60,
  spawnTimer: 0,
  powerupTimer: 0,
  obstacles: [] as Obstacle[],
  powerups: [] as Powerup[],
  stars: [] as Star[],
};

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  state.width = canvas.width / devicePixelRatio;
  state.height = canvas.height / devicePixelRatio;
  buildStars();
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
    showOverlay("Config introuvable", "Ajoute configs/games/dodge.config.json", false);
    return;
  }
  mobileControls.show();
  const durationInput = document.getElementById("run-duration") as HTMLInputElement | null;
  if (durationInput && state.mode === "timed") {
    const parsed = Math.max(10, Math.min(999, Number(durationInput.value) || state.runDuration));
    state.runDuration = parsed;
  }
  state.running = true;
  state.player.x = state.width * 0.15;
  state.player.y = state.height / 2;
  state.player.dash = 0;
  state.player.dashCooldown = 0;
  state.time = 0;
  state.invulnerable = 0;
  state.spawnTimer = 0;
  state.powerupTimer = 0;
  state.obstacles = [];
  state.powerups = [];
  buildStars();
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  mobileControls.hide();
  const score = Math.floor(state.time);
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score } });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const best = (game.state.bestTime as number | undefined) || 0;
    if (score > best) {
      game.state.bestTime = score;
      game.bestScore = score;
    }
  });
  const action = win ? "Victoire !" : "Touché !";
  showOverlay(`${action} (${score}s)`, config?.uiText.help || "Rejoue pour pousser ton record.");
}

function showOverlay(title: string, body: string, showStart = true) {
  mobileControls.hide();
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Dodge Rush</p>
      <h2>${title}</h2>
      <p>${body}</p>
      <div class="mode-picker">
        <label><input type="radio" name="mode" value="timed" ${state.mode === "timed" ? "checked" : ""}/> Mode chrono</label>
        <label><input type="radio" name="mode" value="endless" ${state.mode === "endless" ? "checked" : ""}/> Mode infini</label>
        <div class="timed-only" style="display:${state.mode === "timed" ? "block" : "none"}; margin-top:8px;">
          <label>Durée (sec)
            <input id="run-duration" type="number" min="10" max="999" value="${state.runDuration}" />
          </label>
        </div>
      </div>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:12px;">
        ${showStart ? `<button class="btn" id="play-btn">Lancer</button>` : ""}
        <a class="btn secondary" href="${withBasePath("/apps/hub/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
    </div>
  `;
  const play = document.getElementById("play-btn");
  play?.addEventListener("click", startGame);
  wireModePicker();
}

showOverlay(config?.uiText.title || "Dodge Rush", config?.uiText.help || "");

function update(dt: number) {
  if (!state.running || !config) return;
  state.time += dt;
  state.spawnTimer += dt * 1000;
  state.powerupTimer += dt * 1000;
  const speed = config.difficultyParams.obstacleSpeed;

  // Player movement
  const moveX =
    (input.isDown(controls.right) ? 1 : 0) + (input.isDown(controls.left) ? -1 : 0);
  const moveY = (input.isDown(controls.down) ? 1 : 0) + (input.isDown(controls.up) ? -1 : 0);

  const dashKey = controls.dash;
  const dashReady = state.player.dashCooldown <= 0;
  if (input.isDown(dashKey) && dashReady) {
    state.player.dash = 0.45;
    state.player.dashCooldown = 2.5;
    state.dashIFrames = 0.35;
    emitEvent({ type: "DASH_USED", gameId: GAME_ID });
  }

  const speedMultiplier = state.player.dash > 0 ? 2.4 : 1;
  state.player.x += moveX * config.difficultyParams.playerSpeed * speedMultiplier * (dt * 60);
  state.player.y += moveY * config.difficultyParams.playerSpeed * speedMultiplier * (dt * 60);
  state.player.x = clamp(state.player.x, state.player.r, state.width - state.player.r);
  state.player.y = clamp(state.player.y, state.player.r, state.height - state.player.r);

  state.player.dash = Math.max(0, state.player.dash - dt);
  state.player.dashCooldown = Math.max(0, state.player.dashCooldown - dt);
  state.invulnerable = Math.max(0, state.invulnerable - dt);
  state.dashIFrames = Math.max(0, state.dashIFrames - dt);

  // Spawn obstacles
  if (state.spawnTimer >= config.difficultyParams.spawnIntervalMs) {
    state.spawnTimer = 0;
    state.obstacles.push({
      x: state.width + rand(10, 60),
      y: rand(40, state.height - 40),
      size: rand(12, 22),
      speed: speed * rand(0.9, 1.2),
    });
  }

  // Spawn powerups
  if (state.powerupTimer >= 1600) {
    state.powerupTimer = 0;
    if (chance(config.difficultyParams.powerupChance)) {
      state.powerups.push({
        x: rand(state.width * 0.4, state.width * 0.95),
        y: rand(50, state.height - 50),
        size: 10,
        duration: 2.5,
      });
    }
  }

  // Update obstacles
  state.obstacles = state.obstacles.filter((obs) => {
    obs.x -= (obs.speed + state.time * 0.02) * (dt * 60);
    if (obs.x + obs.size < 0) {
      emitEvent({ type: "OBSTACLE_DODGED", gameId: GAME_ID });
      return false;
    }
    const dx = obs.x - state.player.x;
    const dy = obs.y - state.player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const invulnActive = state.invulnerable > 0 || state.player.dash > 0 || state.dashIFrames > 0;
    if (dist < obs.size + state.player.r) {
      if (invulnActive) {
        emitEvent({ type: "OBSTACLE_DODGED", gameId: GAME_ID });
        return false;
      }
      endGame(false);
      return false;
    }
    return true;
  });

  // Update powerups
  state.powerups = state.powerups.filter((p) => {
    p.x -= speed * 0.5 * (dt * 60);
    const dx = p.x - state.player.x;
    const dy = p.y - state.player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < p.size + state.player.r) {
      emitEvent({ type: "POWERUP_COLLECTED", gameId: GAME_ID });
      state.invulnerable = Math.max(state.invulnerable, p.duration);
      state.dashIFrames = Math.max(state.dashIFrames, 0.35);
      state.player.dashCooldown = Math.max(0, state.player.dashCooldown - 1);
      return false;
    }
    return p.x + p.size > 0;
  });

  if (state.mode === "timed" && state.time >= state.runDuration) {
    endGame(true);
  }
}

function render() {
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);

  // Stars / décor
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  state.stars.forEach((s) => {
    ctx.globalAlpha = s.alpha;
    ctx.fillRect(s.x, s.y, s.size, s.size);
    ctx.globalAlpha = 1;
    s.x -= s.speed;
    if (s.x < -s.size) {
      s.x = state.width + rand(0, 40);
      s.y = rand(0, state.height);
    }
  });

  // Player
  const playerW = state.player.r * 3;
  const playerH = state.player.r * 2.4;
  drawSprite(playerImg, state.player.x - playerW / 2, state.player.y - playerH / 2, playerW, playerH);
  if (state.invulnerable > 0 || state.dashIFrames > 0) {
    const glow = state.invulnerable > 0 ? "rgba(122, 240, 255, 0.7)" : "rgba(255, 255, 255, 0.5)";
    ctx.strokeStyle = glow;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.r * 1.4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Obstacles
  state.obstacles.forEach((obs) => {
    const size = obs.size * 2.2;
    drawSprite(obstacleImg, obs.x - size / 2, obs.y - size / 2, size, size);
  });

  // Powerups
  state.powerups.forEach((p) => {
    const size = p.size * 2.2;
    drawSprite(powerupImg, p.x - size / 2, p.y - size / 2, size, size);
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
    <div class="pill">Temps ${state.time.toFixed(1)}s</div>
    <div class="pill">Dash ${Math.max(0, state.player.dashCooldown).toFixed(1)}s</div>
    <div class="pill">Invuln ${state.invulnerable.toFixed(1)}s</div>
    <div class="pill">${state.mode === "endless" ? "Mode infini" : `Run ${state.runDuration}s`}</div>
  `;
  ui.appendChild(hud);
}

function drawSprite(img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  if (img.complete) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, w, h);
  }
}

function buildStars() {
  const count = Math.floor((state.width * state.height) / 12000);
  state.stars = Array.from({ length: count }, () => ({
    x: rand(0, state.width),
    y: rand(0, state.height),
    size: rand(1, 3),
    speed: rand(0.6, 1.6),
    alpha: rand(0.3, 0.8),
  }));
}

function wireModePicker() {
  const modeRadios = overlay.querySelectorAll<HTMLInputElement>('input[name="mode"]');
  modeRadios.forEach((r) =>
    r.addEventListener("change", () => {
      state.mode = (r.value as Mode) || "timed";
      const timedOnly = overlay.querySelector<HTMLElement>(".timed-only");
      if (timedOnly) timedOnly.style.display = state.mode === "timed" ? "block" : "none";
    }),
  );
}
