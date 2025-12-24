import "./style.css";
import "@core/launch-menu.css";
import { createHybridInput, createMobileControlManager } from "@core/input";
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
overlay.className = "launch-overlay";
overlay.style.display = "none";
ui.appendChild(overlay);

const controls = {
  left: config?.input.keys.left || "ArrowLeft",
  right: config?.input.keys.right || "ArrowRight",
  boost: config?.input.keys.boost || "ArrowUp",
};

const laneChangeSpeed = 10;
const laneRepeatDelay = 0.24;
const laneRepeatInterval = 0.14;

const mobileControls = createMobileControlManager({
  gameId: GAME_ID,
  container: document.body,
  input,
  touch: {
    mapping: {
      left: controls.left,
      right: controls.right,
      up: controls.boost,
      actionA: controls.boost,
      actionALabel: "Boost",
    },
    showPad: true,
    gestureEnabled: true,
  },
  motion: {
    input,
    axis: {
      x: { negative: controls.left, positive: controls.right },
    },
    actions: [{ code: controls.boost, trigger: "tiltForward", mode: "hold", threshold: 16 }],
  },
  hints: {
    touch: "Glisse ou boutons pour changer de voie, bouton Boost.",
    motion: "Incliner pour changer de voie, pencher vers l'avant pour booster.",
  },
});

const carSprite = new Image();
carSprite.src = new URL("../assets/car.svg", import.meta.url).href;
const trafficSprite = new Image();
trafficSprite.src = new URL("../assets/traffic.svg", import.meta.url).href;
const pickupSprite = new Image();
pickupSprite.src = new URL("../assets/pickup.svg", import.meta.url).href;

type Entity = { lane: number; y: number; speed: number };
type ItemKind = "bonus-invincible" | "bonus-slow" | "malus-speed" | "malus-invert";
type Item = { lane: number; y: number; kind: ItemKind };

const effectParams = {
  bonusInvincibleMs: config?.difficultyParams.bonusInvincibleMs ?? 2200,
  bonusSlowMs: config?.difficultyParams.bonusSlowMs ?? 2400,
  slowMultiplier: config?.difficultyParams.slowMultiplier ?? 0.65,
  malusSpeedMs: config?.difficultyParams.malusSpeedMs ?? 2600,
  speedUpMultiplier: config?.difficultyParams.speedUpMultiplier ?? 1.35,
  malusInvertMs: config?.difficultyParams.malusInvertMs ?? 2600,
};
const boostDurationMs = config?.difficultyParams.boostDurationMs ?? 2600;
const boostCooldownMs = config?.difficultyParams.boostCooldownMs ?? 4200;

const baseBonusSpawnMs =
  config?.difficultyParams.bonusSpawnMs ?? config?.difficultyParams.pickupSpawnMs ?? 1800;
const baseMalusSpawnMs = config?.difficultyParams.malusSpawnMs ?? 3200;
const baseWinDistance = config?.difficultyParams.winDistance ?? 1000;

const difficultyPresets = {
  easy: {
    label: "Facile",
    laneCount: 3,
    trafficSpawnMs: 1100,
    trafficSpeed: 210,
    trafficSpeedVariance: 35,
    trafficPerSpawn: 1,
    bonusSpawnMs: 2400,
    malusSpawnMs: 3600,
    winDistance: 1400,
  },
  medium: {
    label: "Moyen",
    laneCount: config?.difficultyParams.laneCount ?? 3,
    trafficSpawnMs: config?.difficultyParams.trafficSpawnMs ?? 950,
    trafficSpeed: config?.difficultyParams.trafficSpeed ?? 220,
    trafficSpeedVariance: config?.difficultyParams.trafficSpeedVariance ?? 40,
    trafficPerSpawn: 1,
    bonusSpawnMs: baseBonusSpawnMs,
    malusSpawnMs: baseMalusSpawnMs,
    winDistance: baseWinDistance,
  },
  hard: {
    label: "Difficile",
    laneCount: 3,
    trafficSpawnMs: 620,
    trafficSpeed: 265,
    trafficSpeedVariance: 60,
    trafficPerSpawn: 2,
    bonusSpawnMs: 3200,
    malusSpawnMs: 1700,
    winDistance: 2600,
  },
  extreme: {
    label: "Extrême",
    laneCount: 4,
    trafficSpawnMs: 440,
    trafficSpeed: 310,
    trafficSpeedVariance: 75,
    trafficPerSpawn: 3,
    bonusSpawnMs: Infinity,
    malusSpawnMs: 1100,
    winDistance: 3200,
  },
  endless: {
    label: "Infini",
    laneCount: 4,
    trafficSpawnMs: 600,
    trafficSpeed: 290,
    trafficSpeedVariance: 60,
    trafficPerSpawn: 2,
    bonusSpawnMs: 2300,
    malusSpawnMs: 2000,
    winDistance: Infinity,
  },
} as const;

type DifficultyKey = keyof typeof difficultyPresets;
let selectedDifficulty: DifficultyKey = "medium";

const bonusKinds: ItemKind[] = ["bonus-invincible", "bonus-slow"];
const malusKinds: ItemKind[] = ["malus-speed", "malus-invert"];

const state = {
  running: false,
  width: 0,
  height: 0,
  roadWidth: 0,
  laneWidth: 0,
  laneCount: config?.difficultyParams.laneCount ?? 3,
  lanes: [] as number[],
  player: { lane: 1, lanePos: 1, y: 0.78, speed: 0, boost: 0, cooldown: 0 },
  traffic: [] as Entity[],
  items: [] as Item[],
  distance: 0,
  best: 0,
  speed: 120,
  trafficTimer: 0,
  bonusTimer: 0,
  malusTimer: 0,
  trafficSpawnMs: config?.difficultyParams.trafficSpawnMs ?? 950,
  trafficPerSpawn: 1,
  trafficSpeed: config?.difficultyParams.trafficSpeed ?? 220,
  trafficSpeedVariance: config?.difficultyParams.trafficSpeedVariance ?? 40,
  bonusSpawnMs: baseBonusSpawnMs,
  malusSpawnMs: baseMalusSpawnMs,
  winDistance: baseWinDistance,
  effects: { slow: 0, speedUp: 0, invert: 0 },
};

const laneInput = {
  left: { held: 0, nextRepeat: 0, wasDown: false },
  right: { held: 0, nextRepeat: 0, wasDown: false },
};

function syncLanes() {
  state.lanes = Array.from({ length: state.laneCount }, (_, i) => i);
  state.laneWidth = state.roadWidth / state.laneCount;
}

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  state.width = canvas.width / devicePixelRatio;
  state.height = canvas.height / devicePixelRatio;
  state.roadWidth = Math.min(520, state.width * 0.65);
  syncLanes();
}
resize();
window.addEventListener("resize", resize);

const loop = createGameLoop({
  update: (dt) => update(dt),
  render,
  fps: 60,
});

function applyDifficulty(preset: (typeof difficultyPresets)[DifficultyKey]) {
  state.laneCount = preset.laneCount;
  state.trafficSpawnMs = preset.trafficSpawnMs;
  state.trafficPerSpawn = Math.max(1, Math.min(preset.trafficPerSpawn, preset.laneCount - 1));
  state.trafficSpeed = preset.trafficSpeed;
  state.trafficSpeedVariance = preset.trafficSpeedVariance;
  state.bonusSpawnMs = preset.bonusSpawnMs;
  state.malusSpawnMs = preset.malusSpawnMs;
  state.winDistance = preset.winDistance;
  resize();
}

function reset() {
  state.player.lane = Math.floor(state.laneCount / 2);
  state.player.lanePos = state.player.lane;
  state.player.boost = 0;
  state.player.cooldown = 0;
  laneInput.left = { held: 0, nextRepeat: 0, wasDown: false };
  laneInput.right = { held: 0, nextRepeat: 0, wasDown: false };
  state.distance = 0;
  state.traffic = [];
  state.items = [];
  state.speed = state.trafficSpeed;
  state.trafficTimer = 0;
  state.bonusTimer = 0;
  state.malusTimer = 0;
  state.effects.slow = 0;
  state.effects.speedUp = 0;
  state.effects.invert = 0;
}

function startGame() {
  if (!config) {
    showOverlay("Config à compléter", "Crée configs/games/drive.config.json", false);
    return;
  }
  mobileControls.show();
  const preset = difficultyPresets[selectedDifficulty] || difficultyPresets.medium;
  applyDifficulty(preset);
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

function pickRandomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickRandomDistinct(items: number[], count: number) {
  const pool = [...items];
  const selected: number[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }
  return selected;
}

function getTrafficMinGap() {
  const carHeight = state.laneWidth * 0.9;
  return Math.max(0.18, (carHeight / state.height) * 1.2);
}

function getItemMinGap() {
  const itemSize = state.laneWidth * 0.5;
  return Math.max(0.2, (itemSize / state.height) * 1.2);
}

function isLaneSpawnable(lane: number) {
  const minGap = getTrafficMinGap();
  return !state.traffic.some((car) => car.lane === lane && car.y < minGap);
}

function isItemSpawnable(lane: number) {
  const minGap = getItemMinGap();
  const trafficBlocked = state.traffic.some((car) => car.lane === lane && car.y < minGap);
  const itemBlocked = state.items.some((item) => item.lane === lane && item.y < minGap);
  return !trafficBlocked && !itemBlocked;
}

function pickSafeLane() {
  const spawnable = state.lanes.filter((lane) => isLaneSpawnable(lane));
  if (spawnable.length) return pickRandomFrom(spawnable);
  return pickRandomFrom(state.lanes);
}

function pickItemLane() {
  const available = state.lanes.filter((lane) => isItemSpawnable(lane));
  if (!available.length) return null;
  const scored = available.map((lane) => ({
    lane,
    count: state.traffic.filter((car) => car.lane === lane).length,
  }));
  const minCount = scored.reduce((min, entry) => Math.min(min, entry.count), Infinity);
  const options = scored.filter((entry) => entry.count === minCount).map((entry) => entry.lane);
  return pickRandomFrom(options.length ? options : available);
}

function spawnTrafficInLane(lane: number) {
  const speed = state.trafficSpeed + rand(-state.trafficSpeedVariance, state.trafficSpeedVariance);
  state.traffic.push({ lane, y: -0.3, speed });
}

function spawnTrafficRow() {
  if (!state.lanes.length) return;
  // Keep one lane free each row so there is always a possible path.
  const safeLane = pickSafeLane();
  const available = state.lanes.filter((lane) => lane !== safeLane && isLaneSpawnable(lane));
  if (available.length === 0) return;
  const count = Math.min(state.trafficPerSpawn, available.length);
  const spawnLanes = pickRandomDistinct(available, count);
  spawnLanes.forEach(spawnTrafficInLane);
}

function spawnItem(kind: ItemKind) {
  if (!state.lanes.length) return;
  const lane = pickItemLane();
  if (lane === null) return;
  state.items.push({ lane, y: -0.3, kind });
}

function spawnRandomItem(kinds: ItemKind[]) {
  if (!kinds.length) return;
  spawnItem(pickRandomFrom(kinds));
}

function applyItemEffect(item: Item) {
  emitEvent({ type: "ITEM_COLLECTED", gameId: GAME_ID });
  switch (item.kind) {
    case "bonus-invincible":
      state.player.boost = Math.max(state.player.boost, effectParams.bonusInvincibleMs);
      break;
    case "bonus-slow":
      state.effects.slow = Math.max(state.effects.slow, effectParams.bonusSlowMs);
      break;
    case "malus-speed":
      state.effects.speedUp = Math.max(state.effects.speedUp, effectParams.malusSpeedMs);
      break;
    case "malus-invert":
      state.effects.invert = Math.max(state.effects.invert, effectParams.malusInvertMs);
      break;
  }
}

function updateEffects(dt: number) {
  const decay = dt * 1000;
  state.effects.slow = Math.max(0, state.effects.slow - decay);
  state.effects.speedUp = Math.max(0, state.effects.speedUp - decay);
  state.effects.invert = Math.max(0, state.effects.invert - decay);
}

function getSpeedFactor() {
  let factor = 1;
  if (state.effects.slow > 0) factor *= effectParams.slowMultiplier;
  if (state.effects.speedUp > 0) factor *= effectParams.speedUpMultiplier;
  return factor;
}

function moveLane(delta: number) {
  state.player.lane = clamp(state.player.lane + delta, 0, state.laneCount - 1);
}

function updateLanePosition(dt: number) {
  const delta = state.player.lane - state.player.lanePos;
  if (Math.abs(delta) < 0.001) {
    state.player.lanePos = state.player.lane;
    return;
  }
  state.player.lanePos += delta * Math.min(1, dt * laneChangeSpeed);
}

function handleBoost(dt: number) {
  state.player.cooldown = Math.max(0, state.player.cooldown - dt * 1000);
  state.player.boost = Math.max(0, state.player.boost - dt * 1000);
  if (state.player.boost > 0) return;
  const wantsBoost = input.isDown(controls.boost);
  if (wantsBoost && state.player.cooldown <= 0) {
    state.player.boost = boostDurationMs;
    state.player.cooldown = boostCooldownMs;
    emitEvent({ type: "BOOST_USED", gameId: GAME_ID });
  }
}

function handleInput(dt: number) {
  const inverted = state.effects.invert > 0;
  const leftDownRaw = input.isDown(controls.left);
  const rightDownRaw = input.isDown(controls.right);
  const leftDown = inverted ? rightDownRaw : leftDownRaw;
  const rightDown = inverted ? leftDownRaw : rightDownRaw;

  const updateDirection = (key: "left" | "right", down: boolean, delta: number) => {
    const entry = laneInput[key];
    if (!down) {
      entry.held = 0;
      entry.nextRepeat = 0;
      entry.wasDown = false;
      return;
    }
    entry.held += dt;
    if (!entry.wasDown) {
      moveLane(delta);
      entry.wasDown = true;
      entry.nextRepeat = laneRepeatDelay;
      return;
    }
    if (entry.nextRepeat > 0 && entry.held >= entry.nextRepeat) {
      moveLane(delta);
      entry.nextRepeat += laneRepeatInterval;
    }
  };

  updateDirection("left", leftDown, -1);
  updateDirection("right", rightDown, 1);
}

function updateEntities(dt: number, speedFactor: number) {
  state.traffic = state.traffic
    .map((car) => ({ ...car, y: car.y + ((car.speed * speedFactor) / state.height) * dt }))
    .filter((car) => car.y < 1.4);

  state.items = state.items
    .map((item) => ({ ...item, y: item.y + ((state.speed * speedFactor) / state.height) * dt }))
    .filter((item) => item.y < 1.4);
}

function checkCollisions() {
  const carY = state.height * state.player.y;
  const carHalf = state.laneWidth * 0.35;
  for (const car of state.traffic) {
    if (Math.abs(car.lane - state.player.lanePos) > 0.45) continue;
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

  const remaining: Item[] = [];
  for (const item of state.items) {
    if (Math.abs(item.lane - state.player.lanePos) > 0.45) {
      remaining.push(item);
      continue;
    }
    const itemY = item.y * state.height;
    if (Math.abs(itemY - carY) < carHalf) {
      applyItemEffect(item);
      continue;
    }
    remaining.push(item);
  }
  state.items = remaining;
}

function update(dt: number) {
  if (!state.running || !config) return;
  const speedFactor = getSpeedFactor();
  state.distance += (state.speed / 10) * dt * speedFactor;
  state.speed += dt * 2;
  if (state.winDistance !== Infinity && state.distance >= state.winDistance) {
    endGame(true);
    return;
  }
  state.trafficTimer += dt * 1000;
  state.bonusTimer += dt * 1000;
  state.malusTimer += dt * 1000;
  handleInput(dt);
  handleBoost(dt);
  updateLanePosition(dt);
  updateEntities(dt, speedFactor);
  updateEffects(dt);
  if (state.trafficTimer >= state.trafficSpawnMs) {
    state.trafficTimer = 0;
    spawnTrafficRow();
  }
  if (state.bonusSpawnMs !== Infinity && state.bonusTimer >= state.bonusSpawnMs) {
    state.bonusTimer = 0;
    spawnRandomItem(bonusKinds);
  }
  if (state.malusSpawnMs !== Infinity && state.malusTimer >= state.malusSpawnMs) {
    state.malusTimer = 0;
    spawnRandomItem(malusKinds);
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
  for (let i = 1; i < state.laneCount; i++) {
    const x = roadX + i * state.laneWidth;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, state.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const carX =
    roadX + state.player.lanePos * state.laneWidth + state.laneWidth / 2 - state.laneWidth * 0.25;
  const carY = state.height * state.player.y - state.laneWidth * 0.5;
  drawSprite(carSprite, carX, carY, state.laneWidth * 0.5, state.laneWidth * 0.9);

  state.traffic.forEach((car) => {
    const x = roadX + car.lane * state.laneWidth + state.laneWidth / 2 - state.laneWidth * 0.25;
    const y = car.y * state.height - state.laneWidth * 0.5;
    drawSprite(trafficSprite, x, y, state.laneWidth * 0.5, state.laneWidth * 0.9);
  });

  state.items.forEach((item) => {
    drawItem(item, roadX);
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

function drawItem(item: Item, roadX: number) {
  const size = state.laneWidth * 0.5;
  const x = roadX + item.lane * state.laneWidth + state.laneWidth / 2 - size / 2;
  const y = item.y * state.height - size / 2;
  const glow =
    item.kind === "bonus-invincible"
      ? "rgba(100, 244, 172, 0.35)"
      : item.kind === "bonus-slow"
        ? "rgba(125, 211, 252, 0.35)"
        : item.kind === "malus-speed"
          ? "rgba(249, 115, 22, 0.35)"
          : "rgba(244, 63, 94, 0.35)";
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size / 2, size * 0.55, size * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  drawSprite(pickupSprite, x, y, size, size);
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hud = document.createElement("div");
  hud.className = "hud";
  const boost = Math.max(0, Math.floor(state.player.boost / 100) / 10);
  const cd = Math.max(0, Math.floor(state.player.cooldown / 100) / 10);
  const slow = Math.max(0, Math.floor(state.effects.slow / 100) / 10);
  const speedUp = Math.max(0, Math.floor(state.effects.speedUp / 100) / 10);
  const invert = Math.max(0, Math.floor(state.effects.invert / 100) / 10);
  const effects: string[] = [];
  if (state.player.boost > 0) effects.push(`Invuln ${boost}s`);
  if (state.effects.slow > 0) effects.push(`Ralenti ${slow}s`);
  if (state.effects.speedUp > 0) effects.push(`Turbo ${speedUp}s`);
  if (state.effects.invert > 0) effects.push(`Inversion ${invert}s`);
  const effectsLabel = effects.length ? effects.join(" · ") : "Aucun";
  const distanceLabel =
    state.winDistance === Infinity
      ? `${Math.floor(state.distance)} m`
      : `${Math.floor(state.distance)} / ${Math.floor(state.winDistance)} m`;
  hud.innerHTML = `
    <div class="pill">Distance ${distanceLabel}</div>
    <div class="pill">Boost ${boost ? boost + "s" : "prêt"} · CD ${cd ? cd + "s" : "0s"}</div>
    <div class="pill">Effets ${effectsLabel}</div>
    <div class="pill">Trafic ${state.traffic.length}</div>
  `;
  ui.appendChild(hud);
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
  const boostDuration = Math.round(boostDurationMs / 1000);
  const objectiveLabel = preset.winDistance === Infinity ? "Infini" : `${preset.winDistance} m`;
  const difficultyOptions = Object.entries(difficultyPresets)
    .map(([key, option]) => {
      const objective = option.winDistance === Infinity ? "∞" : `${option.winDistance} m`;
      return `
        <button class="launch-option diff-btn ${key === selectedDifficulty ? "is-active" : ""}" data-diff="${key}">
          <span class="launch-option-title">${option.label}</span>
          <span class="launch-option-meta">${option.laneCount} voies · ${objective}</span>
        </button>
      `;
    })
    .join("");
  const settingsMarkup = `
    <div class="launch-rows">
      <div class="launch-row">
        <span class="launch-row-label">Niveau</span>
        <div class="launch-row-value launch-options">
          ${difficultyOptions}
        </div>
      </div>
      <div class="launch-row">
        <span class="launch-row-label">Objectif</span>
        <div class="launch-row-value">
          <span class="launch-chip" id="drive-objective">${objectiveLabel}</span>
        </div>
      </div>
      <div class="launch-row">
        <span class="launch-row-label">Voies</span>
        <div class="launch-row-value">
          <span class="launch-chip" id="drive-lanes">${preset.laneCount}</span>
        </div>
      </div>
      <div class="launch-row">
        <span class="launch-row-label">Boost</span>
        <div class="launch-row-value">
          <span class="launch-chip">${boostDuration}s</span>
        </div>
      </div>
    </div>
  `;
  overlay.innerHTML = `
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${config?.uiText.title || "Neon Drive"}</span>
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
  wireDifficultyPicker();
}

function wireDifficultyPicker() {
  const objective = document.getElementById("drive-objective");
  const lanes = document.getElementById("drive-lanes");
  document.querySelectorAll<HTMLButtonElement>(".diff-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const diff = btn.dataset.diff as DifficultyKey | undefined;
      if (!diff || !difficultyPresets[diff]) return;
      selectedDifficulty = diff;
      document.querySelectorAll<HTMLButtonElement>(".diff-btn").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.diff === selectedDifficulty);
      });
      const preset = difficultyPresets[selectedDifficulty];
      if (objective) {
        objective.textContent = preset.winDistance === Infinity ? "Infini" : `${preset.winDistance} m`;
      }
      if (lanes) lanes.textContent = `${preset.laneCount}`;
    });
  });
}

showOverlay(config?.uiText.title || "Neon Drive", config?.uiText.help || "Évite les voitures et ramasse les boosts.");
