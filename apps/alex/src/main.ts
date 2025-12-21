import "./style.css";
import { withBasePath } from "@core/utils";
import { ALEX_SECRET, canAccessAlexPage, getProgressionSnapshot } from "@progression";

const basePath = import.meta.env.BASE_URL || "/";
const app = document.getElementById("app")!;

const snapshot = getProgressionSnapshot();
const save = snapshot.save;

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

if (!canAccessAlexPage(save)) {
  window.location.replace(withBasePath("/", basePath));
} else {
  const displayName = save.playerProfile.name || "Alex";
  const avatar = save.playerProfile.avatar || "✨";
  const xpLabel = save.globalXP.toLocaleString("fr-FR");
  const minXpLabel = ALEX_SECRET.minXP.toLocaleString("fr-FR");
  const meter = Math.min(100, Math.max(12, Math.round((save.globalXP / (ALEX_SECRET.minXP * 1.3)) * 100)));
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const heroLines = [
    "Ton pseudo a allumé le mode VIP, les serveurs ont applaudi, la page s'est habillée en premium.",
    "C'est officiel : le moteur d'achievement t'a réservé une édition luxe, designée aux petits oignons.",
    "On a mis des paillettes dans l'algorithme, et il a voté pour toi sans hésiter.",
  ];

  const wowLines = [
    "Ce n'est pas un bug, c'est l'effet Alex. Et il est irréversible.",
    "Même les confettis ont demandé ton autographe.",
    "Le bouton WOW est coincé sur ON, personne n'ose l'éteindre.",
  ];

  const perks = [
    {
      icon: "🎆",
      title: "Feu d'artifice on-demand",
      text: "Effets spéciaux premium à activer dès que tu veux briller.",
    },
    {
      icon: "🛡️",
      title: "Bouclier anti-bad vibes",
      text: "Protection deluxe contre les journées grises, calibrée pour toi.",
    },
    {
      icon: "🏆",
      title: "Trophée unique",
      text: "Pièce 1/1 gravée à ton nom. Impossible à copier.",
    },
    {
      icon: "💎",
      title: "Pass premium XL",
      text: "Accès illimité aux moments stylés et aux boosts inattendus.",
    },
  ];

  const capsuleItems = [
    { icon: "🎧", text: "Playlist de victoire (imaginaire mais certifiée stylée)." },
    { icon: "🪄", text: "Sort bonus : sourire qui déclenche les paillettes." },
    { icon: "🚀", text: "Accélérateur de bonne vibe à usage illimité." },
  ];

  const signatureTags = ["Édition 1/1", "Premium", "Sur-mesure", "Fun garanti"];

  const fireworks = [
    { x: 14, y: 18, hue: 36, delay: "0s", size: 180 },
    { x: 78, y: 16, hue: 188, delay: "0.5s", size: 200 },
    { x: 60, y: 48, hue: 10, delay: "1.1s", size: 150 },
    { x: 24, y: 62, hue: 48, delay: "1.7s", size: 190 },
    { x: 72, y: 70, hue: 112, delay: "2.3s", size: 170 },
    { x: 42, y: 30, hue: 220, delay: "2.9s", size: 160 },
  ];

  const streaks = [
    { x: 8, y: 12, delay: "0s", duration: "8s" },
    { x: 72, y: 18, delay: "2.5s", duration: "9s" },
    { x: 30, y: 38, delay: "5s", duration: "10s" },
  ];

  const confetti = Array.from({ length: 32 }, (_, index) => {
    const x = (index * 7 + 12) % 100;
    const size = 6 + (index % 7);
    const duration = 8 + (index % 6);
    const delay = (index * 0.35).toFixed(2);
    const hue = (index * 32 + 20) % 360;
    const fall = 120 + (index % 5) * 10;
    const rotate = (index % 2 === 0 ? 320 : -320) + index * 9;
    const sway = (index % 2 === 0 ? 18 : -18) + (index % 5);
    const round = index % 3 === 0 ? "999px" : "4px";

    return {
      x,
      size,
      duration,
      delay,
      hue,
      fall,
      rotate,
      sway,
      round,
    };
  });

  const backLink = withBasePath("/", basePath);
  const profileLink = withBasePath("/apps/profil/", basePath);
  const tickerText = `${displayName} — Édition Surprise — Feu d'artifice — Premium — Achievement unique — ${minXpLabel} XP —`;

  app.innerHTML = `
    <div class="page">
      <div class="backdrop" aria-hidden="true">
        <div class="aurora"></div>
        <div class="halo halo-a"></div>
        <div class="halo halo-b"></div>
        <div class="halo halo-c"></div>
        <div class="laser-grid"></div>
        <div class="spotlight"></div>
      </div>
      <div class="spark-sweep" aria-hidden="true"></div>
      <div class="streaks" aria-hidden="true">
        ${streaks
          .map(
            (streak) =>
              `<span class="streak" style="--x:${streak.x}%; --y:${streak.y}%; --delay:${streak.delay}; --duration:${streak.duration};"></span>`
          )
          .join("")}
      </div>
      <div class="confetti" aria-hidden="true">
        ${confetti
          .map(
            (piece) =>
              `<span class="confetti-piece" style="--x:${piece.x}%; --size:${piece.size}px; --duration:${piece.duration}s; --delay:${piece.delay}s; --hue:${piece.hue}; --fall:${piece.fall}vh; --rotate:${piece.rotate}deg; --sway:${piece.sway}; --round:${piece.round};"></span>`
          )
          .join("")}
      </div>
      <div class="fireworks" aria-hidden="true">
        ${fireworks
          .map(
            (fw) =>
              `<span class="firework" style="--x:${fw.x}%; --y:${fw.y}%; --hue:${fw.hue}; --delay:${fw.delay}; --size:${fw.size}px;"></span>`
          )
          .join("")}
      </div>

      <main class="shell">
        <nav class="topbar reveal" style="--delay: 0.05s">
          <div class="brand">
            <span class="badge">Achievement débloqué</span>
            <span class="brand-title">Surprise Alex · Édition ultra-personnalisée</span>
          </div>
          <div class="seal">
            <span>ID secret</span>
            <strong>${ALEX_SECRET.achievementId}</strong>
          </div>
        </nav>

        <header class="hero reveal" style="--delay: 0.12s">
          <div class="hero-main">
            <p class="overline">Accès validé · ${minXpLabel} XP</p>
            <h1>
              ${avatar} ${displayName}, l'édition <span class="highlight">Surprise Premium</span> est activée.
            </h1>
            <p class="sub">
              ${pick(heroLines)} C'est un achievement unique, calibré pour une seule personne : toi.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${backLink}">Retour au hub</a>
              <a class="btn ghost" href="${profileLink}">Ton profil</a>
            </div>
            <div class="hero-meta">
              <span class="chip">XP ${xpLabel}</span>
              <span class="chip">Premium garanti</span>
              <span class="chip">Mode Wouahou</span>
            </div>
          </div>
          <aside class="hero-card">
            <div class="hero-card-top">
              <div class="avatar-ring">
                <div class="avatar">${avatar}</div>
              </div>
              <div class="hero-id">
                <p class="label">Propriétaire officiel</p>
                <strong>${displayName}</strong>
                <span class="small">Cachet ${today}</span>
              </div>
            </div>
            <div class="meter-ring" style="--value:${meter}">
              <span>${meter}%</span>
              <p>Hype meter</p>
            </div>
            <div class="hero-stats">
              <div class="stat">
                <span>XP total</span>
                <strong>${xpLabel}</strong>
              </div>
              <div class="stat">
                <span>Statut</span>
                <strong>Édition unique</strong>
              </div>
              <div class="stat">
                <span>Aura</span>
                <strong>Feu d'artifice</strong>
              </div>
            </div>
          </aside>
        </header>

        <section class="moment reveal" style="--delay: 0.2s">
          <article class="card wow-card">
            <div class="wow-burst"></div>
            <p class="mini-label">Effet WOUAHOU</p>
            <div class="wow-text">WOUAHOU</div>
            <p class="wow-line">${pick(wowLines)}</p>
            <div class="wow-footer">
              <span class="spark-chip">Spectaculaire</span>
              <span class="spark-chip">Ultra perso</span>
            </div>
          </article>
          <article class="card capsule-card">
            <div class="card-head">
              <span class="pill">Capsule secrète</span>
              <h2>Boost instantané</h2>
            </div>
            <p class="capsule-text">
              Tout est calibré pour un boost immédiat : lumière, confettis et bonne vibe en édition ${displayName}.
            </p>
            <div class="capsule-list">
              ${capsuleItems
                .map(
                  (item) =>
                    `<div class="capsule-item"><span>${item.icon}</span><p>${item.text}</p></div>`
                )
                .join("")}
            </div>
          </article>
        </section>

        <section class="perks-grid reveal" style="--delay: 0.28s">
          ${perks
            .map(
              (perk) => `
              <article class="perk-card">
                <div class="perk-icon">${perk.icon}</div>
                <h3>${perk.title}</h3>
                <p>${perk.text}</p>
              </article>
            `
            )
            .join("")}
        </section>

        <section class="card message-card reveal" style="--delay: 0.36s">
          <div class="message-main">
            <span class="pill">Message perso</span>
            <h3>Spotlight sur ${displayName}</h3>
            <p>
              Ici, ${displayName}, tu es la tête d'affiche. Cette page est un coffre-fort d'énergie positive :
              ouverte 24/7, jamais en rupture de style, toujours en mode premium.
            </p>
            <div class="message-tags">
              ${signatureTags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </div>
          <div class="message-side">
            <div class="stamp">
              <span>VIP</span>
              <em>Édition 1/1</em>
            </div>
            <p class="signature">Signature officielle : ${displayName}</p>
          </div>
        </section>

        <section class="ticker reveal" style="--delay: 0.44s" aria-hidden="true">
          <div class="ticker-track">
            <span>${tickerText}</span>
            <span>${tickerText}</span>
          </div>
        </section>
      </main>
    </div>
  `;
}
