import{A as x,w as v,g as T,c as D}from"./index-CK9lGSzJ.js";import{subscribe as E,getAuthState as I}from"./cloud-CKXTOD0h.js";const b=document.getElementById("app");let h=I(),C=!1,r=null,$="";function X(){b.innerHTML=`
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
  `}function F(){b.innerHTML=`
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
  `}function B(e){b.innerHTML=`
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
  `}function H(e){var i;if(!e)return null;const t=(i=e.user_metadata)==null?void 0:i.identifier;if(t)return t;const a=e.email||"";if(!a)return null;if(a.endsWith("@user.local"))return a.replace("@user.local","");const n=a.indexOf("@");return n>0?a.slice(0,n):a}function V(e){const t=H(e);return(t==null?void 0:t.trim().toLowerCase())===x.requiredName.trim().toLowerCase()}function z(){r!=="checking"&&(r="checking",F())}function N(){r!=="gate"&&(r="gate",X())}function y(e){r==="denied"&&$===e||(r="denied",$=e,B(e))}function O(){r!=="secret"&&(r="secret",G())}function L(){if(!h.ready){y("Supabase n'est pas configuré pour vérifier l'identité.");return}if(!C){z();return}if(!h.user){y("Connecte-toi au cloud depuis le hub pour déverrouiller l'accès.");return}if(!V(h.user)){y("Tu n'es pas connecté avec le compte Alex.");return}if(!h.hydrated){N();return}O()}function G(){const t=T().save;if(!D(t)){window.location.replace(v("/"));return}const a="Alexiane",n=t.playerProfile.avatar||"💫",i=t.globalXP.toLocaleString("fr-FR"),o=x.minXP.toLocaleString("fr-FR"),d=Math.min(100,Math.max(12,Math.round(t.globalXP/(x.minXP*1.25)*100))),c=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),m=["Bon. C’est officiel. Tu as atteint le niveau requis.","Ce qui signifie surtout une chose : oui, tu es vieille. Pas symboliquement. Administrativement.","On pourrait parler d’expérience, de maturité, de sagesse… mais soyons honnêtes : c’est surtout l’accumulation des années qui a fini par faire le boulot.","D’ailleurs, petit rappel utile : se niquer une cheville sur un micro-rebord de rien du tout, c’est pas un bug du décor, c’est un indice.","Donc si tu as joué sur ton téléphone, j’espère sincèrement que tu as levé les yeux de temps en temps. Ce serait dommage de rajouter une deuxième cheville au tableau.","Mais revenons au sujet : cet achievement. Pas une surprise, plutôt une étape inévitable. Comme les lunettes qui apparaissent soudainement “juste pour lire”.","Vu que tu adores les mots gentils, les paillettes et tout ce genre de trucs, je voulais te dire que tu es une personne remarquable. Toujours le sourire, attentionnée, drôle et intelligente.","Mais en vrai je sais très bien que là, tu es en train de vomir intérieurement.","Du coup je vais rééquilibrer tout ça : va te faire foutre amicalement :D","Joyeux Anninoël : cadeau d’anniversaire ET de Noël, accès au site le 24 au soir oblige.","Bref, respect quand même. Et maintenant… comme tu veux."],w=["Accès débloqué (avec assistance)","Achievement validé malgré l’âge"],u="PS : si on te demande ton cadeau, dis que c’est cet achievement. À ce stade, c’est plus durable qu’un corps en parfait état.",f=v("/");b.innerHTML=`
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
            <p class="overline">Niveau requis atteint · ${o} XP</p>
            <h1>
              ${n} ${a}, objectif atteint.
            </h1>
            <p class="lead">
              Tu as atteint l'expérience requise. Voici le message qui va avec !
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${f}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${i}</span>
              <span>Achievement validé</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${n}</div>
              <div class="profile-info">
                <span>Compte autorisé</span>
                <strong>${a}</strong>
                <em>Validation du ${c}</em>
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
              ${w.map(p=>`<span>${p}</span>`).join("")}
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
            <div class="signature">— Signé : la DREAM TEAM Wallah !</div>
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
  `,W()}function W(){const e=document.getElementById("fireworks");if(!e||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const a=e.getContext("2d");if(!a)return;let n=0,i=0,o=1;const d=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],c=[],m=()=>{o=Math.min(2,window.devicePixelRatio||1),n=window.innerWidth,i=window.innerHeight,e.width=Math.round(n*o),e.height=Math.round(i*o),e.style.width=`${n}px`,e.style.height=`${i}px`,a.setTransform(o,0,0,o,0,0)},w=(l,s,g=1)=>{const M=Math.round(40*g);for(let A=0;A<M;A+=1){const q=Math.random()*Math.PI*2,P=(Math.random()*2.2+1.8)*g,j=Math.random()*1.6+1.2;c.push({x:l,y:s,vx:Math.cos(q)*P,vy:Math.sin(q)*P,alpha:1,decay:.012+Math.random()*.016,size:j,color:d[Math.floor(Math.random()*d.length)]})}};let u=!1;const f=()=>{a.clearRect(0,0,n,i),a.globalCompositeOperation="lighter";for(let l=c.length-1;l>=0;l-=1){const s=c[l];if(s.vy+=.04,s.vx*=.98,s.vy*=.98,s.x+=s.vx,s.y+=s.vy,s.alpha-=s.decay,s.alpha<=0){c.splice(l,1);continue}a.globalAlpha=s.alpha,a.fillStyle=s.color,a.beginPath(),a.arc(s.x,s.y,s.size,0,Math.PI*2),a.fill()}c.length>0?requestAnimationFrame(f):u=!1},p=()=>{u||(u=!0,requestAnimationFrame(f))};m(),window.addEventListener("resize",m);const S=performance.now(),k=1e4,R=window.setInterval(()=>{if(performance.now()-S>=k){window.clearInterval(R);return}const s=n*(.18+Math.random()*.64),g=i*(.2+Math.random()*.5),M=.55+Math.random()*.4;w(s,g,M),p()},420)}E(e=>{h=e,C=!0,L()});L();
