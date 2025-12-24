import "./style.css";
import "@core/launch-menu.css";
import { emitEvent } from "@core/events";
import { withBasePath } from "@core/utils";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";
import scenarioDataRaw from "../../../../configs/games/rhlife.scenarios.json";

const GAME_ID = "rhlife";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = config ? themes.find((item) => item.id === config.themeId) || themes[0] : themes[0];
attachProgressionListener();

type GaugeConfig = {
  id: string;
  label: string;
  visible: boolean;
  initial: number;
  polarity: "positive" | "negative";
};

type DeferredConsequence = {
  delay: number;
  summary: string;
  event: string;
  effects: Record<string, number>;
};

type Choice = {
  id: string;
  label: string;
  immediateEffects: Record<string, number>;
  deferredConsequences: DeferredConsequence[];
  feedback: string;
  futureEvent: string;
  endingImpact: string;
};

type Scenario = {
  id: string;
  title: string;
  difficulty: number;
  context: {
    mail: string;
    meeting: string;
    rumor: string;
    incident: string;
    urgentRequest: string;
  };
  problem: string;
  choices: Choice[];
};

type Ending = {
  id: string;
  title: string;
  description: string;
  min?: Record<string, number>;
  max?: Record<string, number>;
};

type ScenarioData = {
  gauges: GaugeConfig[];
  scenarios: Scenario[];
  endings: Ending[];
};

type DeferredEvent = {
  applyAt: number;
  summary: string;
  event: string;
  effects: Record<string, number>;
  source: { scenarioId: string; choiceId: string };
};

type ChoiceResult = {
  scenarioId: string;
  choice: Choice;
  immediateEffects: Record<string, number>;
};

const scenarioData = scenarioDataRaw as ScenarioData;
const gauges = scenarioData.gauges;
const scenarios = scenarioData.scenarios;
const endings = scenarioData.endings;
const gaugeMap = new Map(gauges.map((gauge) => [gauge.id, gauge]));
const defaultGauge = config?.difficultyParams.startingGauge ?? 50;
const minGauge = config?.difficultyParams.minGauge ?? 0;
const maxGauge = config?.difficultyParams.maxGauge ?? 100;
const WIN_CHOICE_ID = "go-independent";
const WIN_ENDING_ID = "independent";

if (theme) {
  const root = document.documentElement.style;
  root.setProperty("--color-primary", theme.colors.primary);
  root.setProperty("--color-secondary", theme.colors.secondary);
  root.setProperty("--color-accent", theme.colors.accent);
  root.setProperty("--color-text", theme.colors.text);
  root.setProperty("--color-muted", theme.colors.muted);
  root.setProperty("--color-bg", theme.colors.background || "#0b101a");
  root.setProperty("--color-surface", theme.colors.surface || "rgba(255, 255, 255, 0.06)");
  document.body.style.background = theme.gradient || document.body.style.background;
}

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ui = document.getElementById("ui") as HTMLDivElement;
const shell = document.createElement("div");
shell.className = "rh-shell";
ui.appendChild(shell);

const overlay = document.createElement("div");
overlay.className = "launch-overlay";
overlay.style.display = "none";
ui.appendChild(overlay);

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const state = {
  index: 0,
  gauges: createInitialGauges(),
  pending: [] as DeferredEvent[],
  deferredNow: [] as DeferredEvent[],
  activeResult: null as ChoiceResult | null,
  runStarted: 0,
  wentSolo: false,
};

function createInitialGauges(): Record<string, number> {
  const entries = gauges.map((gauge) => [gauge.id, gauge.initial ?? defaultGauge]);
  return Object.fromEntries(entries);
}

function clampGauge(value: number) {
  return Math.min(maxGauge, Math.max(minGauge, Math.round(value)));
}

function applyEffects(effects: Record<string, number>) {
  Object.entries(effects).forEach(([id, delta]) => {
    const current = state.gauges[id] ?? defaultGauge;
    state.gauges[id] = clampGauge(current + delta);
  });
}

function scheduleDeferred(choice: Choice, scenarioId: string) {
  choice.deferredConsequences.forEach((entry) => {
    state.pending.push({
      applyAt: state.index + entry.delay,
      summary: entry.summary,
      event: entry.event,
      effects: entry.effects,
      source: { scenarioId, choiceId: choice.id },
    });
  });
}

function applyDeferred(atIndex: number) {
  const due = state.pending.filter((item) => item.applyAt === atIndex);
  state.pending = state.pending.filter((item) => item.applyAt !== atIndex);
  due.forEach((item) => applyEffects(item.effects));
  return due;
}

function flushDeferredAtEnd() {
  const due = state.pending.filter((item) => item.applyAt >= scenarios.length);
  state.pending = [];
  due.forEach((item) => applyEffects(item.effects));
  return due;
}

function computeScore() {
  const positives =
    (state.gauges.satisfaction || 0) +
    (state.gauges.performance || 0) +
    (state.gauges.legal || 0) +
    (state.gauges.reputation || 0);
  const negatives =
    (state.gauges.pressure || 0) +
    (state.gauges.burnout || 0) +
    (state.gauges.cynicism || 0) +
    (state.gauges.socialRisk || 0);
  const score = Math.round((positives + (400 - negatives)) / 8);
  return Math.max(0, Math.min(100, score));
}

function pickEnding(): Ending {
  if (state.wentSolo) {
    return endings.find((ending) => ending.id === WIN_ENDING_ID) || endings[endings.length - 1];
  }
  const match = endings.find((ending) => {
    if (ending.min) {
      for (const [id, min] of Object.entries(ending.min)) {
        if ((state.gauges[id] ?? defaultGauge) < min) return false;
      }
    }
    if (ending.max) {
      for (const [id, max] of Object.entries(ending.max)) {
        if ((state.gauges[id] ?? defaultGauge) > max) return false;
      }
    }
    return true;
  });
  return match || endings[endings.length - 1];
}

function startGame() {
  if (!config) {
    showOverlay("Config a completer", "Cree configs/games/rhlife.config.json", false);
    return;
  }
  overlay.style.display = "none";
  state.index = 0;
  state.gauges = createInitialGauges();
  state.pending = [];
  state.deferredNow = [];
  state.activeResult = null;
  state.runStarted = Date.now();
  state.wentSolo = false;
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  renderScenario();
}

function handleChoice(choiceIndex: number) {
  if (state.activeResult) return;
  const scenario = scenarios[state.index];
  const choice = scenario?.choices[choiceIndex];
  if (!choice) return;
  applyEffects(choice.immediateEffects);
  scheduleDeferred(choice, scenario.id);
  if (choice.id === WIN_CHOICE_ID) {
    state.wentSolo = true;
  }
  state.activeResult = {
    scenarioId: scenario.id,
    choice,
    immediateEffects: choice.immediateEffects,
  };
  emitEvent({
    type: "CHOICE_MADE",
    gameId: GAME_ID,
    payload: { scenarioId: scenario.id, choiceId: choice.id },
  });
  renderScenario();
}

function advanceScenario() {
  if (!state.activeResult) return;
  emitEvent({
    type: "SCENARIO_COMPLETE",
    gameId: GAME_ID,
    payload: { scenarioId: state.activeResult.scenarioId },
  });
  state.activeResult = null;
  const nextIndex = state.index + 1;
  if (nextIndex >= scenarios.length) {
    finishGame();
    return;
  }
  state.index = nextIndex;
  state.deferredNow = applyDeferred(state.index);
  renderScenario();
}

function finishGame() {
  const postEffects = flushDeferredAtEnd();
  const ending = pickEnding();
  const score = computeScore();
  emitEvent({
    type: "ENDING_REACHED",
    gameId: GAME_ID,
    payload: { endingId: ending.id, score },
  });
  emitEvent({
    type: ending.id === WIN_ENDING_ID ? "SESSION_WIN" : "SESSION_FAIL",
    gameId: GAME_ID,
    payload: { endingId: ending.id, score },
  });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const runs = (game.state.runs as number | undefined) || 0;
    game.state.runs = runs + 1;
    game.state.lastEndingId = ending.id;
    game.state.lastScore = score;
    if (!game.bestScore || score > game.bestScore) {
      game.bestScore = score;
      game.state.bestScore = score;
    }
  });
  showEndingOverlay(ending, score, postEffects);
}

function renderScenario() {
  const scenario = scenarios[state.index];
  if (!scenario) return;
  const visibleGauges = gauges.filter((gauge) => gauge.visible);
  const hiddenGauges = gauges.filter((gauge) => !gauge.visible);
  const deferredMarkup = renderDeferredNotices(state.deferredNow);
  const resultMarkup = state.activeResult ? renderResult(state.activeResult) : "";
  const choicesMarkup = state.activeResult
    ? ""
    : `
      <div class="rh-choices">
        ${scenario.choices
          .map(
            (choice, idx) =>
              `<button class="rh-choice" data-choice-index="${idx}"><span>${idx + 1}</span>${choice.label}</button>`,
          )
          .join("")}
      </div>
    `;

  shell.innerHTML = `
    <div class="rh-header">
      <div class="rh-title">${config?.uiText.title || "RHLife"}</div>
      <div class="rh-meta">
        <span>Scenario ${state.index + 1}/${scenarios.length}</span>
        <span>Difficulte ${scenario.difficulty}</span>
      </div>
      <div class="rh-tags">
        <span class="rh-tag">${scenario.title}</span>
      </div>
    </div>
    <div class="rh-grid">
      <section class="rh-panel">
        <h2>Jauges visibles</h2>
        ${visibleGauges.map(renderGauge).join("")}
        <h2>Indicateurs internes</h2>
        ${hiddenGauges.map(renderGauge).join("")}
      </section>
      <section class="rh-panel">
        ${deferredMarkup}
        <h2>Contexte narratif</h2>
        <div class="rh-context">
          ${renderContextItem("Mail", scenario.context.mail)}
          ${renderContextItem("Reunion", scenario.context.meeting)}
          ${renderContextItem("Rumeur", scenario.context.rumor)}
          ${renderContextItem("Incident", scenario.context.incident)}
          ${renderContextItem("Urgent", scenario.context.urgentRequest)}
        </div>
        <h2>Situation problematique</h2>
        <div class="rh-problem">${scenario.problem}</div>
        ${resultMarkup}
        ${choicesMarkup}
      </section>
    </div>
  `;
}

function renderGauge(gauge: GaugeConfig) {
  const value = state.gauges[gauge.id] ?? defaultGauge;
  const percent = Math.min(100, Math.max(0, value));
  const tone = gauge.polarity === "negative" ? "is-negative" : "is-positive";
  return `
    <div class="rh-gauge ${tone}">
      <div class="rh-gauge-head">
        <span class="rh-gauge-label">${gauge.label}</span>
        <strong class="rh-gauge-value">${value}</strong>
      </div>
      <div class="rh-gauge-bar"><span style="width: ${percent}%"></span></div>
    </div>
  `;
}

function renderContextItem(label: string, value: string) {
  return `
    <div class="rh-context-item">
      <span>${label}</span>
      <div>${value}</div>
    </div>
  `;
}

function renderDeferredNotices(events: DeferredEvent[]) {
  if (!events.length) return "";
  return `
    <div class="rh-deferred">
      <h4>Consequences differees</h4>
      ${events
        .map(
          (event) => `<p>${event.summary} (${event.event})</p>`,
        )
        .join("")}
    </div>
  `;
}

function renderResult(result: ChoiceResult) {
  const effectsMarkup = Object.entries(result.immediateEffects)
    .map(([id, delta]) => {
      const gauge = gaugeMap.get(id);
      if (!gauge) return "";
      const sign = delta > 0 ? "+" : "";
      const tone = delta >= 0 ? "pos" : "neg";
      return `
        <div class="rh-effect">
          <strong>${gauge.label}</strong>
          <span class="${tone}">${sign}${delta}</span>
        </div>
      `;
    })
    .join("");

  const deferredMarkup = result.choice.deferredConsequences.length
    ? result.choice.deferredConsequences
        .map(
          (entry) =>
            `<div class="rh-effect"><strong>Dans ${entry.delay} scenario(s)</strong><span>${entry.summary}</span></div>`,
        )
        .join("")
    : "<div class=\"rh-effect\"><span>Aucun signal differe identifie.</span></div>";

  return `
    <div class="rh-result">
      <div class="rh-result-title">Decision actee</div>
      <p class="rh-result-choice">${result.choice.label}</p>
      <div class="rh-result-block">
        <h4>Feedback corporate</h4>
        <p>${result.choice.feedback}</p>
      </div>
      <div class="rh-result-block">
        <h4>Effets immediats</h4>
        <div class="rh-effects">${effectsMarkup}</div>
      </div>
      <div class="rh-result-block">
        <h4>Consequences differees possibles</h4>
        <div class="rh-effects">${deferredMarkup}</div>
      </div>
      <div class="rh-result-meta">
        <div>
          <span>Evenement futur declenchable</span>
          <p>${result.choice.futureEvent}</p>
        </div>
        <div>
          <span>Impact potentiel sur la fin du jeu</span>
          <p>${result.choice.endingImpact}</p>
        </div>
      </div>
      <button class="rh-btn" data-action="continue">Continuer</button>
    </div>
  `;
}

function showOverlay(title: string, body: string, showStart = true) {
  overlay.style.display = "grid";
  const shortDescription = config?.uiText.shortDescription || "";
  const description = body || config?.uiText.help || "";
  const controlsList = (config?.uiText.controls || [])
    .map((item) => `<span class=\"launch-chip\">${item}</span>`)
    .join("");

  overlay.innerHTML = `
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${config?.uiText.title || "RHLife"}</span>
        </div>
        <h2 class="launch-title">${title}</h2>
        ${shortDescription ? `<p class=\"launch-subtitle\">${shortDescription}</p>` : ""}
      </div>
      <div class="launch-grid">
        <section class="launch-section">
          <h3 class="launch-section-title">Briefing</h3>
          <p class="launch-text">${description}</p>
          <p class="launch-note">Chaque choix deplace des jauges visibles et internes. Rien n'est neutre.</p>
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Indicateurs</h3>
          <div class="launch-metrics">
            ${gauges
              .map(
                (gauge) =>
                  `<div class=\"launch-metric\"><span>${gauge.label}</span><strong>${state.gauges[gauge.id]}</strong></div>`,
              )
              .join("")}
          </div>
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Controles</h3>
          <div class="launch-chips">
            ${controlsList || `<span class=\"launch-chip muted\">Controles a definir</span>`}
          </div>
        </section>
      </div>
      <div class="launch-actions">
        ${showStart ? `<button class=\"launch-btn primary\" id=\"launch-start\">Lancer</button>` : ""}
        <a class="launch-btn ghost" href="${withBasePath("/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
    </div>
  `;

  const play = document.getElementById("launch-start");
  play?.addEventListener("click", startGame);
}

function showEndingOverlay(ending: Ending, score: number, postEffects: DeferredEvent[]) {
  overlay.style.display = "grid";
  const consequenceMarkup = postEffects.length
    ? postEffects.map((event) => `<p class=\"launch-note\">${event.summary} (${event.event})</p>`).join("")
    : "<p class=\"launch-note\">Aucune onde de choc supplementaire detectee.</p>";

  overlay.innerHTML = `
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Fin atteinte</span>
          <span class="launch-badge ghost">${ending.title}</span>
        </div>
        <h2 class="launch-title">${ending.title}</h2>
        <p class="launch-subtitle">${ending.description}</p>
      </div>
      <div class="launch-grid">
        <section class="launch-section">
          <h3 class="launch-section-title">Bilan</h3>
          <p class="launch-text">Score de carriere: ${score}</p>
          ${consequenceMarkup}
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Jauges finales</h3>
          <div class="launch-metrics">
            ${gauges
              .map(
                (gauge) =>
                  `<div class=\"launch-metric\"><span>${gauge.label}</span><strong>${state.gauges[gauge.id]}</strong></div>`,
              )
              .join("")}
          </div>
        </section>
      </div>
      <div class="launch-actions">
        <button class="launch-btn primary" id="launch-retry">Rejouer</button>
        <a class="launch-btn ghost" href="${withBasePath("/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
    </div>
  `;

  document.getElementById("launch-retry")?.addEventListener("click", startGame);
}

function handleKeydown(event: KeyboardEvent) {
  if (overlay.style.display !== "none") return;
  const keys = config?.input.keys || {};
  if (state.activeResult) {
    if (event.code === keys.next || event.code === "Enter") {
      advanceScenario();
    }
    return;
  }
  const scenario = scenarios[state.index];
  if (!scenario) return;
  const keyMap = [keys.choice1, keys.choice2, keys.choice3, keys.choice4];
  const idx = keyMap.findIndex((key) => key && event.code === key);
  if (idx >= 0 && idx < scenario.choices.length) {
    handleChoice(idx);
  }
}

shell.addEventListener("click", (event) => {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  const choiceEl = target.closest("[data-choice-index]") as HTMLElement | null;
  if (choiceEl) {
    const idx = Number(choiceEl.dataset.choiceIndex);
    handleChoice(idx);
    return;
  }
  const actionEl = target.closest("[data-action]") as HTMLElement | null;
  if (actionEl?.dataset.action === "continue") {
    advanceScenario();
  }
});

window.addEventListener("keydown", handleKeydown);

if (!config) {
  showOverlay("Config manquante", "Ajoute configs/games/rhlife.config.json", false);
} else {
  showOverlay(config.uiText.title, config.uiText.help, true);
}
