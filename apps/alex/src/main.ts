import "./style.css";
import { withBasePath } from "@core/utils";
import { ALEX_SECRET, canAccessAlexPage, getProgressionSnapshot } from "@progression";
import { getAuthState, subscribe as subscribeCloud } from "@storage/cloud";

const basePath = import.meta.env.BASE_URL || "/";
const app = document.getElementById("app")!;
let cloudState = getAuthState();
let authChecked = false;
let currentView: "checking" | "gate" | "denied" | "secret" | null = null;
let lastDeniedMessage = "";

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

function renderChecking() {
  app.innerHTML = `
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Vérification</p>
            <h1>Contrôle d'accès en cours</h1>
            <p class="lead">On vérifie si ce compte a le droit d'entrer.</p>
            <div class="hero-actions">
              <a class="btn primary" href="${withBasePath("/", basePath)}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `;
}

function renderAccessDenied(message: string) {
  app.innerHTML = `
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès restreint</p>
            <h1>Page réservée au compte Alex</h1>
            <p class="lead">${message}</p>
            <div class="hero-actions">
              <a class="btn primary" href="${withBasePath("/", basePath)}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `;
}

function getCloudIdentifier(user: typeof cloudState.user): string | null {
  if (!user) return null;
  const metaId = (user.user_metadata as { identifier?: string } | undefined)?.identifier;
  if (metaId) return metaId;
  const email = (user.email as string | undefined) || "";
  if (!email) return null;
  if (email.endsWith("@user.local")) return email.replace("@user.local", "");
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

function isAlexAccount(user: typeof cloudState.user): boolean {
  const identifier = getCloudIdentifier(user);
  return identifier?.trim().toLowerCase() === ALEX_SECRET.requiredName.trim().toLowerCase();
}

function showChecking() {
  if (currentView === "checking") return;
  currentView = "checking";
  renderChecking();
}

function showGate() {
  if (currentView === "gate") return;
  currentView = "gate";
  renderGate();
}

function showDenied(message: string) {
  if (currentView === "denied" && lastDeniedMessage === message) return;
  currentView = "denied";
  lastDeniedMessage = message;
  renderAccessDenied(message);
}

function showSecret() {
  if (currentView === "secret") return;
  currentView = "secret";
  renderSecretPage();
}

function evaluateAccess() {
  if (!cloudState.ready) {
    showDenied("Supabase n'est pas configuré pour vérifier l'identité.");
    return;
  }
  if (!authChecked) {
    showChecking();
    return;
  }
  if (!cloudState.user) {
    showDenied("Connecte-toi au cloud depuis le hub pour déverrouiller l'accès.");
    return;
  }
  if (!isAlexAccount(cloudState.user)) {
    showDenied("Tu n'es pas connecté avec le compte Alex.");
    return;
  }
  if (!cloudState.hydrated) {
    showGate();
    return;
  }
  showSecret();
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

  const messageParagraphs = [
    "Alors ça y est, tu as atteint l'expérience requise !",
    "Ça fait de toi une vraie fierté :D",
    "Bon, la vérité, tu as travaillé dur pour ça... enfin travaillé, tu as surtout joué, quoi.",
    "Mais bon, il fallait bien que tu arrives à cet achievement — à vrai dire, c'est plutôt ça, ton cadeau !",
    "Comme je sais que tu adores les petits mots gentils, les compliments et les paillettes (je t'entends vomir d'ici :D).",
    "En tout cas, merci pour tout ce que tu es !",
  ];

  const recap = [
    `XP requise : ${minXpLabel}`,
    "Achievement : validé",
    "Accès : débloqué",
    "Paillettes : minimisées",
  ];

  const badges = ["Accès débloqué", "Achievement validé", "Anninoël tardif"];
  const psLine =
    "Joyeux Anninoël — sûrement en retard : tu n'as eu accès au site que le 24 au soir :D";

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
            <span class="tag">Accès débloqué</span>
            <span class="topbar-title">Alexiane · Message perso</span>
          </div>
          <div class="topbar-right">
            <span>ID achievement</span>
            <strong>${ALEX_SECRET.achievementId}</strong>
          </div>
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Niveau requis atteint · ${minXpLabel} XP</p>
            <h1>
              ${avatar} ${displayName}, objectif atteint.
            </h1>
            <p class="lead">
              Tu as atteint l'expérience requise. Voici le message qui va avec, sans chichi.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${backLink}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${xpLabel}</span>
              <span>Achievement validé</span>
              <span>Accès tardif</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${avatar}</div>
              <div class="profile-info">
                <span>Compte autorisé</span>
                <strong>${displayName}</strong>
                <em>Validation du ${today}</em>
              </div>
            </div>
            <div class="meter">
              <div class="meter-bar"><span style="width: ${meter}%"></span></div>
              <div class="meter-meta">
                <span>Progression</span>
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
              <span class="pill">Message</span>
              <h2>Le mot qui va bien</h2>
            </div>
            <div class="message">
              ${messageParagraphs.map((line) => `<p>${line}</p>`).join("")}
            </div>
            <div class="signature">— L'équipe (sans paillettes)</div>
          </article>

          <article class="card">
            <div class="card-head">
              <span class="pill">Récap</span>
              <h2>Ce qui est validé</h2>
            </div>
            <ul>
              ${recap.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </article>

          <article class="card">
            <div class="card-head">
              <span class="pill">Dernier mot</span>
              <h2>Merci, vraiment</h2>
            </div>
            <p>
              Même si c'est du second degré partout, le fond est là : merci pour tout.
            </p>
            <div class="signature">— Signé : ceux qui tiennent la manette</div>
          </article>
        </section>

        <section class="callout">
          <div>
            <span class="callout-label">PS</span>
            <p>${psLine}</p>
          </div>
          <div class="callout-seal">
            <span>${displayName}</span>
            <em>Accès débloqué</em>
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

subscribeCloud((state) => {
  cloudState = state;
  authChecked = true;
  evaluateAccess();
});

evaluateAccess();
