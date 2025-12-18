import "./style.css";
import { createHybridInput, createMobileControls } from "@core/input";
import { createGameLoop } from "@core/loop";
import { clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "drive";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = config ? themes.find((t) => t.id === config.themeId) || themes[0] : themes[0];
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
  left: config?.input.keys.left || "ArrowLeft",
  right: config?.input.keys.right || "ArrowRight",
  boost: config?.input.keys.boost || "ArrowUp",
};

const mobileControls = createMobileControls({
  container: document.body,
  input,
  mapping: {
    left: controls.left,
    right: controls.right,
    up: controls.boost,
    actionA: controls.boost,
    actionALabel: "Boost",
  },
  autoShow: false,
  showPad: false,
});

const carSprite = new Image();
carSprite.src = new URL("../assets/car.svg", import.meta.url).href;
const trafficSprite = new Image();
trafficSprite.src = new URL("../assets/traffic.svg", import.meta.url).href;
const pickupSprite = new Image();
pickupSprite.src = new URL("../assets/pickup.svg", import.meta.url).href;

type Entity = { lane: number; y: number; speed: number };
type Pickup = { lane: number; y: number };

const laneCount = config?.difficultyParams.laneCount ?? 3;
const lanes = Array.from({ length: laneCount }, (_, i) => i);

const state = {
  running: false,
  width: 0,
  height: 0,
  roadWidth: 0,
  laneWidth: 0,
  player: { lane: 1, y: 0.78, speed: 0, boost: 0, cooldown: 0 },
  traffic: [] as Entity[],
  pickups: [] as Pickup[],
  distance: 0,
  best: 0,
  speed: 120,
  trafficTimer: 0,
  pickupTimer: 0,
};

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  state.width = canvas.width / devicePixelRatio;
  state.height = canvas.height / devicePixelRatio;
  state.roadWidth = Math.min(520, state.width * 0.65);
  state.laneWidth = state.roadWidth / laneCount;
}
resize();
window.addEventListener("resize", resize);

const loop = createGameLoop({
  update: (dt) => update(dt),
  render,
  fps: 60,
});

function reset() {
  state.player.lane = Math.floor(laneCount / 2);
  state.player.boost = 0;
  state.player.cooldown = 0;
  state.distance = 0;
  state.traffic = [];
  state.pickups = [];
  state.speed = config?.difficultyParams.trafficSpeed ?? 200;
  state.trafficTimer = 0;
  state.pickupTimer = 0;
}

function startGame() {
  if (!config) {
    showOverlay("Config à compléter", "Crée configs/games/drive.config.json", false);
    return;
  }
  mobileControls.show();
  reset();
  state.running = true;
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  mobileControls.hide();
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score: Math.floor(state.distance) } });
  if (config) {
    updateGameState(GAME_ID, config.saveSchemaVersion, (game) => {
      const best = (game.state.bestDistance as number | undefined) || 0;
      if (state.distance > best) {
        game.state.bestDistance = Math.floor(state.distance);
        game.bestScore = Math.floor(state.distance);
      }
    });
  }
  showOverlay(win ? "Tu traces !" : "Crash !", config?.uiText.help || "");
}

function spawnTraffic() {
  const lane = lanes[rand(0, lanes.length - 1)];
  const baseSpeed = config?.difficultyParams.trafficSpeed ?? 220;
  const variance = config?.difficultyParams.trafficSpeedVariance ?? 40;
  const speed = baseSpeed + rand(-variance, variance);
  state.traffic.push({ lane, y: -0.3, speed });
}

function spawnPickup() {
  const lane = lanes[rand(0, lanes.length - 1)];
  state.pickups.push({ lane, y: -0.3 });
}

function moveLane(delta: number) {
  state.player.lane = clamp(state.player.lane + delta, 0, laneCount - 1);
}

function handleBoost(dt: number) {
  state.player.cooldown = Math.max(0, state.player.cooldown - dt * 1000);
  state.player.boost = Math.max(0, state.player.boost - dt * 1000);
  if (state.player.boost > 0) return;
  const wantsBoost = input.isDown(controls.boost);
  if (wantsBoost && state.player.cooldown <= 0) {
    state.player.boost = config?.difficultyParams.boostDurationMs ?? 2600;
    state.player.cooldown = config?.difficultyParams.boostCooldownMs ?? 4200;
    emitEvent({ type: "BOOST_USED", gameId: GAME_ID });
  }
}

function handleInput() {
  if (input.isDown(controls.left)) moveLane(-1);
  if (input.isDown(controls.right)) moveLane(1);
}

function updateEntities(dt: number) {
  state.traffic = state.traffic
    .map((car) => ({ ...car, y: car.y + (car.speed / state.height) * dt }))
    .filter((car) => car.y < 1.4);

  state.pickups = state.pickups
    .map((p) => ({ ...p, y: p.y + (state.speed / state.height) * dt }))
    .filter((p) => p.y < 1.4);
}

function checkCollisions() {
  const laneX = (lane: number) =>
    state.width / 2 - state.roadWidth / 2 + lane * state.laneWidth + state.laneWidth / 2;
  const carY = state.height * state.player.y;
  const carHalf = state.laneWidth * 0.35;
  for (const car of state.traffic) {
    if (car.lane !== state.player.lane) continue;
    const obsY = car.y * state.height;
    if (Math.abs(obsY - carY) < carHalf * 1.1) {
      if (state.player.boost > 0) {
        emitEvent({ type: "OBSTACLE_DODGED", gameId: GAME_ID });
        state.traffic = state.traffic.filter((c) => c !== car);
      } else {
        endGame(false);
        return;
      }
    }
  }

  for (const pickup of state.pickups) {
    if (pickup.lane !== state.player.lane) continue;
    const py = pickup.y * state.height;
    if (Math.abs(py - carY) < carHalf) {
      emitEvent({ type: "ITEM_COLLECTED", gameId: GAME_ID });
      state.player.boost = (config?.difficultyParams.boostDurationMs ?? 2600) / 2;
      state.pickups = state.pickups.filter((p) => p !== pickup);
    }
  }
}

function update(dt: number) {
  if (!state.running || !config) return;
  state.distance += (state.speed / 10) * dt;
  state.speed += dt * 2;
  state.trafficTimer += dt * 1000;
  state.pickupTimer += dt * 1000;
  handleInput();
  handleBoost(dt);
  updateEntities(dt);
  if (state.trafficTimer >= (config?.difficultyParams.trafficSpawnMs ?? 950)) {
    state.trafficTimer = 0;
    spawnTraffic();
  }
  if (state.pickupTimer >= (config?.difficultyParams.pickupSpawnMs ?? 1800)) {
    state.pickupTimer = 0;
    spawnPickup();
  }
  checkCollisions();
}

function render() {
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);

  // Road
  const roadX = state.width / 2 - state.roadWidth / 2;
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(roadX, 0, state.roadWidth, state.height);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  for (let i = 1; i < laneCount; i++) {
    const x = roadX + i * state.laneWidth;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, state.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const carX = roadX + state.player.lane * state.laneWidth + state.laneWidth / 2 - state.laneWidth * 0.25;
  const carY = state.height * state.player.y - state.laneWidth * 0.5;
  drawSprite(carSprite, carX, carY, state.laneWidth * 0.5, state.laneWidth * 0.9);

  state.traffic.forEach((car) => {
    const x = roadX + car.lane * state.laneWidth + state.laneWidth / 2 - state.laneWidth * 0.25;
    const y = car.y * state.height - state.laneWidth * 0.5;
    drawSprite(trafficSprite, x, y, state.laneWidth * 0.5, state.laneWidth * 0.9);
  });

  state.pickups.forEach((p) => {
    const x = roadX + p.lane * state.laneWidth + state.laneWidth / 2 - state.laneWidth * 0.25;
    const y = p.y * state.height - state.laneWidth * 0.25;
    drawSprite(pickupSprite, x, y, state.laneWidth * 0.5, state.laneWidth * 0.5);
  });

  ctx.restore();
  renderHUD();
}

function drawSprite(img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  if (img.complete) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.fillStyle = theme.colors.primary;
    ctx.fillRect(x, y, w, h);
  }
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hud = document.createElement("div");
  hud.className = "hud";
  const boost = Math.max(0, Math.floor(state.player.boost / 100) / 10);
  const cd = Math.max(0, Math.floor(state.player.cooldown / 100) / 10);
  hud.innerHTML = `
    <div class="pill">Distance ${Math.floor(state.distance)} m</div>
    <div class="pill">Boost ${boost ? boost + "s" : "prêt"} · CD ${cd ? cd + "s" : "0s"}</div>
    <div class="pill">Trafic ${state.traffic.length}</div>
  `;
  ui.appendChild(hud);
}

function showOverlay(title: string, body: string, showStart = true) {
  mobileControls.hide();
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Neon Drive</p>
      <h2>${title}</h2>
      <p>${body}</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:12px;">
        ${showStart ? `<button class="btn" id="play-btn">Lancer</button>` : ""}
        <a class="btn secondary" href="${withBasePath("/apps/hub/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
      <p class="legend">Contrôles : Gauche/Droite pour changer de voie · Haut pour boost.</p>
    </div>
  `;
  const play = document.getElementById("play-btn");
  play?.addEventListener("click", startGame);
}

showOverlay(config?.uiText.title || "Neon Drive", config?.uiText.help || "Évite les voitures et ramasse les boosts.");
