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
  "Bon. C’est officiel. Tu as atteint le niveau requis.",
  "Ce qui signifie surtout une chose : oui, tu es vieille. Pas symboliquement. Administrativement.",
  "On pourrait parler d’expérience, de maturité, de sagesse… mais soyons honnêtes : c’est surtout l’accumulation des années qui a fini par faire le boulot.",
  "D’ailleurs, petit rappel utile : se niquer une cheville sur un micro-rebord de rien du tout, c’est pas un bug du décor, c’est un indice.",
  "Donc si tu as joué sur ton téléphone, j’espère sincèrement que tu as levé les yeux de temps en temps. Ce serait dommage de rajouter une deuxième cheville au tableau.",
  "Mais revenons au sujet : cet achievement. Pas une surprise, plutôt une étape inévitable. Comme les lunettes qui apparaissent soudainement “juste pour lire”.",
  "Tu n'y es pas encore, mais ça ne saurait tarder ! Regarde Elo....(Ouais elle prend sa balle perdue aussi !!).",
  "Vu que tu adores les mots gentils, les paillettes et tout ce genre de trucs, je voulais te dire que tu es une personne remarquable. Toujours le sourire, attentionnée, drôle et intelligente.",
  "Mais en vrai je sais très bien que là, tu es en train de vomir intérieurement.",
  "Du coup je vais rééquilibrer tout ça : va te faire foutre amicalement :D",
  "Joyeux Anninoël : cadeau d’anniversaire ET de Noël, accès au site le 24 au soir oblige.",
  "Bref, respect quand même. Et maintenant… comme tu veux.",
];

const badges = [
  "Accès débloqué (avec assistance)",
  "Achievement validé malgré l’âge",
];

const psLine =
  "PS : si on te demande ton cadeau, dis que c’est cet achievement. À ce stade, c’est plus durable qu’un corps en parfait état. :P";

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
            <span class="topbar-title">Alexiane · Un joyeux Anni-noël</span>
          </div>
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Niveau requis atteint · ${minXpLabel} XP</p>
            <h1>
              ${avatar} ${displayName}, objectif atteint.
            </h1>
            <p class="lead">
              Tu as atteint l'expérience requise. Voici le message qui va avec !
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${backLink}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${xpLabel}</span>
              <span>Achievement validé</span>
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
            <div class="signature">— La dream team</div>
          </article>

<article class="card">
  <div class="card-head">
    <span class="pill">Dernier mot</span>
    <h2>Merci, vraiment</h2>
  </div>
  <p>
    On te chambre, on te pique, on exagère… mais le fond est simple :
    merci pour tout ce que tu fais, pour ce que tu donnes, et pour être
    exactement comme tu es (même quand tu râles).
  </p>
  <div class="signature">— Signé : la DREAM TEAM, avec affection (si si)</div>
</article>


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

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intensity = reducedMotion ? 0.55 : 1;

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
    const count = Math.round(82 * power * intensity);
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 2.6 + (reducedMotion ? 1.7 : 2.6)) * power;
      const size = Math.random() * 2.4 + 1.8;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: (0.007 + Math.random() * 0.01) * (reducedMotion ? 1.05 : 1),
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  };

  let animating = false;

  const tick = () => {
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";
    const gravity = reducedMotion ? 0.028 : 0.035;

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.vy += gravity;
      particle.vx *= 0.985;
      particle.vy *= 0.985;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= particle.decay;

      if (particle.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const glowSize = particle.size * 2.1;
      context.globalAlpha = particle.alpha * 0.45;
      context.fillStyle = particle.color;
      context.shadowBlur = 16 * intensity;
      context.shadowColor = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
      context.fill();

      context.globalAlpha = particle.alpha;
      context.shadowBlur = 0;
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

  const minDelay = reducedMotion ? 520 : 300;
  const maxDelay = reducedMotion ? 820 : 640;

  const scheduleNext = () => {
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    window.setTimeout(() => {
      const x = width * (0.16 + Math.random() * 0.68);
      const y = height * (0.18 + Math.random() * 0.55);
      const power = (0.75 + Math.random() * 0.6) * intensity;
      burst(x, y, power);
      launch();
      scheduleNext();
    }, delay);
  };

  burst(width * 0.5, height * 0.3, 1.3 * intensity);
  launch();
  scheduleNext();
}

subscribeCloud((state) => {
  cloudState = state;
  authChecked = true;
  evaluateAccess();
});

evaluateAccess();
