import{g as A,c as L,w as f,A as w}from"./index-C4KyqBCx.js";const k=document.getElementById("app"),R=A(),h=R.save,b=a=>a[Math.floor(Math.random()*a.length)];if(!L(h))window.location.replace(f("/"));else{const a="Alexiane",m=h.playerProfile.avatar||"💫",s=h.globalXP.toLocaleString("fr-FR"),n=w.minXP.toLocaleString("fr-FR"),i=Math.min(100,Math.max(12,Math.round(h.globalXP/(w.minXP*1.25)*100))),r=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),c=["Tu viens de passer en mode prestige : plus de style, zéro filtre.","On a tenté de faire sobre. Le code a répondu : « Alexiane, impossible ».","C'est la page secrète qui dit haut et fort que tu as le swag intégré."],o=["Vote unanime : garder Alexiane au sommet, ajouter une dose de fun et signer tout de suite.","Après examen, on confirme : niveau charme 9000, option premium activée.","Résultat du scan : rareté maximale, humour calibré, classe automatique."],d=["Si quelqu'un demande comment tu as débloqué ça, réponds « secret de fabrication ».","Tu peux revenir ici quand tu veux, c'est ton lounge privé.","Attention : cette page peut provoquer des sourires incontrôlables."],v=["Sourire naturel : activé","Style : premium","Vibes : stables","Punchlines : prêtes"],l=["Édition 1/1","Validé par le comité","Premium certifié"],p=f("/"),g=f("/apps/profil/");k.innerHTML=`
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
            <strong>${w.achievementId}</strong>
          </div>
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès validé · ${n} XP</p>
            <h1>
              ${m} ${a}, tu as débloqué la version <span>Prestige</span>.
            </h1>
            <p class="lead">
              ${b(c)} Une page pensée pour une seule personne : toi.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${p}">Retour au hub</a>
              <a class="btn ghost" href="${g}">Voir le profil</a>
            </div>
            <div class="chips">
              <span>XP ${s}</span>
              <span>VIP réel</span>
              <span>Signature moderne</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${m}</div>
              <div class="profile-info">
                <span>Propriétaire officielle</span>
                <strong>${a}</strong>
                <em>Cachet du ${r}</em>
              </div>
            </div>
            <div class="meter">
              <div class="meter-bar"><span style="width: ${i}%"></span></div>
              <div class="meter-meta">
                <span>Prestige</span>
                <strong>${i}%</strong>
              </div>
            </div>
            <div class="badge-row">
              ${l.map(u=>`<span>${u}</span>`).join("")}
            </div>
          </aside>
        </header>

        <section class="cards-grid">
          <article class="card card-accent">
            <div class="card-head">
              <span class="pill">Comité secret</span>
              <h2>Décision officielle</h2>
            </div>
            <p>${b(o)}</p>
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
              ${v.map(u=>`<li>${u}</li>`).join("")}
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
            <p>${b(d)}</p>
          </div>
          <div class="callout-seal">
            <span>${a}</span>
            <em>Édition prestige</em>
          </div>
        </section>
      </main>
    </div>
  `,S()}function S(){const a=document.getElementById("fireworks");if(!a||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const s=a.getContext("2d");if(!s)return;let n=0,i=0,r=1;const c=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],o=[],d=()=>{r=Math.min(2,window.devicePixelRatio||1),n=window.innerWidth,i=window.innerHeight,a.width=Math.round(n*r),a.height=Math.round(i*r),a.style.width=`${n}px`,a.style.height=`${i}px`,s.setTransform(r,0,0,r,0,0)},v=(t,e,y=1)=>{const $=Math.round(60*y);for(let x=0;x<$;x+=1){const M=Math.random()*Math.PI*2,P=(Math.random()*3+2.2)*y,q=Math.random()*2+1.4;o.push({x:t,y:e,vx:Math.cos(M)*P,vy:Math.sin(M)*P,alpha:1,decay:.012+Math.random()*.016,size:q,color:c[Math.floor(Math.random()*c.length)]})}};let l=!1;const p=()=>{s.clearRect(0,0,n,i),s.globalCompositeOperation="lighter";for(let t=o.length-1;t>=0;t-=1){const e=o[t];if(e.vy+=.04,e.vx*=.98,e.vy*=.98,e.x+=e.vx,e.y+=e.vy,e.alpha-=e.decay,e.alpha<=0){o.splice(t,1);continue}s.globalAlpha=e.alpha,s.fillStyle=e.color,s.beginPath(),s.arc(e.x,e.y,e.size,0,Math.PI*2),s.fill()}o.length>0?requestAnimationFrame(p):l=!1},g=()=>{l||(l=!0,requestAnimationFrame(p))};d(),window.addEventListener("resize",d),[{delay:0,x:.2,y:.32,power:1.2},{delay:180,x:.5,y:.22,power:1.4},{delay:360,x:.8,y:.3,power:1.2},{delay:700,x:.35,y:.45,power:1.05},{delay:920,x:.68,y:.4,power:1.15}].forEach(t=>{window.setTimeout(()=>{v(n*t.x,i*t.y,t.power),g()},t.delay)})}
