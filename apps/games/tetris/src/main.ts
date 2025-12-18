import "./style.css";
import { createHybridInput, createMobileControls } from "@core/input";
import { createGameLoop } from "@core/loop";
import { clamp, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "tetris";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = config ? themes.find((t) => t.id === config.themeId) || themes[0] : themes[0];
attachProgressionListener();

const blockSprites = Array.from({ length: 8 }, (_, idx) => {
  if (idx === 0) return null;
  const img = new Image();
  img.src = new URL(`../assets/block${idx}.svg`, import.meta.url).href;
  return img;
});

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

type PieceShape = number[][];
type Piece = { matrix: PieceShape; x: number; y: number; id: number };

const shapes: PieceShape[] = [
  [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [4, 0, 0],
    [4, 4, 4],
    [0, 0, 0],
  ],
  [
    [0, 0, 5],
    [5, 5, 5],
    [0, 0, 0],
  ],
  [
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];

const state = {
  running: false,
  width: 0,
  height: 0,
  cell: 24,
  boardWidth: config?.difficultyParams.boardWidth ?? 10,
  boardHeight: config?.difficultyParams.boardHeight ?? 20,
  board: [] as number[][],
  current: null as Piece | null,
  next: null as Piece | null,
  dropTimer: 0,
  dropInterval: config?.difficultyParams.dropIntervalMs ?? 800,
  baseDropInterval: config?.difficultyParams.dropIntervalMs ?? 800,
  speedUpFactor: config?.difficultyParams.speedUpFactor ?? 0.92,
  lines: 0,
  level: 1,
  score: 0,
  targetLines: config?.difficultyParams.linesToWin ?? 24,
};

const keys = {
  left: config?.input.keys.left || "ArrowLeft",
  right: config?.input.keys.right || "ArrowRight",
  down: config?.input.keys.down || "ArrowDown",
  rotate: config?.input.keys.rotate || "ArrowUp",
  drop: config?.input.keys.drop || "Space",
};

const mobileControls = createMobileControls({
  container: document.body,
  input,
  mapping: {
    left: keys.left,
    right: keys.right,
    down: keys.down,
    up: keys.rotate,
    actionA: keys.rotate,
    actionALabel: "Rotate",
    actionB: keys.drop,
    actionBLabel: "Drop",
  },
  autoShow: false,
  showPad: false,
});

const keyLatch: Record<string, boolean> = {};

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  state.width = canvas.width / devicePixelRatio;
  state.height = canvas.height / devicePixelRatio;
  const maxCellByWidth = Math.floor(state.width / (state.boardWidth + 6));
  const maxCellByHeight = Math.floor(state.height / (state.boardHeight + 2));
  state.cell = clamp(Math.min(maxCellByWidth, maxCellByHeight), 18, 36);
}
resize();
window.addEventListener("resize", resize);

const loop = createGameLoop({
  update: (dt) => update(dt),
  render,
  fps: 60,
});

function blankBoard() {
  state.board = Array.from({ length: state.boardHeight }, () => Array(state.boardWidth).fill(0));
}

function randomPiece(): Piece {
  const id = Math.floor(Math.random() * shapes.length);
  return {
    matrix: shapes[id].map((row) => [...row]),
    x: Math.floor(state.boardWidth / 2) - 2,
    y: 0,
    id,
  };
}

function rotate(matrix: PieceShape): PieceShape {
  const size = matrix.length;
  const result = Array.from({ length: size }, () => Array(size).fill(0));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      result[x][size - 1 - y] = matrix[y][x];
    }
  }
  return result;
}

function collision(piece: Piece, offsetX: number, offsetY: number): boolean {
  const m = piece.matrix;
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (!m[y][x]) continue;
      const nx = piece.x + x + offsetX;
      const ny = piece.y + y + offsetY;
      if (nx < 0 || nx >= state.boardWidth || ny >= state.boardHeight) return true;
      if (ny >= 0 && state.board[ny][nx]) return true;
    }
  }
  return false;
}

function spawnPiece() {
  state.current = state.next ?? randomPiece();
  state.current.x = Math.floor(state.boardWidth / 2) - 2;
  state.current.y = -1;
  state.next = randomPiece();
  if (collision(state.current, 0, 0)) {
    endGame(false);
  }
}

function lockPiece() {
  if (!state.current) return;
  const m = state.current.matrix;
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (!m[y][x]) continue;
      const nx = state.current.x + x;
      const ny = state.current.y + y;
      if (ny >= 0 && ny < state.boardHeight && nx >= 0 && nx < state.boardWidth) {
        state.board[ny][nx] = m[y][x];
      }
    }
  }
}

function clearLines() {
  const cleared: number[] = [];
  for (let y = state.boardHeight - 1; y >= 0; y--) {
    if (state.board[y].every((cell) => cell !== 0)) {
      cleared.push(y);
    }
  }
  if (!cleared.length) return;
  cleared.forEach((row) => state.board.splice(row, 1));
  while (state.board.length < state.boardHeight) {
    state.board.unshift(Array(state.boardWidth).fill(0));
  }
  state.lines += cleared.length;
  const baseScores = [0, 100, 300, 500, 800];
  state.score += (baseScores[cleared.length] || 1000) * state.level;
  for (let i = 0; i < cleared.length; i++) {
    emitEvent({ type: "LINES_CLEARED", gameId: GAME_ID });
  }
  if (cleared.length === 4) {
    emitEvent({ type: "TETRIS_CLEAR", gameId: GAME_ID, payload: { lines: 4 } });
  }
  state.level = 1 + Math.floor(state.lines / 10);
  state.dropInterval = state.baseDropInterval * Math.pow(state.speedUpFactor, state.level - 1);
  if (state.lines >= state.targetLines) {
    endGame(true);
  }
}

function hardDrop() {
  if (!state.current) return;
  let distance = 0;
  while (!collision(state.current, 0, distance + 1)) {
    distance++;
  }
  state.current.y += distance;
  lockPiece();
  clearLines();
  spawnPiece();
}

function movePiece(dx: number) {
  if (!state.current || collision(state.current, dx, 0)) return;
  state.current.x += dx;
}

function rotatePiece() {
  if (!state.current) return;
  const rotated = rotate(state.current.matrix);
  const test: Array<[number, number]> = [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, -1],
  ];
  for (const [ox, oy] of test) {
    const clone = { ...state.current, matrix: rotated, x: state.current.x + ox, y: state.current.y + oy };
    if (!collision(clone, 0, 0)) {
      state.current.matrix = rotated;
      state.current.x = clone.x;
      state.current.y = clone.y;
      return;
    }
  }
}

function softDrop(dt: number) {
  state.dropTimer += dt * 1000 * 3;
}

function tickDrop(dt: number) {
  state.dropTimer += dt * 1000;
  if (state.dropTimer < state.dropInterval) return;
  state.dropTimer = 0;
  if (!state.current) return;
  if (!collision(state.current, 0, 1)) {
    state.current.y += 1;
  } else {
    lockPiece();
    clearLines();
    spawnPiece();
  }
}

function startGame() {
  if (!config) {
    showOverlay("Config à compléter", "Crée configs/games/tetris.config.json", false);
    return;
  }
  mobileControls.show();
  state.running = true;
  state.lines = 0;
  state.level = 1;
  state.score = 0;
  state.dropInterval = state.baseDropInterval;
  state.dropTimer = 0;
  state.current = null;
  state.next = randomPiece();
  blankBoard();
  spawnPiece();
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  mobileControls.hide();
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score: state.score, lines: state.lines } });
  if (config) {
    updateGameState(GAME_ID, config.saveSchemaVersion, (game) => {
      const best = (game.state.bestLines as number | undefined) || 0;
      if (state.lines > best) {
        game.state.bestLines = state.lines;
        game.bestScore = state.lines;
      }
    });
  }
  showOverlay(
    win ? "GG, objectif atteint !" : "Pile trop haute !",
    config?.uiText.help || "Rejoue pour battre ton record.",
  );
}

function handleInput(dt: number) {
  const left = input.isDown(keys.left);
  const right = input.isDown(keys.right);
  const rotateKey = input.isDown(keys.rotate);
  const dropKey = input.isDown(keys.drop);
  const downKey = input.isDown(keys.down);

  if (left && !keyLatch.left) movePiece(-1);
  if (right && !keyLatch.right) movePiece(1);
  if (rotateKey && !keyLatch.rotate) rotatePiece();
  if (dropKey && !keyLatch.drop) hardDrop();
  if (downKey) softDrop(dt);

  keyLatch.left = left;
  keyLatch.right = right;
  keyLatch.rotate = rotateKey;
  keyLatch.drop = dropKey;
}

function update(dt: number) {
  if (!state.running || !config) return;
  handleInput(dt);
  tickDrop(dt);
}

function render() {
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(0, 0, state.width, state.height);

  const gridOffsetX = (state.width - state.boardWidth * state.cell) / 2;
  const gridOffsetY = (state.height - state.boardHeight * state.cell) / 2;

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  for (let x = 0; x <= state.boardWidth; x++) {
    ctx.beginPath();
    ctx.moveTo(gridOffsetX + x * state.cell, gridOffsetY);
    ctx.lineTo(gridOffsetX + x * state.cell, gridOffsetY + state.boardHeight * state.cell);
    ctx.stroke();
  }
  for (let y = 0; y <= state.boardHeight; y++) {
    ctx.beginPath();
    ctx.moveTo(gridOffsetX, gridOffsetY + y * state.cell);
    ctx.lineTo(gridOffsetX + state.boardWidth * state.cell, gridOffsetY + y * state.cell);
    ctx.stroke();
  }

  for (let y = 0; y < state.boardHeight; y++) {
    for (let x = 0; x < state.boardWidth; x++) {
      const val = state.board[y][x];
      if (!val) continue;
      drawCell(x, y, val, gridOffsetX, gridOffsetY);
    }
  }

  if (state.current) {
    const m = state.current.matrix;
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (!m[y][x]) continue;
        const val = m[y][x];
        drawCell(state.current.x + x, state.current.y + y, val, gridOffsetX, gridOffsetY, true);
      }
    }
  }

  ctx.restore();
  renderHUD();
}

function drawCell(
  x: number,
  y: number,
  val: number,
  offsetX: number,
  offsetY: number,
  active = false,
) {
  const px = offsetX + x * state.cell;
  const py = offsetY + y * state.cell;
  const sprite = blockSprites[val];
  if (sprite?.complete) {
    ctx.drawImage(sprite, px + 1, py + 1, state.cell - 2, state.cell - 2);
  } else {
    ctx.fillStyle = theme.colors.primary;
    ctx.fillRect(px + 1, py + 1, state.cell - 2, state.cell - 2);
  }
  ctx.strokeStyle = active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)";
  ctx.strokeRect(px + 0.5, py + 0.5, state.cell - 1, state.cell - 1);
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hud = document.createElement("div");
  hud.className = "hud";
  hud.innerHTML = `
    <div class="pill">Lignes ${state.lines}/${state.targetLines}</div>
    <div class="pill">Niveau ${state.level}</div>
    <div class="pill">Score ${state.score}</div>
  `;
  ui.appendChild(hud);
}

function showOverlay(title: string, body: string, showStart = true) {
  mobileControls.hide();
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Tetris Mini</p>
      <h2>${title}</h2>
      <p>${body}</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:12px;">
        ${showStart ? `<button class="btn" id="play-btn">Lancer</button>` : ""}
        <a class="btn secondary" href="${withBasePath("/apps/hub/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
      <p class="legend">Contrôles : Gauche/Droite pour bouger · Haut pour rotate · Bas pour descendre · Espace pour drop instantané.</p>
    </div>
  `;
  const play = document.getElementById("play-btn");
  play?.addEventListener("click", startGame);
}

showOverlay(config?.uiText.title || "Tetris Mini", config?.uiText.help || "");
