import{A as q,w as m,g as X,c as F}from"./index-CK9lGSzJ.js";import{subscribe as I,getAuthState as O}from"./cloud-CKXTOD0h.js";const y=document.getElementById("app");let h=O(),T=!1,l=null,S="";function B(){y.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Arcade Galaxy</p>
            <h1>Synchronisation cloud en cours</h1>
            <p class="lead">Chargement de ta sauvegarde avant l'accès au secret.</p>
            <div class="hero-actions">
              <a class="btn ghost" href="${m("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function H(){y.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Vérification</p>
            <h1>Contrôle d'accès en cours</h1>
            <p class="lead">On vérifie si ce compte a le droit d'entrer.</p>
            <div class="hero-actions">
              <a class="btn primary" href="${m("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function N(e){y.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès restreint</p>
            <h1>Page réservée au compte Alex</h1>
            <p class="lead">${e}</p>
            <div class="hero-actions">
              <a class="btn primary" href="${m("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function V(e){var i;if(!e)return null;const s=(i=e.user_metadata)==null?void 0:i.identifier;if(s)return s;const n=e.email||"";if(!n)return null;if(n.endsWith("@user.local"))return n.replace("@user.local","");const t=n.indexOf("@");return t>0?n.slice(0,t):n}function z(e){const s=V(e);return(s==null?void 0:s.trim().toLowerCase())===q.requiredName.trim().toLowerCase()}function G(){l!=="checking"&&(l="checking",H())}function W(){l!=="gate"&&(l="gate",B())}function x(e){l==="denied"&&S===e||(l="denied",S=e,N(e))}function _(){l!=="secret"&&(l="secret",J())}function k(){if(!h.ready){x("Supabase n'est pas configuré pour vérifier l'identité.");return}if(!T){G();return}if(!h.user){x("Connecte-toi au cloud depuis le hub pour déverrouiller l'accès.");return}if(!z(h.user)){x("Tu n'es pas connecté avec le compte Alex.");return}if(!h.hydrated){W();return}_()}function J(){const s=X().save;if(!F(s)){window.location.replace(m("/"));return}const n="Alexiane",t=s.playerProfile.avatar||"💫",i=s.globalXP.toLocaleString("fr-FR"),r=q.minXP.toLocaleString("fr-FR"),o=Math.min(100,Math.max(12,Math.round(s.globalXP/(q.minXP*1.25)*100))),v=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),d=["Bon. C’est officiel. Tu as atteint le niveau requis.","Ce qui signifie surtout une chose : oui, tu es vieille. Pas symboliquement. Administrativement.","On pourrait parler d’expérience, de maturité, de sagesse… mais soyons honnêtes : c’est surtout l’accumulation des années qui a fini par faire le boulot.","D’ailleurs, petit rappel utile : se niquer une cheville sur un micro-rebord de rien du tout, c’est pas un bug du décor, c’est un indice.","Donc si tu as joué sur ton téléphone, j’espère sincèrement que tu as levé les yeux de temps en temps. Ce serait dommage de rajouter une deuxième cheville au tableau.","Mais revenons au sujet : cet achievement. Pas une surprise, plutôt une étape inévitable. Comme les lunettes qui apparaissent soudainement “juste pour lire”.","Tu n'y es pas encore, mais ça ne saurait tarder ! Regarde Elo....(Ouais elle prend sa balle perdue aussi !!).","Vu que tu adores les mots gentils, les paillettes et tout ce genre de trucs, je voulais te dire que tu es une personne remarquable. Toujours le sourire, attentionnée, drôle et intelligente.","Mais en vrai je sais très bien que là, tu es en train de vomir intérieurement.","Du coup je vais rééquilibrer tout ça : va te faire foutre amicalement :D","Joyeux Anninoël : cadeau d’anniversaire ET de Noël, accès au site le 24 au soir oblige.","Bref, respect quand même. Et maintenant… comme tu veux."],f=["Accès débloqué (avec assistance)","Achievement validé malgré l’âge"],g="PS : si on te demande ton cadeau, dis que c’est cet achievement. À ce stade, c’est plus durable qu’un corps en parfait état. :P",p=m("/");y.innerHTML=`
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
            <p class="overline">Niveau requis atteint · ${r} XP</p>
            <h1>
              ${t} ${n}, objectif atteint.
            </h1>
            <p class="lead">
              Tu as atteint l'expérience requise. Voici le message qui va avec !
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${p}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${i}</span>
              <span>Achievement validé</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${t}</div>
              <div class="profile-info">
                <span>Compte autorisé</span>
                <strong>${n}</strong>
                <em>Validation du ${v}</em>
              </div>
            </div>
            <div class="meter">
              <div class="meter-bar"><span style="width: ${o}%"></span></div>
              <div class="meter-meta">
                <span>Progression</span>
                <strong>${o}%</strong>
              </div>
            </div>
            <div class="badge-row">
              ${f.map(u=>`<span>${u}</span>`).join("")}
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
              ${d.map(u=>`<p>${u}</p>`).join("")}
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
            <p>${g}</p>
          </div>
          <div class="callout-seal">
            <span>${n}</span>
            <em>Accès débloqué</em>
          </div>
        </section>
      </main>
    </div>
  `,U()}function U(){const e=document.getElementById("fireworks");if(!e)return;const s=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=s?.55:1,t=e.getContext("2d");if(!t)return;let i=0,r=0,o=1;const v=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],d=[],f=()=>{o=Math.min(2,window.devicePixelRatio||1),i=window.innerWidth,r=window.innerHeight,e.width=Math.round(i*o),e.height=Math.round(r*o),e.style.width=`${i}px`,e.style.height=`${r}px`,t.setTransform(o,0,0,o,0,0)},g=(b,c,a=1)=>{const M=Math.round(52*a*n);for(let w=0;w<M;w+=1){const C=Math.random()*Math.PI*2,L=(Math.random()*2.2+(s?1.5:2.1))*a,E=Math.random()*1.6+1.2;d.push({x:b,y:c,vx:Math.cos(C)*L,vy:Math.sin(C)*L,alpha:1,decay:(.012+Math.random()*.016)*(s?1.1:1),size:E,color:v[Math.floor(Math.random()*v.length)]})}};let p=!1;const u=()=>{t.clearRect(0,0,i,r),t.globalCompositeOperation="lighter";const b=s?.03:.04;for(let c=d.length-1;c>=0;c-=1){const a=d[c];if(a.vy+=b,a.vx*=.98,a.vy*=.98,a.x+=a.vx,a.y+=a.vy,a.alpha-=a.decay,a.alpha<=0){d.splice(c,1);continue}t.globalAlpha=a.alpha,t.fillStyle=a.color,t.beginPath(),t.arc(a.x,a.y,a.size,0,Math.PI*2),t.fill()}d.length>0?requestAnimationFrame(u):p=!1},A=()=>{p||(p=!0,requestAnimationFrame(u))};f(),window.addEventListener("resize",f);const j=performance.now(),D=1e4,P=s?520:300,R=s?780:560,$=()=>{if(performance.now()-j>=D)return;const c=P+Math.random()*(R-P);window.setTimeout(()=>{const a=i*(.16+Math.random()*.68),M=r*(.18+Math.random()*.55),w=(.6+Math.random()*.45)*n;g(a,M,w),A(),$()},c)};g(i*.5,r*.3,1.15*n),A(),$()}I(e=>{h=e,T=!0,k()});k();
