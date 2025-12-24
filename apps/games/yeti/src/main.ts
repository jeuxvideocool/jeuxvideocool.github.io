import "./style.css";
import "@core/launch-menu.css";
import { createHybridInput, createMobileControlManager } from "@core/input";
import { createGameLoop } from "@core/loop";
import { chance, clamp, lerp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { loadSave, updateGameState } from "@storage";

const GAME_ID = "yeti";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = config ? themes.find((t) => t.id === config.themeId) || themes[0] : themes[0];
attachProgressionListener();

const storedBest = loadSave().games?.[GAME_ID]?.bestScore ?? 0;

if (theme) {
  const root = document.documentElement.style;
  root.setProperty("--color-primary", theme.colors.primary);
  root.setProperty("--color-secondary", theme.colors.secondary);
  root.setProperty("--color-accent", theme.colors.accent);
  root.setProperty("--color-text", theme.colors.text);
  root.setProperty("--color-muted", theme.colors.muted);
  document.body.style.background = theme.gradient || document.body.style.background;
}

const penguinImg = new Image();
penguinImg.src = new URL("../assets/penguin.svg", import.meta.url).href;

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ui = document.getElementById("ui") as HTMLDivElement;
const ctx = canvas.getContext("2d")!;
const input = createHybridInput();
const overlay = document.createElement("div");
overlay.className = "launch-overlay";
overlay.style.display = "none";
ui.appendChild(overlay);

const controls = {
  action: config?.input.keys.swing || "Space",
  restart: config?.input.keys.restart || "KeyR",
};

const mobileControls = createMobileControlManager({
  gameId: GAME_ID,
  container: document.body,
  input,
  touch: {
    mapping: {
      actionA: controls.action,
      actionALabel: "Frapper",
    },
    showPad: false,
    gestureEnabled: false,
  },
  motion: {
    input,
    actions: [{ code: controls.action, trigger: "shake" }],
  },
  hints: {
    touch: "Tactile : bouton Frapper.",
    motion: "Gyro : secoue pour frapper.",
  },
});

type Phase = "angle" | "power" | "flight" | "end";
type GroundObject = { x: number; type: "mine" | "trap"; triggered: boolean };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const params = config?.difficultyParams ?? {};
const minAngle = params.minAngle ?? 20;
const maxAngle = params.maxAngle ?? 68;

const state = {
  phase: "angle" as Phase,
  running: false,
  width: 0,
  height: 0,
  groundY: 0,
  startX: 120,
  cameraX: 0,
  angle: lerp(minAngle, maxAngle, 0.5),
  power: 0.5,
  angleTimer: 0,
  powerTimer: 0,
  distance: 0,
  best: storedBest,
  wind: 0,
  penguin: { x: 0, y: 0, vx: 0, vy: 0, rotation: 0 },
  objects: [] as GroundObject[],
  nextSpawnX: 0,
  particles: [] as Particle[],
  actionHeld: false,
  lastBoost: 0,
};

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  state.width = rect.width;
  state.height = rect.height;
  state.groundY = state.height * 0.72;
}
resize();
window.addEventListener("resize", resize);

const loop = createGameLoop({
  update: (dt) => update(dt),
  render,
  fps: 60,
});

function getObstacleSpacing() {
  const fallbackLength = params.courseLength ?? 4200;
  const fallbackCount = Math.max(6, Math.floor((params.mineCount ?? 6) + (params.trapCount ?? 4)));
  const baseSpacing = fallbackLength / fallbackCount;
  const spacingMin = Math.max(140, params.obstacleSpacingMin ?? baseSpacing * 0.55);
  const spacingMax = Math.max(spacingMin + 80, params.obstacleSpacingMax ?? baseSpacing * 1.4);
  return { spacingMin, spacingMax };
}

function getMineChance() {
  const mineWeight = Math.max(1, Math.floor(params.mineCount ?? 6));
  const trapWeight = Math.max(1, Math.floor(params.trapCount ?? 4));
  return mineWeight / (mineWeight + trapWeight);
}

function spawnObjectsUpTo(targetX: number) {
  const { spacingMin, spacingMax } = getObstacleSpacing();
  const mineChance = getMineChance();
  while (state.nextSpawnX < targetX) {
    state.nextSpawnX += rand(spacingMin, spacingMax);
    state.objects.push({
      x: state.nextSpawnX,
      type: chance(mineChance) ? "mine" : "trap",
      triggered: false,
    });
  }
}

function cleanupObjects() {
  const cleanupX = state.cameraX - state.width * 0.8;
  state.objects = state.objects.filter((obj) => obj.x >= cleanupX);
}

function maintainObjectsAhead() {
  const spawnAhead = params.spawnAheadDistance ?? Math.max(1000, state.width * 2);
  spawnObjectsUpTo(state.penguin.x + spawnAhead);
  cleanupObjects();
}

function resetRun() {
  state.phase = "angle";
  state.angleTimer = 0;
  state.powerTimer = 0;
  state.angle = lerp(minAngle, maxAngle, 0.5);
  state.power = 0.5;
  state.distance = 0;
  state.cameraX = 0;
  state.penguin.x = state.startX;
  state.penguin.y = state.groundY - 12;
  state.penguin.vx = 0;
  state.penguin.vy = 0;
  state.penguin.rotation = 0;
  state.wind = rand(-(params.windMax ?? 42), params.windMax ?? 42);
  state.objects = [];
  state.nextSpawnX = state.startX;
  maintainObjectsAhead();
  state.particles = [];
  state.lastBoost = 0;
  state.actionHeld = false;
}

function startGame() {
  if (!config) {
    showOverlay("Config à compléter", "Ajoute configs/games/yeti.config.json", false);
    return;
  }
  resetRun();
  mobileControls.show();
  overlay.style.display = "none";
  state.running = true;
  state.phase = "angle";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean, message?: string) {
  state.running = false;
  state.phase = "end";
  loop.stop();
  mobileControls.hide();
  const score = Math.floor(state.distance);
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score } });
  if (config) {
    updateGameState(GAME_ID, config.saveSchemaVersion, (game) => {
      const best = (game.state.bestDistance as number | undefined) || 0;
      if (state.distance > best) {
        game.state.bestDistance = score;
        game.bestScore = score;
      }
    });
  }
  state.best = Math.max(state.best, score);
  const body = message ?? config?.uiText.help ?? "";
  showOverlay(win ? "Vol record !" : "Fin du vol", `${body}<br/><strong>${score} m</strong> atteints.`);
}

function showOverlay(title: string, body: string, showStart = true) {
  mobileControls.hide();
  overlay.style.display = "grid";
  const shortDescription = config?.uiText.shortDescription || "";
  const description = body || config?.uiText.help || "";
  const controlsList = (config?.uiText.controls || [])
    .map((item) => `<span class="launch-chip">${item}</span>`)
    .join("");
  const winDistance = config?.difficultyParams.winDistance ?? 1000;
  const mineCount = config?.difficultyParams.mineCount ?? 7;
  const trapCount = config?.difficultyParams.trapCount ?? 5;
  const settingsMarkup = `
    <div class="launch-rows">
      <div class="launch-row">
        <span class="launch-row-label">Mode</span>
        <div class="launch-row-value">
          <span class="launch-chip">Standard</span>
        </div>
      </div>
      <div class="launch-row">
        <span class="launch-row-label">Objectif</span>
        <div class="launch-row-value">
          <span class="launch-chip">${winDistance} m</span>
        </div>
      </div>
      <div class="launch-row">
        <span class="launch-row-label">Terrain</span>
        <div class="launch-row-value">
          <span class="launch-chip">Mines ${mineCount}</span>
          <span class="launch-chip muted">Pièges ${trapCount}</span>
        </div>
      </div>
    </div>
  `;
  overlay.innerHTML = `
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${config?.uiText.title || "Yeti Launch"}</span>
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

showOverlay(
  config?.uiText.title || "Lance le pingouin",
  config?.uiText.help ||
    "Appuie sur Espace pour figer l'angle, puis une seconde fois pour verrouiller la puissance. Les mines relancent ton vol, évite les pieux.",
);

function spawnParticles(x: number, y: number, color: string, amount: number, speed: number) {
  for (let i = 0; i < amount; i++) {
    const angle = rand(-Math.PI / 2 - 0.8, -Math.PI / 2 + 0.8);
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * rand(speed * 0.5, speed),
      vy: Math.sin(angle) * rand(speed * 0.5, speed),
      life: rand(0.4, 0.9),
      color,
    });
  }
}

function applyMine(obj: GroundObject) {
  const lift = params.mineLift ?? 1200;
  const boost = params.mineBoost ?? 260;
  state.penguin.vy = -lift * rand(0.92, 1.1);
  state.penguin.vx += boost * rand(0.85, 1.2);
  state.lastBoost = 0.5;
  spawnParticles(obj.x, state.groundY - 4, "rgba(255,255,255,0.9)", 24, 520);
  emitEvent({ type: "MINE_BOOST", gameId: GAME_ID });
}

function applyTrap(obj: GroundObject) {
  spawnParticles(obj.x, state.groundY - 8, "rgba(255,116,116,0.9)", 16, 360);
  state.penguin.vx = 0;
  state.penguin.vy = 0;
  state.penguin.rotation = 0;
  endGame(false, "Le pingouin est stoppé net par un piège !");
}

function checkGroundObjects(prevX: number, currentX: number) {
  const minX = Math.min(prevX, currentX) - 26;
  const maxX = Math.max(prevX, currentX) + 26;
  for (const obj of state.objects) {
    if (obj.triggered) continue;
    if (obj.x >= minX && obj.x <= maxX) {
      obj.triggered = true;
      if (obj.type === "mine") {
        applyMine(obj);
      } else {
        applyTrap(obj);
      }
      return;
    }
  }
}

function update(dt: number) {
  if (!config || state.phase === "end") return;

  const wantsRestart = input.isDown(controls.restart);
  if (wantsRestart && !state.running) {
    startGame();
    return;
  }

  const actionPressed = input.isDown(controls.action);
  const justPressed = actionPressed && !state.actionHeld;
  state.actionHeld = actionPressed;

  if (!state.running) return;

  if (state.phase === "angle") {
    state.angleTimer += dt * (params.aimSpeed ?? 2.4);
    const t = (Math.sin(state.angleTimer) + 1) / 2;
    state.angle = lerp(minAngle, maxAngle, t);
    if (justPressed) {
      state.phase = "power";
      state.powerTimer = 0;
    }
  } else if (state.phase === "power") {
    state.powerTimer += dt * (params.powerSpeed ?? 3.1);
    state.power = (Math.sin(state.powerTimer) + 1) / 2;
    if (justPressed) launch();
  } else if (state.phase === "flight") {
    updateFlight(dt);
    if (justPressed && state.penguin.y >= state.groundY - 40 && state.penguin.vy > -60) {
      // Petit coup de patte pour prolonger un slide.
      state.penguin.vy = -220;
      state.penguin.vx += 40;
    }
  }

  if (state.lastBoost > 0) {
    state.lastBoost = Math.max(0, state.lastBoost - dt);
  }
}

function launch() {
  const basePower = params.basePower ?? 900;
  const angleRad = (state.angle * Math.PI) / 180;
  const speed = basePower * (0.45 + state.power * 0.75);
  state.penguin.vx = Math.cos(angleRad) * speed + state.wind * 0.8;
  state.penguin.vy = -Math.sin(angleRad) * speed;
  state.phase = "flight";
}

function updateFlight(dt: number) {
  const gravity = params.gravity ?? 1700;
  const airDrag = params.airDrag ?? 60;
  const groundDrag = params.groundDrag ?? 220;
  const prevX = state.penguin.x;
  state.penguin.vy += gravity * dt;
  const drag = Math.sign(state.penguin.vx) * airDrag * dt;
  state.penguin.vx = Math.sign(state.penguin.vx) * Math.max(0, Math.abs(state.penguin.vx) - Math.abs(drag));
  state.penguin.vx += (state.wind / 8) * dt;
  state.penguin.vx = Math.max(0, state.penguin.vx);

  state.penguin.x += state.penguin.vx * dt;
  state.penguin.y += state.penguin.vy * dt;

  maintainObjectsAhead();

  let onGround = false;
  if (state.penguin.y >= state.groundY) {
    state.penguin.y = state.groundY;
    onGround = true;
    const impact = Math.abs(state.penguin.vy);
    if (impact > 240) {
      state.penguin.vy = -impact * (params.bounceFactor ?? 0.58);
      state.penguin.vx *= 0.98;
      spawnParticles(state.penguin.x, state.groundY - 2, "rgba(255,255,255,0.8)", 10, 280);
    } else {
      state.penguin.vy = 0;
      state.penguin.vx = Math.max(0, state.penguin.vx - groundDrag * dt);
    }
    checkGroundObjects(prevX, state.penguin.x);
    if (!state.running) return;
  }

  state.distance = Math.max(0, state.penguin.x - state.startX);
  state.cameraX = Math.max(0, state.penguin.x - state.width * 0.35);
  state.penguin.rotation = Math.atan2(state.penguin.vy, state.penguin.vx);

  const windFriction = state.phase === "flight" ? 0.01 : 0;
  state.wind = clamp(state.wind + rand(-1, 1) * windFriction, -(params.windMax ?? 42), params.windMax ?? 42);

  const stopped =
    onGround && state.lastBoost <= 0.05 && Math.abs(state.penguin.vx) < 12 && Math.abs(state.penguin.vy) < 10;
  if (stopped) {
    const winDistance = params.winDistance ?? 900;
    endGame(state.distance >= winDistance);
  }

  state.particles = state.particles
    .map((p) => ({ ...p, life: p.life - dt, x: p.x + p.vx * dt, y: p.y + p.vy * dt + 18 * dt }))
    .filter((p) => p.life > 0.05);
}

function drawSky() {
  const gradient = ctx.createLinearGradient(0, 0, 0, state.height);
  gradient.addColorStop(0, "rgba(108, 190, 255, 0.4)");
  gradient.addColorStop(0.5, "rgba(23, 49, 87, 0.6)");
  gradient.addColorStop(1, "rgba(8, 18, 33, 1)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.save();
  ctx.translate(-state.cameraX * 0.15, 0);
  const ridgeY = state.height * 0.42;
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.moveTo(-200, ridgeY + 20);
  for (let i = 0; i < 6; i++) {
    const x = i * 240 + 60;
    ctx.lineTo(x, ridgeY + rand(-40, 30));
  }
  ctx.lineTo(state.width + 400, ridgeY + 60);
  ctx.lineTo(state.width + 400, state.height);
  ctx.lineTo(-200, state.height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawGround() {
  ctx.save();
  ctx.translate(-state.cameraX, 0);
  ctx.fillStyle = "rgba(15, 32, 50, 0.9)";
  const viewLeft = state.cameraX - 400;
  const viewRight = state.cameraX + state.width + 400;
  ctx.fillRect(viewLeft, state.groundY, viewRight - viewLeft, state.height - state.groundY);

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const stripeSpacing = 140;
  const stripeWidth = 80;
  const startX = Math.floor(viewLeft / stripeSpacing) * stripeSpacing;
  for (let x = startX; x < viewRight; x += stripeSpacing) {
    ctx.fillRect(x, state.groundY - 6, stripeWidth, 2);
  }
  ctx.restore();
}

function drawObjects() {
  ctx.save();
  ctx.translate(-state.cameraX, 0);
  for (const obj of state.objects) {
    if (obj.type === "mine") {
      ctx.fillStyle = obj.triggered ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(obj.x, state.groundY - 6, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(91, 179, 255, 0.9)";
      ctx.fillRect(obj.x - 10, state.groundY - 20, 20, 8);
    } else {
      ctx.fillStyle = "rgba(255,116,116,0.9)";
      ctx.beginPath();
      ctx.moveTo(obj.x - 10, state.groundY);
      ctx.lineTo(obj.x, state.groundY - 30);
      ctx.lineTo(obj.x + 10, state.groundY);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawYeti() {
  ctx.save();
  ctx.translate(-state.cameraX, 0);
  const x = state.startX - 48;
  const y = state.groundY - 46;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.roundRect(x - 12, y, 52, 58, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(x + 12, y + 10, 18, 10);
  ctx.strokeStyle = theme?.colors?.accent || "#4dddbb";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 6, y + 10);
  ctx.lineTo(x + 40, y - 18);
  ctx.stroke();
  ctx.restore();
}

function drawPenguin() {
  ctx.save();
  ctx.translate(-state.cameraX + state.penguin.x, state.penguin.y);
  ctx.rotate(state.penguin.rotation);
  const size = 56;
  if (penguinImg.complete) {
    ctx.drawImage(penguinImg, -size / 2, -size / 2, size, size);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawParticles() {
  ctx.save();
  ctx.translate(-state.cameraX, 0);
  for (const p of state.particles) {
    ctx.globalAlpha = clamp(p.life, 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
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
  drawSky();
  drawGround();
  drawObjects();
  drawYeti();
  drawPenguin();
  drawParticles();
  ctx.restore();
  renderHUD();
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hud = document.createElement("div");
  hud.className = "hud";
  const status =
    state.phase === "angle"
      ? "Choisis l'angle"
      : state.phase === "power"
        ? "Charge la frappe"
        : state.phase === "flight"
          ? "En vol"
          : "Pause";

  const angleProgress = clamp((state.angle - minAngle) / (maxAngle - minAngle), 0, 1) * 100;
  const powerProgress = clamp(state.power, 0, 1) * 100;

  hud.innerHTML = `
    <div class="pill">Distance ${Math.floor(state.distance)} m</div>
    <div class="pill">Record ${Math.floor(state.best)} m</div>
    <div class="pill">Vent ${state.wind.toFixed(0)} km/h</div>
    <div class="pill">${status}</div>
    <div class="meters">
      <div class="meter">
        <div class="label">Angle</div>
        <div class="bar"><span style="width:${angleProgress}%"></span></div>
        <small>${state.angle.toFixed(0)}°</small>
      </div>
      <div class="meter">
        <div class="label">Puissance</div>
        <div class="bar"><span style="width:${powerProgress}%"></span></div>
        <small>${Math.round(powerProgress)}%</small>
      </div>
    </div>
  `;

  ui.appendChild(hud);
}
