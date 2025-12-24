import "./style.css";
import "@core/launch-menu.css";
import { createHybridInput, createMobileControlManager } from "@core/input";
import { createGameLoop } from "@core/loop";
import { clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "__GAME_ID__";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = config ? themes.find((t) => t.id === config.themeId) || themes[0] : themes[0];
attachProgressionListener();

const playerImg = new Image();
playerImg.src = new URL("../assets/player.svg", import.meta.url).href;
const pickupImg = new Image();
pickupImg.src = new URL("../assets/pickup.svg", import.meta.url).href;

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
};

const mobileControls = createMobileControlManager({
  gameId: GAME_ID,
  container: document.body,
  input,
  touch: {
    mapping: {
      up: controls.up,
      down: controls.down,
      left: controls.left,
      right: controls.right,
    },
    showPad: true,
    gestureEnabled: false,
  },
  motion: {
    input,
    axis: {
      x: { negative: controls.left, positive: controls.right },
      y: { negative: controls.up, positive: controls.down },
    },
  },
  hints: {
    touch: "Tactile : glisse pour bouger.",
    motion: "Gyro : incline pour bouger.",
  },
});

type Pickup = { x: number; y: number; collected: boolean };

const state = {
  running: false,
  width: 0,
  height: 0,
  player: { x: 0, y: 0, r: 12 },
  pickups: [] as Pickup[],
  score: 0,
  timer: 45,
};

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  state.width = rect.width;
  state.height = rect.height;
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
    showOverlay("Config à compléter", "Crée configs/games/<id>.config.json", false);
    return;
  }
  mobileControls.show();
  state.running = true;
  state.player.x = state.width / 2;
  state.player.y = state.height / 2;
  state.pickups = [];
  for (let i = 0; i < 8; i++) {
    state.pickups.push({ x: rand(40, state.width - 40), y: rand(40, state.height - 40), collected: false });
  }
  state.score = 0;
  state.timer = 45;
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score: state.score } });
  if (config) {
    updateGameState(GAME_ID, config.saveSchemaVersion, (game) => {
      const best = (game.state.bestScore as number | undefined) || 0;
      if (state.score > best) {
        game.state.bestScore = state.score;
        game.bestScore = state.score;
      }
    });
  }
  showOverlay(win ? "GG" : "Raté", config?.uiText.help || "");
}

function showOverlay(title: string, body: string, showStart = true) {
  mobileControls.hide();
  overlay.style.display = "grid";
  const shortDescription = config?.uiText.shortDescription || "";
  const description = body || config?.uiText.help || "";
  const controlsList = (config?.uiText.controls || [])
    .map((item) => `<span class="launch-chip">${item}</span>`)
    .join("");
  const settingsMarkup = `
    <div class="launch-rows">
      <div class="launch-row">
        <span class="launch-row-label">Mode</span>
        <div class="launch-row-value">
          <span class="launch-chip">Standard</span>
        </div>
      </div>
      <div class="launch-row">
        <span class="launch-row-label">Durée</span>
        <div class="launch-row-value">
          <span class="launch-chip">45s</span>
        </div>
      </div>
    </div>
  `;
  overlay.innerHTML = `
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${config?.uiText.title || "Template"}</span>
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
}

showOverlay(config?.uiText.title || "Nouveau jeu", config?.uiText.help || "Copie ce template et ajoute ta config.");

function update(dt: number) {
  if (!state.running || !config) return;
  state.timer -= dt;
  if (state.timer <= 0) {
    endGame(false);
    return;
  }

  const moveX =
    (input.isDown(controls.right) ? 1 : 0) + (input.isDown(controls.left) ? -1 : 0);
  const moveY = (input.isDown(controls.down) ? 1 : 0) + (input.isDown(controls.up) ? -1 : 0);
  const speed = config.difficultyParams.playerSpeed || 3;
  state.player.x += moveX * speed * (dt * 60);
  state.player.y += moveY * speed * (dt * 60);
  state.player.x = clamp(state.player.x, state.player.r, state.width - state.player.r);
  state.player.y = clamp(state.player.y, state.player.r, state.height - state.player.r);

  state.pickups.forEach((pickup) => {
    if (pickup.collected) return;
    const dx = pickup.x - state.player.x;
    const dy = pickup.y - state.player.y;
    if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 10) {
      pickup.collected = true;
      state.score += 10;
      emitEvent({ type: "ITEM_COLLECTED", gameId: GAME_ID });
    }
  });

  if (state.pickups.every((p) => p.collected)) {
    endGame(true);
  }
}

function render() {
  const width = Math.round(canvas.clientWidth);
  const height = Math.round(canvas.clientHeight);
  if (width !== Math.round(state.width) || height !== Math.round(state.height)) {
    resize();
  }
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);

  // Player
  const playerSize = state.player.r * 2.4;
  if (playerImg.complete) {
    ctx.drawImage(playerImg, state.player.x - playerSize / 2, state.player.y - playerSize / 2, playerSize, playerSize);
  } else {
    ctx.fillStyle = theme.colors.primary;
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pickups
  state.pickups.forEach((p) => {
    ctx.globalAlpha = p.collected ? 0.25 : 1;
    if (pickupImg.complete) {
      ctx.drawImage(pickupImg, p.x - 12, p.y - 12, 24, 24);
    } else {
      ctx.fillStyle = theme.colors.secondary;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
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
    <div class="pill">Temps ${state.timer.toFixed(1)}s</div>
    <div class="pill">Score ${state.score}</div>
  `;
  ui.appendChild(hud);
}
