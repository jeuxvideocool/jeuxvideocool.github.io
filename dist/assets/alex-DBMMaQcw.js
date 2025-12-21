import{g as u,c as m,w as i,A as n}from"./index-D6AlT0_O.js";const h=document.getElementById("app"),g=u(),e=g.save;if(!m(e))window.location.replace(i("/"));else{const a=e.playerProfile.name||"Alex",l=e.playerProfile.avatar||"✨",r=["Accès VIP activé : le hub te déroule un tapis de lumière.","Boost infini de bonne vibe, calibré sur ton énergie.","Droit permanent au mode légende dans toutes les conversations."],t=["Ce n'est pas un simple cadeau, c'est une page secrète calibrée pour toi.","Mode premium débloqué : lumière, musique, et zéro limite.","Tu viens de déclencher un feu d'artifice rien qu'avec ta présence."],c=[{icon:"⚡️",text:"Un vœu premium à activer quand tu veux."},{icon:"🎆",text:"Une ovation cosmique réservée."},{icon:"💎",text:"Un badge rare qui brille même en mode silencieux."}],d=[{x:12,y:18,hue:38,delay:"0s",size:150},{x:82,y:20,hue:195,delay:"0.6s",size:170},{x:68,y:54,hue:300,delay:"1.2s",size:130},{x:22,y:62,hue:12,delay:"1.6s",size:160},{x:55,y:32,hue:95,delay:"2s",size:140},{x:40,y:78,hue:240,delay:"2.6s",size:180}],o=Math.min(100,Math.max(18,Math.round(e.globalXP/(n.minXP*1.4)*100))),p=i("/"),v=i("/apps/profil/");h.innerHTML=`
    <div class="page">
      <div class="background">
        <div class="orb orb-a"></div>
        <div class="orb orb-b"></div>
        <div class="orb orb-c"></div>
        <div class="grid-lines"></div>
        <div class="light-beam"></div>
      </div>
      <div class="sparkles"></div>
      <div class="fireworks">
        ${d.map(s=>`<span class="firework" style="--x:${s.x}%; --y:${s.y}%; --hue:${s.hue}; --delay:${s.delay}; --size:${s.size}px;"></span>`).join("")}
      </div>

      <main class="wrap">
        <header class="hero">
          <div class="hero-left">
            <span class="eyebrow">Attention secrète · ${n.minXP} XP</span>
            <h1>
              ${l} <span class="hero-name">${a}</span>,
              <span class="gradient-text">version premium</span> activée
            </h1>
            <p class="lead">
              ${t[Math.floor(Math.random()*t.length)]}
              Une page spéciale pour une personne qui met des étincelles partout.
            </p>
            <div class="cta-row">
              <a class="btn primary" href="${p}">Retour au hub</a>
              <a class="btn ghost" href="${v}">Voir ton profil</a>
            </div>
            <div class="stat-row">
              <div class="stat">
                <span class="stat-label">XP actuel</span>
                <strong>${e.globalXP.toLocaleString("fr-FR")} XP</strong>
              </div>
              <div class="stat">
                <span class="stat-label">Mode</span>
                <strong>Ultra stylé</strong>
              </div>
              <div class="stat">
                <span class="stat-label">Aura</span>
                <strong>Feu d'artifice</strong>
              </div>
            </div>
          </div>
          <div class="hero-right">
            <div class="profile-card">
              <div class="profile-top">
                <div class="profile-avatar">${l}</div>
                <div>
                  <p class="label">Pseudo validé</p>
                  <strong>${a}</strong>
                </div>
              </div>
              <div class="profile-meter">
                <div class="meter">
                  <span style="width: ${o}%"></span>
                </div>
                <p class="meter-label">Niveau secret débloqué</p>
              </div>
              <div class="profile-tags">
                <span>VIP</span>
                <span>Ultra rare</span>
                <span>Glow mode</span>
              </div>
            </div>
            <div class="mini-card">
              <p class="mini-title">Capsule surprise</p>
              <p class="mini-text">
                Des éclats, des lumières et un message ultra perso à injecter quand tu veux.
              </p>
              <div class="mini-icons">
                <span>✨</span>
                <span>🎆</span>
                <span>💫</span>
              </div>
            </div>
          </div>
        </header>

        <section class="grid">
          <article class="glass-card">
            <div class="card-header">
              <span class="pill ghost">Boosts premium</span>
              <h3>Pack d'attentions</h3>
            </div>
            <ul class="perks">
              ${r.map(s=>`<li><span>🎁</span>${s}</li>`).join("")}
            </ul>
          </article>

          <article class="glass-card wide">
            <div class="card-header">
              <span class="pill ghost">Message central</span>
              <h3>Version étoilée</h3>
            </div>
            <p class="vibe">
              Ici, ${a}, tu es la tête d'affiche. Ce cadeau n'a pas besoin d'occasion officielle :
              il existe juste pour dire "tu comptes" en version grand format.
            </p>
            <div class="callout">PS : les paillettes sont intégrées, impossible de les désactiver.</div>
          </article>

          <article class="glass-card">
            <div class="card-header">
              <span class="pill ghost">À garder</span>
              <h3>Talismans</h3>
            </div>
            <div class="mini-list">
              ${c.map(s=>`<div><span class="tag">${s.icon}</span>${s.text}</div>`).join("")}
            </div>
          </article>
        </section>

        <section class="ticker" aria-hidden="true">
          <div class="ticker-track">
            <span>Alex — Premium — Surprise — Feu d'artifice — Edition secrète —</span>
            <span>Alex — Premium — Surprise — Feu d'artifice — Edition secrète —</span>
          </div>
        </section>
      </main>
    </div>
  `}
