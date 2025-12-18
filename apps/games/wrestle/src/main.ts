import "./style.css";
import Matter from "matter-js";
import { clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "wrestle";
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
const overlay = document.createElement("div");
overlay.className = "overlay";
overlay.style.display = "none";
ui.appendChild(overlay);

const playerAImg = new Image();
playerAImg.src = new URL("../assets/playerA.svg", import.meta.url).href;
const playerBImg = new Image();
playerBImg.src = new URL("../assets/playerB.svg", import.meta.url).href;

const {
  Engine,
  World,
  Bodies,
  Body,
  Constraint,
  Composite,
  Runner,
  Events,
  Vector,
} = Matter;

const engine = Engine.create({ gravity: { x: 0, y: config?.difficultyParams.gravity ?? 1.1 } });
const runner = Runner.create();

type Fighter = {
  body: Matter.Body;
  head: Matter.Body;
  hand: Matter.Body;
  color: string;
  label: string;
  img: HTMLImageElement;
};

const state = {
  running: false,
  width: 0,
  height: 0,
  fighters: [] as Fighter[],
  rope: null as Matter.Constraint | null,
  round: 1,
  winner: "",
  decor: [] as { x: number; y: number; r: number; alpha: number }[],
  spotlights: [] as { x: number; y: number; w: number; h: number; alpha: number }[],
  grounded: new Map<string, number>(),
};

const keys = {
  p1: config?.input.keys.p1Jump || "KeyW",
  p2: config?.input.keys.p2Jump || "ArrowUp",
};

const pressed = new Set<string>();
window.addEventListener("keydown", (e) => pressed.add(e.code));
window.addEventListener("keyup", (e) => pressed.delete(e.code));

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  state.width = canvas.width / devicePixelRatio;
  state.height = canvas.height / devicePixelRatio;
}
resize();
window.addEventListener("resize", resize);

function createFighter(x: number, label: string, img: HTMLImageElement, color: string): Fighter {
  const body = Bodies.rectangle(x, state.height * 0.45, 50, 70, {
    friction: 0.8,
    restitution: 0.02,
    frictionAir: 0.015,
    density: 0.002,
    label: `${label}-body`,
  });
  const head = Bodies.circle(x, state.height * 0.35, 16, {
    friction: 0.2,
    restitution: 0.1,
    frictionAir: 0.02,
    density: 0.001,
    label: `${label}-head`,
  });
  const hand = Bodies.circle(x + rand(-10, 10), state.height * 0.48, 10, {
    friction: 0.3,
    restitution: 0.05,
    frictionAir: 0.02,
    density: 0.001,
    label: `${label}-hand`,
  });

  const neck = Constraint.create({
    bodyA: body,
    pointA: { x: 0, y: -36 },
    bodyB: head,
    pointB: { x: 0, y: 10 },
    stiffness: 0.8,
    length: 10,
  });

  const arm = Constraint.create({
    bodyA: body,
    pointA: { x: 26, y: -6 },
    bodyB: hand,
    pointB: { x: 0, y: 0 },
    stiffness: 0.8,
    length: 10,
  });

  Composite.add(engine.world, [body, head, hand, neck, arm]);
  return { body, head, hand, color, label, img };
}

function buildWorld() {
  World.clear(engine.world, false);
  state.grounded.clear();
  const ground = Bodies.rectangle(state.width / 2, state.height - 20, state.width, 40, {
    isStatic: true,
    label: "ground",
    friction: 0.9,
  });
  const walls = [
    Bodies.rectangle(-30, state.height / 2, 60, state.height, { isStatic: true, label: "wall" }),
    Bodies.rectangle(state.width + 30, state.height / 2, 60, state.height, {
      isStatic: true,
      label: "wall",
    }),
    Bodies.rectangle(state.width / 2, -40, state.width, 80, {
      isStatic: true,
      label: "ceiling",
      restitution: 0,
    }),
  ];
  World.add(engine.world, [ground, ...walls]);

  const f1 = createFighter(state.width * 0.45, "p1", playerAImg, theme.colors.primary);
  const f2 = createFighter(state.width * 0.55, "p2", playerBImg, theme.colors.secondary);
  const rope = Constraint.create({
    bodyA: f1.hand,
    bodyB: f2.hand,
    stiffness: config?.difficultyParams.ropeStiffness ?? 0.6,
    length: 40,
    damping: 0.05,
    label: "rope",
  });
  Composite.add(engine.world, [rope]);
  state.fighters = [f1, f2];
  state.rope = rope;

  // décor aléatoire
  state.decor = Array.from({ length: 8 }, () => ({
    x: rand(state.width * 0.18, state.width * 0.82),
    y: rand(state.height * 0.25, state.height * 0.6),
    r: rand(30, 80),
    alpha: rand(0.08, 0.2),
  }));
  state.spotlights = Array.from({ length: 6 }, () => ({
    x: rand(state.width * 0.18, state.width * 0.82),
    y: rand(state.height * 0.18, state.height * 0.3),
    w: rand(4, 8),
    h: rand(80, 140),
    alpha: rand(0.08, 0.14),
  }));
}

function jump(fighter: Fighter) {
  if (!isGrounded(fighter)) return;
  const jumpForce = config?.difficultyParams.jumpForce ?? 0.08;
  const boostForce = config?.difficultyParams.boostForce ?? 0.12;
  const forceY = jumpForce + (fighter.head.position.y > fighter.body.position.y ? boostForce : 0);
  const cappedForce = clamp(forceY, 0, 0.12);
  Body.applyForce(fighter.body, fighter.body.position, { x: rand(-0.005, 0.005), y: -cappedForce });
  Body.applyForce(fighter.head, fighter.head.position, { x: 0, y: -cappedForce * 0.6 });
  Body.applyForce(fighter.hand, fighter.hand.position, { x: 0, y: -cappedForce * 0.4 });
}

function handleInput() {
  if (pressed.has(keys.p1)) jump(state.fighters[0]);
  if (pressed.has(keys.p2)) jump(state.fighters[1]);
}

function detectHeadHit() {
  Events.on(engine, "collisionStart", (evt) => {
    evt.pairs.forEach((pair) => {
      const labels = [pair.bodyA.label, pair.bodyB.label];
      trackGrounded(pair.bodyA, pair.bodyB, true);
      trackGrounded(pair.bodyB, pair.bodyA, true);
      const isGround = labels.includes("ground");
      if (!isGround) return;
      const head = pair.bodyA.label.includes("head") ? pair.bodyA : pair.bodyB.label.includes("head") ? pair.bodyB : null;
      if (!head) return;
      const loser = head.label.startsWith("p1") ? "P1" : "P2";
      const winner = loser === "P1" ? "P2" : "P1";
      if (!state.running) return;
      emitEvent({ type: "HEAD_HIT", gameId: GAME_ID, payload: { loser } });
      endGame(winner);
    });
  });
  Events.on(engine, "collisionEnd", (evt) => {
    evt.pairs.forEach((pair) => {
      trackGrounded(pair.bodyA, pair.bodyB, false);
      trackGrounded(pair.bodyB, pair.bodyA, false);
    });
  });
}

function startGame() {
  if (!config) {
    showOverlay("Config à compléter", "Crée configs/games/wrestle.config.json", false);
    return;
  }
  state.running = true;
  state.round += 1;
  state.winner = "";
  overlay.style.display = "none";
  buildWorld();
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  Runner.run(runner, engine);
}

function endGame(winnerLabel: string) {
  state.running = false;
  state.winner = winnerLabel;
  Runner.stop(runner);
  emitEvent({ type: "SESSION_WIN", gameId: GAME_ID, payload: { winner: winnerLabel } });
  emitEvent({ type: "SESSION_FAIL", gameId: GAME_ID, payload: { loser: winnerLabel === "P1" ? "P2" : "P1" } });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const best = (game.state.wins as number | undefined) || 0;
    game.state.wins = best + 1;
    game.bestScore = best + 1;
  });
  showOverlay(`${winnerLabel} gagne !`, config?.uiText.help || "Relance pour un nouveau round.");
}

function render() {
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);

  // Ring
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(state.width * 0.1, state.height * 0.2, state.width * 0.8, state.height * 0.7);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 3;
  ctx.strokeRect(state.width * 0.1, state.height * 0.2, state.width * 0.8, state.height * 0.7);

  state.decor.forEach((d) => {
    const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
    grad.addColorStop(0, `rgba(255,255,255,${d.alpha})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  });
  state.spotlights.forEach((s) => {
    const grd = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.h);
    grd.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
    grd.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(s.x - s.w / 2, s.y, s.w, s.h);
  });

  const drawFighter = (f: Fighter) => {
    drawBody(f.body, f.img, f.color);
    drawCircle(f.head, theme.colors.accent);
    drawCircle(f.hand, theme.colors.secondary);
  };

  state.fighters.forEach(drawFighter);
  if (state.rope) {
    ctx.strokeStyle = theme.colors.muted;
    ctx.lineWidth = 3;
    ctx.beginPath();
    const a = state.rope.bodyA!.position;
    const b = state.rope.bodyB!.position;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
  renderHUD();
  if (state.running) {
    clampFightersInRing();
    handleInput();
    requestAnimationFrame(render);
  }
}

function drawBody(body: Matter.Body, img: HTMLImageElement, fallback: string) {
  const w = 60;
  const h = 90;
  ctx.save();
  ctx.translate(body.position.x, body.position.y);
  ctx.rotate(body.angle);
  if (img.complete) {
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    ctx.fillStyle = fallback;
    ctx.fillRect(-w / 2, -h / 2, w, h);
  }
  ctx.restore();
}

function drawCircle(body: Matter.Body, color: string) {
  ctx.save();
  ctx.translate(body.position.x, body.position.y);
  ctx.rotate(body.angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, body.circleRadius || 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hud = document.createElement("div");
  hud.className = "hud";
  hud.innerHTML = `
    <div class="pill">Round ${state.round}</div>
    <div class="pill">Contrôles : P1 (W) · P2 (Flèche Haut)</div>
    <div class="pill">Tête au sol = point</div>
  `;
  ui.appendChild(hud);
}

function showOverlay(title: string, body: string, showStart = true) {
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Rope Wrestle</p>
      <h2>${title}</h2>
      <p>${body}</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:12px;">
        ${showStart ? `<button class="btn" id="play-btn">Lancer</button>` : ""}
        <a class="btn secondary" href="${withBasePath("/apps/hub/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
      <p class="legend">Les catcheurs sont liés par les mains. Saute pour donner l'élan et faire toucher la tête adverse.</p>
    </div>
  `;
  const play = document.getElementById("play-btn");
  play?.addEventListener("click", () => {
    startGame();
    render();
  });
}

detectHeadHit();
showOverlay(config?.uiText.title || "Rope Wrestle", config?.uiText.help || "");

function isFighterPart(body: Matter.Body) {
  return body.label.startsWith("p1") || body.label.startsWith("p2");
}

function trackGrounded(a: Matter.Body, b: Matter.Body, entering: boolean) {
  if (!isFighterPart(a) || b.label !== "ground") return;
  const key = a.label.slice(0, 2); // p1 or p2
  const current = state.grounded.get(key) || 0;
  state.grounded.set(key, entering ? current + 1 : Math.max(0, current - 1));
}

function isGrounded(fighter: Fighter) {
  const key = fighter.label.slice(0, 2);
  const groundedCount = state.grounded.get(key) || 0;
  return groundedCount > 0;
}

function clampFightersInRing() {
  const minX = state.width * 0.12;
  const maxX = state.width * 0.88;
  const minY = state.height * 0.18;
  const maxY = state.height - 30;
  state.fighters.forEach((f) => {
    [f.body, f.head, f.hand].forEach((part) => {
      const x = clamp(part.position.x, minX, maxX);
      const y = clamp(part.position.y, minY, maxY);
      if (x !== part.position.x || y !== part.position.y) {
        Body.setPosition(part, { x, y });
        Body.setVelocity(part, { x: 0, y: 0 });
      }
    });
  });
}
