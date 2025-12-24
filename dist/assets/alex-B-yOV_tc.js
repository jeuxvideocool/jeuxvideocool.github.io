import{w,g as L,c as S,A as g}from"./index-kcNxREoJ.js";import{getAuthState as k,subscribe as R}from"./cloud-CZ4Ak1aC.js";const $=document.getElementById("app");let l=k();const f=t=>t[Math.floor(Math.random()*t.length)];function C(){$.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Arcade Galaxy</p>
            <h1>Synchronisation cloud en cours</h1>
            <p class="lead">Chargement de ta sauvegarde avant l'accès au secret.</p>
            <div class="hero-actions">
              <a class="btn ghost" href="${w("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function T(){const c=L().save;if(!S(c)){window.location.replace(w("/"));return}const s="Alexiane",i=c.playerProfile.avatar||"💫",n=c.globalXP.toLocaleString("fr-FR"),r=g.minXP.toLocaleString("fr-FR"),d=Math.min(100,Math.max(12,Math.round(c.globalXP/(g.minXP*1.25)*100))),o=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),u=["Tu viens de passer en mode prestige : plus de style, zéro filtre.","On a tenté de faire sobre. Le code a répondu : « Alexiane, impossible ».","C'est la page secrète qui dit haut et fort que tu as le swag intégré."],m=["Vote unanime : garder Alexiane au sommet, ajouter une dose de fun et signer tout de suite.","Après examen, on confirme : niveau charme 9000, option premium activée.","Résultat du scan : rareté maximale, humour calibré, classe automatique."],p=["Si quelqu'un demande comment tu as débloqué ça, réponds « secret de fabrication ».","Tu peux revenir ici quand tu veux, c'est ton lounge privé.","Attention : cette page peut provoquer des sourires incontrôlables."],h=["Sourire naturel : activé","Style : premium","Vibes : stables","Punchlines : prêtes"],v=["Édition 1/1","Validé par le comité","Premium certifié"],y=w("/");$.innerHTML=`
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
            <strong>${g.achievementId}</strong>
          </div>
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès validé · ${r} XP</p>
            <h1>
              ${i} ${s}, tu as débloqué la version <span>Prestige</span>.
            </h1>
            <p class="lead">
              ${f(u)} Une page pensée pour une seule personne : toi.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${y}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${n}</span>
              <span>VIP réel</span>
              <span>Signature moderne</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${i}</div>
              <div class="profile-info">
                <span>Propriétaire officielle</span>
                <strong>${s}</strong>
                <em>Cachet du ${o}</em>
              </div>
            </div>
            <div class="meter">
              <div class="meter-bar"><span style="width: ${d}%"></span></div>
              <div class="meter-meta">
                <span>Prestige</span>
                <strong>${d}%</strong>
              </div>
            </div>
            <div class="badge-row">
              ${v.map(a=>`<span>${a}</span>`).join("")}
            </div>
          </aside>
        </header>

        <section class="cards-grid">
          <article class="card card-accent">
            <div class="card-head">
              <span class="pill">Comité secret</span>
              <h2>Décision officielle</h2>
            </div>
            <p>${f(m)}</p>
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
              ${h.map(a=>`<li>${a}</li>`).join("")}
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
            <p>${f(p)}</p>
          </div>
          <div class="callout-seal">
            <span>${s}</span>
            <em>Édition prestige</em>
          </div>
        </section>
      </main>
    </div>
  `,X()}function X(){const t=document.getElementById("fireworks");if(!t||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const s=t.getContext("2d");if(!s)return;let i=0,n=0,r=1;const d=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],o=[],u=()=>{r=Math.min(2,window.devicePixelRatio||1),i=window.innerWidth,n=window.innerHeight,t.width=Math.round(i*r),t.height=Math.round(n*r),t.style.width=`${i}px`,t.style.height=`${n}px`,s.setTransform(r,0,0,r,0,0)},m=(a,e,b=1)=>{const A=Math.round(60*b);for(let x=0;x<A;x+=1){const M=Math.random()*Math.PI*2,P=(Math.random()*3+2.2)*b,q=Math.random()*2+1.4;o.push({x:a,y:e,vx:Math.cos(M)*P,vy:Math.sin(M)*P,alpha:1,decay:.012+Math.random()*.016,size:q,color:d[Math.floor(Math.random()*d.length)]})}};let p=!1;const h=()=>{s.clearRect(0,0,i,n),s.globalCompositeOperation="lighter";for(let a=o.length-1;a>=0;a-=1){const e=o[a];if(e.vy+=.04,e.vx*=.98,e.vy*=.98,e.x+=e.vx,e.y+=e.vy,e.alpha-=e.decay,e.alpha<=0){o.splice(a,1);continue}s.globalAlpha=e.alpha,s.fillStyle=e.color,s.beginPath(),s.arc(e.x,e.y,e.size,0,Math.PI*2),s.fill()}o.length>0?requestAnimationFrame(h):p=!1},v=()=>{p||(p=!0,requestAnimationFrame(h))};u(),window.addEventListener("resize",u),[{delay:0,x:.2,y:.32,power:1.2},{delay:180,x:.5,y:.22,power:1.4},{delay:360,x:.8,y:.3,power:1.2},{delay:700,x:.35,y:.45,power:1.05},{delay:920,x:.68,y:.4,power:1.15}].forEach(a=>{window.setTimeout(()=>{m(i*a.x,n*a.y,a.power),v()},a.delay)})}!l.ready||!l.user?window.location.replace(authLink):l.hydrated?T():(C(),R(t=>{l=t,l.user&&l.hydrated&&window.location.reload()}));
