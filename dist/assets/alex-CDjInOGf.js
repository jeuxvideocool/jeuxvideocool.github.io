import{A as y,w as v,g as k,c as R}from"./index-CsvP8RUZ.js";import{subscribe as T,getAuthState as X}from"./cloud-CQZoWt0Z.js";const g=document.getElementById("app");let h=X(),P=!1,c=null,$="";function D(){g.innerHTML=`
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
  `}function E(){g.innerHTML=`
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
  `}function j(e){g.innerHTML=`
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
  `}function F(e){var r;if(!e)return null;const t=(r=e.user_metadata)==null?void 0:r.identifier;if(t)return t;const a=e.email||"";if(!a)return null;if(a.endsWith("@user.local"))return a.replace("@user.local","");const i=a.indexOf("@");return i>0?a.slice(0,i):a}function I(e){const t=F(e);return(t==null?void 0:t.trim().toLowerCase())===y.requiredName.trim().toLowerCase()}function B(){c!=="checking"&&(c="checking",E())}function H(){c!=="gate"&&(c="gate",D())}function w(e){c==="denied"&&$===e||(c="denied",$=e,j(e))}function z(){c!=="secret"&&(c="secret",V())}function L(){if(!h.ready){w("Supabase n'est pas configuré pour vérifier l'identité.");return}if(!P){B();return}if(!h.user){w("Connecte-toi au cloud depuis le hub pour déverrouiller l'accès.");return}if(!I(h.user)){w("Tu n'es pas connecté avec le compte Alex.");return}if(!h.hydrated){H();return}z()}function V(){const t=k().save;if(!R(t)){window.location.replace(v("/"));return}const a="Alexiane",i=t.playerProfile.avatar||"💫",r=t.globalXP.toLocaleString("fr-FR"),o=y.minXP.toLocaleString("fr-FR"),d=Math.min(100,Math.max(12,Math.round(t.globalXP/(y.minXP*1.25)*100))),l=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),m=["Alors ça y est, tu as atteint l'expérience requise !!!","Ça fait de toi une vieille félicitation :D","Bon, la vérité, tu as travaillé dur pour ça... enfin travaillé, tu as surtout joué, quoi.","Mais bon, il fallait bien que tu arrives à cet achievement — à vrai dire, c'est plutôt ça, ton cadeau !","Comme je sais que tu adores les petits mots gentils, les compliments et les paillettes (je t'entends vomir d'ici :D).","Joyeux Anninoël en retard : tu n'as eu accès au site que le 24 au soir, la classe :D","Bref, t'es une machine… mais une machine à blagues, surtout.","Tu peux ressortir la panoplie : claquettes, barbecue, et ego XXL, c'est mérité.","En tout cas, merci pour tout ce que tu es !"],b=["Accès débloqué","Achievement validé","Anninoël tardif"],u="PS : si on te demande ton cadeau, dis que c'est l'achievement. C'est déjà pas mal.",f=v("/");g.innerHTML=`
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
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Niveau requis atteint · ${o} XP</p>
            <h1>
              ${i} ${a}, objectif atteint.
            </h1>
            <p class="lead">
              Tu as atteint l'expérience requise. Voici le message qui va avec, en mode taquin.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${f}">Retour au hub</a>
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
                <em>Validation du ${l}</em>
              </div>
            </div>
            <div class="meter">
              <div class="meter-bar"><span style="width: ${d}%"></span></div>
              <div class="meter-meta">
                <span>Progression</span>
                <strong>${d}%</strong>
              </div>
            </div>
            <div class="badge-row">
              ${b.map(p=>`<span>${p}</span>`).join("")}
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
              ${m.map(p=>`<p>${p}</p>`).join("")}
            </div>
            <div class="signature">— La dream team</div>
          </article>

          <article class="card">
            <div class="card-head">
              <span class="pill">Dernier mot</span>
              <h2>Merci, vraiment</h2>
            </div>
            <p>
              Même si on te chambre un peu, le fond est là : merci pour tout.
            </p>
            <div class="signature">— Signé : ceux qui tiennent la manette</div>
          </article>
        </section>

        <section class="callout">
          <div>
            <span class="callout-label">PS</span>
            <p>${u}</p>
          </div>
          <div class="callout-seal">
            <span>${a}</span>
            <em>Accès débloqué</em>
          </div>
        </section>
      </main>
    </div>
  `,G()}function G(){const e=document.getElementById("fireworks");if(!e||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const a=e.getContext("2d");if(!a)return;let i=0,r=0,o=1;const d=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],l=[],m=()=>{o=Math.min(2,window.devicePixelRatio||1),i=window.innerWidth,r=window.innerHeight,e.width=Math.round(i*o),e.height=Math.round(r*o),e.style.width=`${i}px`,e.style.height=`${r}px`,a.setTransform(o,0,0,o,0,0)},b=(n,s,x=1)=>{const C=Math.round(60*x);for(let M=0;M<C;M+=1){const A=Math.random()*Math.PI*2,q=(Math.random()*3+2.2)*x,S=Math.random()*2+1.4;l.push({x:n,y:s,vx:Math.cos(A)*q,vy:Math.sin(A)*q,alpha:1,decay:.012+Math.random()*.016,size:S,color:d[Math.floor(Math.random()*d.length)]})}};let u=!1;const f=()=>{a.clearRect(0,0,i,r),a.globalCompositeOperation="lighter";for(let n=l.length-1;n>=0;n-=1){const s=l[n];if(s.vy+=.04,s.vx*=.98,s.vy*=.98,s.x+=s.vx,s.y+=s.vy,s.alpha-=s.decay,s.alpha<=0){l.splice(n,1);continue}a.globalAlpha=s.alpha,a.fillStyle=s.color,a.beginPath(),a.arc(s.x,s.y,s.size,0,Math.PI*2),a.fill()}l.length>0?requestAnimationFrame(f):u=!1},p=()=>{u||(u=!0,requestAnimationFrame(f))};m(),window.addEventListener("resize",m),[{delay:0,x:.2,y:.32,power:1.2},{delay:180,x:.5,y:.22,power:1.4},{delay:360,x:.8,y:.3,power:1.2},{delay:700,x:.35,y:.45,power:1.05},{delay:920,x:.68,y:.4,power:1.15}].forEach(n=>{window.setTimeout(()=>{b(i*n.x,r*n.y,n.power),p()},n.delay)})}T(e=>{h=e,P=!0,L()});L();
