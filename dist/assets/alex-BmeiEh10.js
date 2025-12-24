import{A as g,w as v,g as S,c as D}from"./index-CsvP8RUZ.js";import{subscribe as T,getAuthState as X}from"./cloud-CQZoWt0Z.js";const w=document.getElementById("app");let h=X(),L=!1,l=null,P="";function E(){w.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Arcade Galaxy</p>
            <h1>Synchronisation cloud en cours</h1>
            <p class="lead">Chargement de ta sauvegarde avant l'accès au secret.</p>
            <div class="hero-actions">
              <a class="btn ghost" href="${v("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function I(){w.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Vérification</p>
            <h1>Contrôle d'accès en cours</h1>
            <p class="lead">On vérifie si ce compte a le droit d'entrer.</p>
            <div class="hero-actions">
              <a class="btn primary" href="${v("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function j(e){w.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès restreint</p>
            <h1>Page réservée au compte Alex</h1>
            <p class="lead">${e}</p>
            <div class="hero-actions">
              <a class="btn primary" href="${v("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function F(e){var r;if(!e)return null;const t=(r=e.user_metadata)==null?void 0:r.identifier;if(t)return t;const a=e.email||"";if(!a)return null;if(a.endsWith("@user.local"))return a.replace("@user.local","");const i=a.indexOf("@");return i>0?a.slice(0,i):a}function H(e){const t=F(e);return(t==null?void 0:t.trim().toLowerCase())===g.requiredName.trim().toLowerCase()}function z(){l!=="checking"&&(l="checking",I())}function B(){l!=="gate"&&(l="gate",E())}function x(e){l==="denied"&&P===e||(l="denied",P=e,j(e))}function V(){l!=="secret"&&(l="secret",G())}function C(){if(!h.ready){x("Supabase n'est pas configuré pour vérifier l'identité.");return}if(!L){z();return}if(!h.user){x("Connecte-toi au cloud depuis le hub pour déverrouiller l'accès.");return}if(!H(h.user)){x("Tu n'es pas connecté avec le compte Alex.");return}if(!h.hydrated){B();return}V()}function G(){const t=S().save;if(!D(t)){window.location.replace(v("/"));return}const a="Alexiane",i=t.playerProfile.avatar||"💫",r=t.globalXP.toLocaleString("fr-FR"),c=g.minXP.toLocaleString("fr-FR"),u=Math.min(100,Math.max(12,Math.round(t.globalXP/(g.minXP*1.25)*100))),o=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),m=["Alors ça y est, tu as atteint l'expérience requise !","Ça fait de toi une vraie fierté :D","Bon, la vérité, tu as travaillé dur pour ça... enfin travaillé, tu as surtout joué, quoi.","Mais bon, il fallait bien que tu arrives à cet achievement — à vrai dire, c'est plutôt ça, ton cadeau !","Comme je sais que tu adores les petits mots gentils, les compliments et les paillettes (je t'entends vomir d'ici :D).","En tout cas, merci pour tout ce que tu es !"],b=[`XP requise : ${c}`,"Achievement : validé","Accès : débloqué","Paillettes : minimisées"],p=["Accès débloqué","Achievement validé","Anninoël tardif"],f="Joyeux Anninoël — sûrement en retard : tu n'as eu accès au site que le 24 au soir :D",y=v("/");w.innerHTML=`
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
            <strong>${g.achievementId}</strong>
          </div>
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Niveau requis atteint · ${c} XP</p>
            <h1>
              ${i} ${a}, objectif atteint.
            </h1>
            <p class="lead">
              Tu as atteint l'expérience requise. Voici le message qui va avec, sans chichi.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${y}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${r}</span>
              <span>Achievement validé</span>
              <span>Accès tardif</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${i}</div>
              <div class="profile-info">
                <span>Compte autorisé</span>
                <strong>${a}</strong>
                <em>Validation du ${o}</em>
              </div>
            </div>
            <div class="meter">
              <div class="meter-bar"><span style="width: ${u}%"></span></div>
              <div class="meter-meta">
                <span>Progression</span>
                <strong>${u}%</strong>
              </div>
            </div>
            <div class="badge-row">
              ${p.map(d=>`<span>${d}</span>`).join("")}
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
              ${m.map(d=>`<p>${d}</p>`).join("")}
            </div>
            <div class="signature">— L'équipe (sans paillettes)</div>
          </article>

          <article class="card">
            <div class="card-head">
              <span class="pill">Récap</span>
              <h2>Ce qui est validé</h2>
            </div>
            <ul>
              ${b.map(d=>`<li>${d}</li>`).join("")}
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
            <p>${f}</p>
          </div>
          <div class="callout-seal">
            <span>${a}</span>
            <em>Accès débloqué</em>
          </div>
        </section>
      </main>
    </div>
  `,N()}function N(){const e=document.getElementById("fireworks");if(!e||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const a=e.getContext("2d");if(!a)return;let i=0,r=0,c=1;const u=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],o=[],m=()=>{c=Math.min(2,window.devicePixelRatio||1),i=window.innerWidth,r=window.innerHeight,e.width=Math.round(i*c),e.height=Math.round(r*c),e.style.width=`${i}px`,e.style.height=`${r}px`,a.setTransform(c,0,0,c,0,0)},b=(n,s,M=1)=>{const k=Math.round(60*M);for(let A=0;A<k;A+=1){const $=Math.random()*Math.PI*2,q=(Math.random()*3+2.2)*M,R=Math.random()*2+1.4;o.push({x:n,y:s,vx:Math.cos($)*q,vy:Math.sin($)*q,alpha:1,decay:.012+Math.random()*.016,size:R,color:u[Math.floor(Math.random()*u.length)]})}};let p=!1;const f=()=>{a.clearRect(0,0,i,r),a.globalCompositeOperation="lighter";for(let n=o.length-1;n>=0;n-=1){const s=o[n];if(s.vy+=.04,s.vx*=.98,s.vy*=.98,s.x+=s.vx,s.y+=s.vy,s.alpha-=s.decay,s.alpha<=0){o.splice(n,1);continue}a.globalAlpha=s.alpha,a.fillStyle=s.color,a.beginPath(),a.arc(s.x,s.y,s.size,0,Math.PI*2),a.fill()}o.length>0?requestAnimationFrame(f):p=!1},y=()=>{p||(p=!0,requestAnimationFrame(f))};m(),window.addEventListener("resize",m),[{delay:0,x:.2,y:.32,power:1.2},{delay:180,x:.5,y:.22,power:1.4},{delay:360,x:.8,y:.3,power:1.2},{delay:700,x:.35,y:.45,power:1.05},{delay:920,x:.68,y:.4,power:1.15}].forEach(n=>{window.setTimeout(()=>{b(i*n.x,r*n.y,n.power),y()},n.delay)})}T(e=>{h=e,L=!0,C()});C();
