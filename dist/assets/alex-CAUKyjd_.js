import{A as M,w as v,g as R,c as E}from"./index-CxHBSZk-.js";import{subscribe as X,getAuthState as B}from"./cloud-B1d7Adx9.js";const w=document.getElementById("app");let m=B(),S=!1,l=null,k="";function I(){w.innerHTML=`
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
  `}function z(){w.innerHTML=`
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
  `}function F(s){w.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès restreint</p>
            <h1>Page réservée au compte Alex</h1>
            <p class="lead">${s}</p>
            <div class="hero-actions">
              <a class="btn primary" href="${v("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function O(s){var i;if(!s)return null;const t=(i=s.user_metadata)==null?void 0:i.identifier;if(t)return t;const n=s.email||"";if(!n)return null;if(n.endsWith("@user.local"))return n.replace("@user.local","");const a=n.indexOf("@");return a>0?n.slice(0,a):n}function H(s){const t=O(s);return(t==null?void 0:t.trim().toLowerCase())===M.requiredName.trim().toLowerCase()}function N(){l!=="checking"&&(l="checking",z())}function V(){l!=="gate"&&(l="gate",I())}function y(s){l==="denied"&&k===s||(l="denied",k=s,F(s))}function G(){l!=="secret"&&(l="secret",W())}function T(){if(!m.ready){y("Supabase n'est pas configuré pour vérifier l'identité.");return}if(!S){N();return}if(!m.user){y("Connecte-toi au cloud depuis le hub pour déverrouiller l'accès.");return}if(!H(m.user)){y("Tu n'es pas connecté avec le compte Alex.");return}if(!m.hydrated){V();return}G()}function W(){const t=R().save;if(!E(t)){window.location.replace(v("/"));return}const n="Alexiane",a=t.playerProfile.avatar||"💫",i=t.globalXP.toLocaleString("fr-FR"),r=M.minXP.toLocaleString("fr-FR"),o=Math.min(100,Math.max(12,Math.round(t.globalXP/(M.minXP*1.25)*100))),f=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),d=["Bon. C’est officiel. Tu as atteint le niveau requis.","Ce qui signifie surtout une chose : oui, tu es vieille. Pas symboliquement. Administrativement.","On pourrait parler d’expérience, de maturité, de sagesse… mais soyons honnêtes : c’est surtout l’accumulation des années qui a fini par faire le boulot.","D’ailleurs, petit rappel utile : se niquer une cheville sur un micro-rebord de rien du tout, c’est pas un bug du décor, c’est un indice.","Donc si tu as joué sur ton téléphone, j’espère sincèrement que tu as levé les yeux de temps en temps. Ce serait dommage de rajouter une deuxième cheville au tableau.","Mais revenons au sujet : cet achievement. Pas une surprise, plutôt une étape inévitable. Comme les lunettes qui apparaissent soudainement “juste pour lire”.","Tu n'y es pas encore, mais ça ne saurait tarder ! Regarde Elo....(Ouais elle prend sa balle perdue aussi !!).","Vu que tu adores les mots gentils, les paillettes et tout ce genre de trucs, je voulais te dire que tu es une personne remarquable. Toujours le sourire, attentionnée, drôle et intelligente.","Mais en vrai je sais très bien que là, tu es en train de vomir intérieurement.","Du coup je vais rééquilibrer tout ça : va te faire foutre amicalement :D","Joyeux Anninoël : cadeau d’anniversaire ET de Noël, accès au site le 24 au soir oblige.","Bref, respect quand même. Et maintenant… comme tu veux."],g=["Accès débloqué (avec assistance)","Achievement validé malgré l’âge"],b=v("/");w.innerHTML=`
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
              ${a} ${n}, objectif atteint.
            </h1>
            <p class="lead">
              Tu as atteint l'expérience requise. Voici le message qui va avec !
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${b}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${i}</span>
              <span>Achievement validé</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${a}</div>
              <div class="profile-info">
                <span>Compte autorisé</span>
                <strong>${n}</strong>
                <em>Validation du ${f}</em>
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
              ${g.map(u=>`<span>${u}</span>`).join("")}
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


      </main>
    </div>
  `,_()}function _(){const s=document.getElementById("fireworks");if(!s)return;const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=t?.55:1,a=s.getContext("2d");if(!a)return;let i=0,r=0,o=1;const f=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],d=[],g=()=>{o=Math.min(2,window.devicePixelRatio||1),i=window.innerWidth,r=window.innerHeight,s.width=Math.round(i*o),s.height=Math.round(r*o),s.style.width=`${i}px`,s.style.height=`${r}px`,a.setTransform(o,0,0,o,0,0)},b=(p,c,e=1)=>{const h=Math.round(82*e*n);for(let $=0;$<h;$+=1){const C=Math.random()*Math.PI*2,L=(Math.random()*2.6+(t?1.7:2.6))*e,D=Math.random()*2.4+1.8;d.push({x:p,y:c,vx:Math.cos(C)*L,vy:Math.sin(C)*L,alpha:1,decay:(.007+Math.random()*.01)*(t?1.05:1),size:D,color:f[Math.floor(Math.random()*f.length)]})}};let u=!1;const x=()=>{a.clearRect(0,0,i,r),a.globalCompositeOperation="lighter";const p=t?.028:.035;for(let c=d.length-1;c>=0;c-=1){const e=d[c];if(e.vy+=p,e.vx*=.985,e.vy*=.985,e.x+=e.vx,e.y+=e.vy,e.alpha-=e.decay,e.alpha<=0){d.splice(c,1);continue}const h=e.size*3.2;a.globalAlpha=e.alpha*.55,a.fillStyle=e.color,a.shadowBlur=28*n,a.shadowColor=e.color,a.beginPath(),a.arc(e.x,e.y,h,0,Math.PI*2),a.fill(),a.globalAlpha=e.alpha,a.shadowBlur=12*n,a.beginPath(),a.arc(e.x,e.y,e.size,0,Math.PI*2),a.fill()}d.length>0?requestAnimationFrame(x):u=!1},A=()=>{u||(u=!0,requestAnimationFrame(x))};g(),window.addEventListener("resize",g);const q=t?520:300,j=t?820:640,P=()=>{const p=q+Math.random()*(j-q);window.setTimeout(()=>{const c=i*(.16+Math.random()*.68),e=r*(.18+Math.random()*.55),h=(.75+Math.random()*.6)*n;b(c,e,h),A(),P()},p)};b(i*.5,r*.3,1.3*n),A(),P()}X(s=>{m=s,S=!0,T()});T();
