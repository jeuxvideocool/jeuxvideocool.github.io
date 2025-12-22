import{w as u,g as S,c as k,A as f}from"./index-Dht2C2Xm.js";import{getAuthState as R,subscribe as C}from"./cloud-ByLG0KQ1.js";const $=document.getElementById("app"),A=u("/apps/auth/");let l=R();const w=t=>t[Math.floor(Math.random()*t.length)];function T(){$.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Arcade Galaxy</p>
            <h1>Synchronisation cloud en cours</h1>
            <p class="lead">Chargement de ta sauvegarde avant l'accès au secret.</p>
            <div class="hero-actions">
              <a class="btn primary" href="${A}">Connexion cloud</a>
              <a class="btn ghost" href="${u("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function X(){const c=S().save;if(!k(c)){window.location.replace(u("/"));return}const a="Alexiane",n=c.playerProfile.avatar||"💫",i=c.globalXP.toLocaleString("fr-FR"),r=f.minXP.toLocaleString("fr-FR"),d=Math.min(100,Math.max(12,Math.round(c.globalXP/(f.minXP*1.25)*100))),o=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),h=["Tu viens de passer en mode prestige : plus de style, zéro filtre.","On a tenté de faire sobre. Le code a répondu : « Alexiane, impossible ».","C'est la page secrète qui dit haut et fort que tu as le swag intégré."],v=["Vote unanime : garder Alexiane au sommet, ajouter une dose de fun et signer tout de suite.","Après examen, on confirme : niveau charme 9000, option premium activée.","Résultat du scan : rareté maximale, humour calibré, classe automatique."],p=["Si quelqu'un demande comment tu as débloqué ça, réponds « secret de fabrication ».","Tu peux revenir ici quand tu veux, c'est ton lounge privé.","Attention : cette page peut provoquer des sourires incontrôlables."],m=["Sourire naturel : activé","Style : premium","Vibes : stables","Punchlines : prêtes"],g=["Édition 1/1","Validé par le comité","Premium certifié"],b=u("/"),s=u("/apps/profil/");$.innerHTML=`
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
            <strong>${f.achievementId}</strong>
          </div>
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès validé · ${r} XP</p>
            <h1>
              ${n} ${a}, tu as débloqué la version <span>Prestige</span>.
            </h1>
            <p class="lead">
              ${w(h)} Une page pensée pour une seule personne : toi.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${b}">Retour au hub</a>
              <a class="btn ghost" href="${s}">Voir le profil</a>
            </div>
            <div class="chips">
              <span>XP ${i}</span>
              <span>VIP réel</span>
              <span>Signature moderne</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${n}</div>
              <div class="profile-info">
                <span>Propriétaire officielle</span>
                <strong>${a}</strong>
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
              ${g.map(e=>`<span>${e}</span>`).join("")}
            </div>
          </aside>
        </header>

        <section class="cards-grid">
          <article class="card card-accent">
            <div class="card-head">
              <span class="pill">Comité secret</span>
              <h2>Décision officielle</h2>
            </div>
            <p>${w(v)}</p>
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
              ${m.map(e=>`<li>${e}</li>`).join("")}
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
            <p>${w(p)}</p>
          </div>
          <div class="callout-seal">
            <span>${a}</span>
            <em>Édition prestige</em>
          </div>
        </section>
      </main>
    </div>
  `,E()}function E(){const t=document.getElementById("fireworks");if(!t||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const a=t.getContext("2d");if(!a)return;let n=0,i=0,r=1;const d=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],o=[],h=()=>{r=Math.min(2,window.devicePixelRatio||1),n=window.innerWidth,i=window.innerHeight,t.width=Math.round(n*r),t.height=Math.round(i*r),t.style.width=`${n}px`,t.style.height=`${i}px`,a.setTransform(r,0,0,r,0,0)},v=(s,e,y=1)=>{const L=Math.round(60*y);for(let x=0;x<L;x+=1){const M=Math.random()*Math.PI*2,P=(Math.random()*3+2.2)*y,q=Math.random()*2+1.4;o.push({x:s,y:e,vx:Math.cos(M)*P,vy:Math.sin(M)*P,alpha:1,decay:.012+Math.random()*.016,size:q,color:d[Math.floor(Math.random()*d.length)]})}};let p=!1;const m=()=>{a.clearRect(0,0,n,i),a.globalCompositeOperation="lighter";for(let s=o.length-1;s>=0;s-=1){const e=o[s];if(e.vy+=.04,e.vx*=.98,e.vy*=.98,e.x+=e.vx,e.y+=e.vy,e.alpha-=e.decay,e.alpha<=0){o.splice(s,1);continue}a.globalAlpha=e.alpha,a.fillStyle=e.color,a.beginPath(),a.arc(e.x,e.y,e.size,0,Math.PI*2),a.fill()}o.length>0?requestAnimationFrame(m):p=!1},g=()=>{p||(p=!0,requestAnimationFrame(m))};h(),window.addEventListener("resize",h),[{delay:0,x:.2,y:.32,power:1.2},{delay:180,x:.5,y:.22,power:1.4},{delay:360,x:.8,y:.3,power:1.2},{delay:700,x:.35,y:.45,power:1.05},{delay:920,x:.68,y:.4,power:1.15}].forEach(s=>{window.setTimeout(()=>{v(n*s.x,i*s.y,s.power),g()},s.delay)})}!l.ready||!l.user?window.location.replace(A):l.hydrated?X():(T(),C(t=>{l=t,l.user&&l.hydrated&&window.location.reload()}));
