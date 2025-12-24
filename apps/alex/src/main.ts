import "./style.css";
import { withBasePath } from "@core/utils";
import { ALEX_SECRET, canAccessAlexPage, getProgressionSnapshot } from "@progression";
import { getAuthState, subscribe as subscribeCloud } from "@storage/cloud";

const basePath = import.meta.env.BASE_URL || "/";
const app = document.getElementById("app")!;
let cloudState = getAuthState();

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function renderGate() {
  app.innerHTML = `
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Arcade Galaxy</p>
            <h1>Synchronisation cloud en cours</h1>
            <p class="lead">Chargement de ta sauvegarde avant l'accès au secret.</p>
            <div class="hero-actions">
              <a class="btn ghost" href="${withBasePath("/", basePath)}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `;
}

function renderSecretPage() {
  const snapshot = getProgressionSnapshot();
  const save = snapshot.save;

  if (!canAccessAlexPage(save)) {
    window.location.replace(withBasePath("/", basePath));
    return;
  }
  const displayName = "Alexiane";
  const avatar = save.playerProfile.avatar || "💫";
  const xpLabel = save.globalXP.toLocaleString("fr-FR");
  const minXpLabel = ALEX_SECRET.minXP.toLocaleString("fr-FR");
  const meter = Math.min(100, Math.max(12, Math.round((save.globalXP / (ALEX_SECRET.minXP * 1.25)) * 100)));
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const heroLines = [
    "Tu viens de passer en mode prestige : plus de style, zéro filtre.",
    "On a tenté de faire sobre. Le code a répondu : « Alexiane, impossible ».",
    "C'est la page secrète qui dit haut et fort que tu as le swag intégré.",
  ];

  const committeeLines = [
    "Vote unanime : garder Alexiane au sommet, ajouter une dose de fun et signer tout de suite.",
    "Après examen, on confirme : niveau charme 9000, option premium activée.",
    "Résultat du scan : rareté maximale, humour calibré, classe automatique.",
  ];

  const psLines = [
    "Si quelqu'un demande comment tu as débloqué ça, réponds « secret de fabrication ».",
    "Tu peux revenir ici quand tu veux, c'est ton lounge privé.",
    "Attention : cette page peut provoquer des sourires incontrôlables.",
  ];

  const checklist = [
    "Sourire naturel : activé",
    "Style : premium",
    "Vibes : stables",
    "Punchlines : prêtes",
  ];

  const badges = ["Édition 1/1", "Validé par le comité", "Premium certifié"];

  const backLink = withBasePath("/", basePath);

  app.innerHTML = `
    <div class="page">
      <canvas id="fireworks" class="fireworks" aria-hidden="true"></canvas>
      <div class="backdrop" aria-hidden="true">
        <span class="glow glow-a"></span>
        <span class="glow glow-b"></span>
        <span class="glow glow-c"></span>
        <span class="backdrop-grid"></span>
      </div>

      <main class="shell">
        <nav class="topbar">
          <div class="topbar-left">
            <span class="tag">Achievement exclusif</span>
            <span class="topbar-title">Alexiane · Édition sur-mesure</span>
          </div>
          <div class="topbar-right">
            <span>ID secret</span>
            <strong>${ALEX_SECRET.achievementId}</strong>
          </div>
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès validé · ${minXpLabel} XP</p>
            <h1>
              ${avatar} ${displayName}, tu as débloqué la version <span>Prestige</span>.
            </h1>
            <p class="lead">
              ${pick(heroLines)} Une page pensée pour une seule personne : toi.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${backLink}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${xpLabel}</span>
              <span>VIP réel</span>
              <span>Signature moderne</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${avatar}</div>
              <div class="profile-info">
                <span>Propriétaire officielle</span>
                <strong>${displayName}</strong>
                <em>Cachet du ${today}</em>
              </div>
            </div>
            <div class="meter">
              <div class="meter-bar"><span style="width: ${meter}%"></span></div>
              <div class="meter-meta">
                <span>Prestige</span>
                <strong>${meter}%</strong>
              </div>
            </div>
            <div class="badge-row">
              ${badges.map((badge) => `<span>${badge}</span>`).join("")}
            </div>
          </aside>
        </header>

        <section class="cards-grid">
          <article class="card card-accent">
            <div class="card-head">
              <span class="pill">Comité secret</span>
              <h2>Décision officielle</h2>
            </div>
            <p>${pick(committeeLines)}</p>
            <div class="card-tags">
              <span>Validé</span>
              <span>Drôle</span>
              <span>Premium</span>
            </div>
          </article>

          <article class="card">
            <div class="card-head">
              <span class="pill">Checklist</span>
              <h2>Version Alexiane</h2>
            </div>
            <ul>
              ${checklist.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </article>

          <article class="card">
            <div class="card-head">
              <span class="pill">Message privé</span>
              <h2>Mot doux calibré</h2>
            </div>
            <p>
              Tu es la preuve qu'on peut être drôle, brillante et ultra stylée en même temps.
              On a donc mis tout ça au propre, en version premium.
            </p>
            <div class="signature">— L'équipe (qui note tout)</div>
          </article>
        </section>

        <section class="callout">
          <div>
            <span class="callout-label">PS</span>
            <p>${pick(psLines)}</p>
          </div>
          <div class="callout-seal">
            <span>${displayName}</span>
            <em>Édition prestige</em>
          </div>
        </section>
      </main>
    </div>
  `;

  startFireworks();
}

function startFireworks() {
  const canvas = document.getElementById("fireworks") as HTMLCanvasElement | null;
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  let width = 0;
  let height = 0;
  let devicePixelRatio = 1;

  const colors = ["#ffd27a", "#6de3ff", "#ff89c4", "#ffe96b", "#8dffb0"];
  const particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    decay: number;
    size: number;
    color: string;
  }[] = [];

  const resize = () => {
    devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };

  const burst = (x: number, y: number, power = 1) => {
    const count = Math.round(60 * power);
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 3 + 2.2) * power;
      const size = Math.random() * 2 + 1.4;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.016,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  };

  let animating = false;

  const tick = () => {
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.vy += 0.04;
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= particle.decay;

      if (particle.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      context.globalAlpha = particle.alpha;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    if (particles.length > 0) {
      requestAnimationFrame(tick);
    } else {
      animating = false;
    }
  };

  const launch = () => {
    if (!animating) {
      animating = true;
      requestAnimationFrame(tick);
    }
  };

  resize();
  window.addEventListener("resize", resize);

  const sequence = [
    { delay: 0, x: 0.2, y: 0.32, power: 1.2 },
    { delay: 180, x: 0.5, y: 0.22, power: 1.4 },
    { delay: 360, x: 0.8, y: 0.3, power: 1.2 },
    { delay: 700, x: 0.35, y: 0.45, power: 1.05 },
    { delay: 920, x: 0.68, y: 0.4, power: 1.15 },
  ];

  sequence.forEach((shot) => {
    window.setTimeout(() => {
      burst(width * shot.x, height * shot.y, shot.power);
      launch();
    }, shot.delay);
  });
}

if (!cloudState.ready || !cloudState.user) {
  window.location.replace(authLink);
} else if (!cloudState.hydrated) {
  renderGate();
  subscribeCloud((state) => {
    cloudState = state;
    if (cloudState.user && cloudState.hydrated) {
      window.location.reload();
    }
  });
} else {
  renderSecretPage();
}
