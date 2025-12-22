import{a as Ne,b as Re,d as Xe,e as Ge,g as re,f as Je,o as Oe,w as fe,u as le,c as Fe,h as De,i as qe,r as Ve,j as _e,k as ye,A as He}from"./index-C4KyqBCx.js";import{s as ze,g as We,c as _,u as Ke,r as Ye,a as be,l as Qe,b as ce,d as Ze}from"./cloud-D6stoaom.js";const de=document.getElementById("app"),w=Ne(),D=Re(),$e=Xe(),pe=Ge();let C="hub",v=re(),ue=v.save.globalLevel,c=We(),Q="",G="all",F=!1,T=null,H=null,B=!1;function Pe(){var a;const e=c.user;if(!e)return"connecté";const s=(a=e.user_metadata)==null?void 0:a.identifier,t=e.email;return s||(t!=null&&t.endsWith("@user.local")?t.replace("@user.local",""):t||"connecté")}function xe(e){return e?"Image stockée sur Supabase. L'emoji reste disponible en secours.":c.ready?c.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image. Emoji disponible hors-ligne.":"Supabase non configuré (.env)."}Je();Ee(Se(w.hubTheme));ze(e=>{c=e,N()});Oe("ACHIEVEMENT_UNLOCKED",e=>{var a;const s=(a=e.payload)==null?void 0:a.achievementId,t=D.achievements.find(i=>i.id===s);t&&$(`Succès débloqué : ${t.title}`,"success"),s===He.achievementId&&N()});function Se(e){return e?pe.find(s=>s.id===e):pe[0]}function Ee(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function $(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),300)},2600)}function Z(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function A(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),a=Math.floor(s%3600/60),i=s%60;return t?`${t}h ${a}m`:a?`${a}m ${i}s`:`${i}s`}function X(e){return new Intl.NumberFormat("fr-FR").format(e)}function es(e){return e.trim().slice(0,3).toUpperCase()}function ve(e,s){if(e.length<2)return null;const t=e.map(o=>Number.isFinite(o)?o:0),a=100,i=42,r=4,x=Math.max(...t,1),h=Math.min(...t,0),f=x-h||1,P=(a-r*2)/Math.max(1,t.length-1),n=t.map((o,p)=>{const b=r+P*p,R=(o-h)/f,S=r+(i-r*2)*(1-R);return{x:b,y:S}}),y=n.map(o=>`${o.x.toFixed(2)},${o.y.toFixed(2)}`).join(" "),m=`${r},${i-r} ${y} ${a-r},${i-r}`,M=s===void 0?n.length-1:s,L=Math.max(0,Math.min(M,n.length-1)),g=Math.floor(L),j=L-g,E=n.slice(0,g+1);if(j>0&&g<n.length-1){const o=n[g],p=n[g+1];E.push({x:o.x+(p.x-o.x)*j,y:o.y+(p.y-o.y)*j})}const k=E.map(o=>`${o.x.toFixed(2)},${o.y.toFixed(2)}`).join(" "),d=E[E.length-1];return{points:y,area:m,progress:k,marker:d}}function me(e,s){return e?`
    <div class="curve-chart">
      <svg viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="${s}-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--chart-primary)" />
            <stop offset="100%" stop-color="var(--chart-secondary)" />
          </linearGradient>
          <linearGradient id="${s}-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--chart-primary)" stop-opacity="0.35" />
            <stop offset="100%" stop-color="var(--chart-primary)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polyline class="chart-line base" points="${e.points}" />
        <polygon class="chart-area" points="${e.area}" fill="url(#${s}-fill)" />
        <polyline class="chart-line progress" points="${e.progress}" stroke="url(#${s}-line)" />
        <circle class="chart-marker" cx="${e.marker.x}" cy="${e.marker.y}" r="2.6" />
      </svg>
    </div>
  `:'<div class="chart-empty">Pas encore assez de données.</div>'}function ie(e){const s=Object.entries(e.games||{});if(!s.length)return{title:"Aucun jeu",duration:"0m"};const[t,a]=s.sort((r,x)=>(x[1].timePlayedMs||0)-(r[1].timePlayedMs||0))[0],i=w.games.find(r=>r.id===t);return{title:(i==null?void 0:i.title)||t,duration:A(a.timePlayedMs)}}function ss(e){return/^https?:\/\//i.test(e)||e.startsWith("blob:")||e.startsWith("data:")}function ke(e,s){if(e){const t=e.trim();return ss(t)?t:ce(s||t)||null}return ce(s)||null}function ts(e,s,t){const a=(s||"🎮").slice(0,4),i=ke(e,t);return`<div class="avatar ${i?"has-image":""}">${i?`<img src="${i}" alt="Avatar" />`:a}</div>`}function Ae(){if(B)return null;const e=ke(v.save.playerProfile.avatarUrl,v.save.playerProfile.avatarStoragePath);return H||e}function J(){H&&(URL.revokeObjectURL(H),H=null)}function ne(){const e=document.getElementById("profile-avatar-preview"),s=document.getElementById("profile-avatar-helper"),t=document.getElementById("profile-avatar-clear"),a=Ae(),i=v.save.playerProfile.avatar||"🎮",r=!!a;e&&(e.classList.toggle("has-image",r),e.innerHTML=r?`<img src="${a}" alt="Avatar" />`:i),s&&(s.textContent=xe(r)),t&&(t.disabled=!r)}function ge(e,s){const t=e.trim()||"Joueur",a=s.trim()||"🎮",i=c.user?v.save.playerProfile.name:t;le(r=>{r.playerProfile.name=i.slice(0,18),r.playerProfile.avatar=a.slice(0,4),r.playerProfile.avatarType=r.playerProfile.avatarUrl?"image":"emoji"}),N()}function as(){const e=qe(),s=new Blob([e],{type:"application/json"}),t=URL.createObjectURL(s),a=document.createElement("a");a.href=t,a.download="nintendo-hub-save.json",a.click(),URL.revokeObjectURL(t),$("Sauvegarde exportée","success")}async function ns(e){const s=ye(e);if(s.success)if($("Import réussi","success"),J(),T=null,B=!1,N(),c.user)try{const t=await be(v.save,{allowEmpty:!0});$(t?"Sauvegarde cloud remplacée":c.error||"Erreur cloud",t?"success":"error")}catch(t){console.error("Cloud save failed after import",t),$("Erreur cloud","error")}else c.ready&&$("Connecte-toi pour envoyer l'import sur le cloud","info");else $(s.error||"Import impossible","error")}function he(e){Ze(),e?(Ve(e),$(`Progression de ${e} réinitialisée`,"info")):(_e(),$("Progression globale réinitialisée","info")),J(),T=null,B=!1,N()}function rs(e){le(s=>{const t=new Set(s.favorites||[]);t.has(e)?t.delete(e):t.add(e),s.favorites=Array.from(t)}),N()}async function ls(){const e=re();await be(e.save)?(v=e,$("Sauvegarde envoyée sur le cloud","success")):c.error&&$(c.error,"error")}async function is(){const e=await Qe();e!=null&&e.state?(ye(JSON.stringify(e.state)),$("Sauvegarde cloud importée","success"),J(),T=null,B=!1,N()):e!=null&&e.error&&$(e.error,"error")}function os(){return`
    <nav class="nav">
      <button class="nav-btn ${C==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${C==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${C==="stats"?"active":""}" data-tab="stats">Stats</button>
      <button class="nav-btn ${C==="profile"?"active":""}" data-tab="profile">Profil</button>
    </nav>
  `}function cs(e){return Fe(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${fe("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function ds(){return`
    <div class="layout">
      <header class="card hero auth-gate">
        <div class="hero-glow"></div>
        <div class="hero-top">
          <div class="profile">
            <div class="avatar">🎮</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>Connexion requise</h1>
              <p class="muted">Compte cloud obligatoire pour accéder au hub et lancer les jeux. Identifiant + mot de passe (pas d'email nécessaire).</p>
              <div class="chips">
                <span class="chip ${c.ready?"warning":"error"}">Cloud : ${c.ready?"non connecté":"Supabase non configuré"}</span>
                <span class="chip ghost">Saves verrouillées</span>
              </div>
            </div>
          </div>
        </div>
        ${c.ready?`<div class="gate-form">
                 <label>Identifiant <input id="gate-identifier" type="text" placeholder="mon-pseudo" /></label>
                 <label>Mot de passe <input id="gate-password" type="password" placeholder="8+ caractères" /></label>
                 <div class="gate-actions">
                   <button class="btn primary strong" id="gate-login" ${c.loading?"disabled":""}>Connexion</button>
                   <button class="btn ghost strong" id="gate-register" ${c.loading?"disabled":""}>Créer un compte</button>
                 </div>
                 ${c.error?`<p class="status error">${c.error}</p>`:'<p class="status info">Tes saves seront synchronisées entre appareils.</p>'}
               </div>`:'<p class="status error">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY puis recharge la page.</p>'}
      </header>
    </div>
  `}function ps(){var n;const e=v.save,s=e.achievementsUnlocked.length,t=D.achievements.length,a=e.globalLevel>ue,i=`--progress:${v.levelProgress*100}%`,r=A(e.globalStats.timePlayedMs),x=e.globalStats.totalSessions,h=e.playerProfile.lastPlayedGameId&&((n=w.games.find(y=>y.id===e.playerProfile.lastPlayedGameId))==null?void 0:n.title);ue=e.globalLevel;const f=ie(e),P=c.user?`<span class="chip success">Cloud : ${Pe()}</span>`:c.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          ${ts(e.playerProfile.avatarUrl,e.playerProfile.avatar,e.playerProfile.avatarStoragePath)}
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${h?`Dernier jeu : ${h}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${P}
              <span class="chip">⏱ ${r}</span>
              <span class="chip">🎮 ${x} sessions</span>
              <button class="btn primary strong profile-inline" id="open-profile">Voir le profil</button>
            </div>
          </div>
        </div>
        <div class="stat-grid compact">
          <div class="stat-card">
            <p class="label">Niveau</p>
            <strong>${e.globalLevel}</strong>
            <p class="muted small">${e.globalXP} XP</p>
          </div>
          <div class="stat-card">
            <p class="label">Succès</p>
            <strong>${s}/${t}</strong>
            <p class="muted small">Schema v${e.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${r}</strong>
            <p class="muted small">Sessions ${x}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${f.title}</strong>
            <p class="muted small">Temps ${f.duration}</p>
          </div>
        </div>
      </div>
      ${cs(e)}
      <div class="level-row ${a?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${i}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(v.levelProgress*100)}% · ${v.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <p class="muted small hero-note">Profil éditable depuis la page dédiée.</p>
    </header>
  `}function us(){const e=w.games.length?[]:["games.registry.json vide ou invalide"],s=new Set(v.save.favorites||[]),t=Array.from(new Set(w.games.flatMap(n=>n.tags||[]).filter(Boolean))).sort((n,y)=>n.localeCompare(y,"fr")),a=Q.trim().toLowerCase(),i=Q.replace(/"/g,"&quot;"),r=w.games.filter(n=>F?s.has(n.id):!0).filter(n=>G==="all"?!0:(n.tags||[]).includes(G)).filter(n=>a?n.title.toLowerCase().includes(a)||n.description.toLowerCase().includes(a)||n.id.toLowerCase().includes(a):!0).sort((n,y)=>{const m=Number(s.has(y.id))-Number(s.has(n.id));return m!==0?m:(n.order??0)-(y.order??0)}),x=r.map(n=>{$e.find(k=>k.id===n.id)||e.push(`Config manquante pour ${n.id}`);const m=v.save.games[n.id],M=m!=null&&m.lastPlayedAt?Z(m.lastPlayedAt):"Jamais",L=(m==null?void 0:m.bestScore)??null,g=A(m==null?void 0:m.timePlayedMs),j=fe(`/apps/games/${n.id}/`),E=s.has(n.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${n.previewEmoji||"🎮"} ${n.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${E?"active":""}" data-game="${n.id}" title="${E?"Retirer des favoris":"Ajouter aux favoris"}">
                ${E?"★":"☆"}
              </button>
              <span class="muted">MAJ ${n.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${n.description}</p>
          <div class="tags">${n.tags.map(k=>`<span class="tag">${k}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${g}</span>
            <span class="chip ghost">🏆 ${L??"—"}</span>
            <span class="chip ghost">🕘 ${M}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${j}" data-game="${n.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${n.id}">Aide</button>
          </div>
        </article>
      `}).join(""),h=F||G!=="all"||!!a,f=r.length,P=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Catalogue</p>
          <h2>Choisis ton mini-jeu</h2>
        </div>
      </div>
      <div class="filters">
        <div class="filter search">
          <span class="search-icon">🔎</span>
          <input
            id="search-games"
            type="text"
            placeholder="Rechercher un jeu par nom ou description…"
            value="${i}"
          />
        </div>
        <div class="filter group">
          <button class="chip-btn ${G==="all"?"active":""}" data-category="all">Toutes</button>
          ${t.map(n=>`<button class="chip-btn ${n===G?"active":""}" data-category="${n}">${n}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${F?"active":""}" id="filter-fav">
            ★ Favoris ${s.size?`<span class="badge">${s.size}</span>`:""}
          </button>
          <span class="muted small">${f}/${w.games.length} jeux</span>
          ${h?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${P}
      <div class="grid">${x||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function vs(){const e=new Set(v.save.achievementsUnlocked),s=D.achievements.map(t=>`
        <article class="card achievement ${e.has(t.id)?"unlocked":""}">
          <div class="pill accent">${t.icon||"⭐️"}</div>
          <div>
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <p class="muted">${ms(t)}</p>
          </div>
          <div class="reward">+${t.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${D.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${s}</div>
    </section>
  `}function ms(e){const s=e.condition;return s.type==="eventCount"?`${s.count}x ${s.event}`:s.type==="xpReached"?`${s.xp} XP globaux`:s.type==="gamesPlayed"?`${s.count} jeux différents`:s.type==="streak"?`${s.count} ${s.event} d'affilée`:s.type==="playerXpName"?`${s.xp} XP et pseudo "${s.name}"`:""}function gs(){const e=v.save,t=Object.entries(e.games||{}).map(([l,u])=>{var O;const I=((O=w.games.find(V=>V.id===l))==null?void 0:O.title)||l;return{id:l,title:I,timePlayedMs:u.timePlayedMs??0,bestScore:u.bestScore,lastPlayedAt:u.lastPlayedAt??0}}),a=t.length,i=e.globalStats.timePlayedMs??0,r=e.globalStats.totalSessions??0,x=r?i/r:0,h=e.globalStats.events.SESSION_WIN??0,f=e.globalStats.events.SESSION_FAIL??0,P=h+f>0?Math.round(h/(h+f)*100):0,n=e.achievementsUnlocked.length,y=D.achievements.length,m=y?Math.round(n/y*100):0,M=Math.max(0,...Object.values(e.globalStats.streaks||{})),L=[...t].sort((l,u)=>u.timePlayedMs-l.timePlayedMs),g=[...t].filter(l=>l.lastPlayedAt).sort((l,u)=>u.lastPlayedAt-l.lastPlayedAt)[0],j=(g==null?void 0:g.title)||"Aucun jeu",E=g!=null&&g.lastPlayedAt?Z(g.lastPlayedAt):"Jamais",k=ie(e),o=[...De().levels].sort((l,u)=>l.level-u.level),p=o.map(l=>l.requiredXP),R=Math.max(0,o.findIndex(l=>l.level===e.globalLevel))+v.levelProgress,S=ve(p,R),oe=Math.round(v.levelProgress*100),we=Math.max(0,v.nextLevelXP-e.globalXP),ee=[...t].filter(l=>l.lastPlayedAt).sort((l,u)=>l.lastPlayedAt-u.lastPlayedAt).slice(-8),se=ee.length>=2?ee:L.filter(l=>l.timePlayedMs>0).slice(0,8),Le=se.map(l=>l.timePlayedMs),je=ve(Le),Ie=ee.length>=2?"Derniers jeux lancés":"Top temps de jeu",Ce=se.length?`<div class="curve-labels">
        ${se.map(l=>`<span title="${l.title}">${es(l.title)}</span>`).join("")}
      </div>`:"",q=t.reduce((l,u)=>l+u.timePlayedMs,0),z=L.filter(l=>l.timePlayedMs>0).slice(0,5),Me=z.reduce((l,u)=>l+u.timePlayedMs,0),W=Math.max(0,q-Me),K=["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)","var(--chart-6)"];let te="",Y="";if(q>0&&z.length){let l=0;const u=z.map((I,O)=>{const V=I.timePlayedMs/q*100,Ue=l;return l+=V,`${K[O%K.length]} ${Ue.toFixed(2)}% ${l.toFixed(2)}%`});if(W>0&&u.push(`var(--chart-6) ${l.toFixed(2)}% 100%`),te=`style="--donut: conic-gradient(${u.join(", ")})"`,Y=z.map((I,O)=>{const V=Math.round(I.timePlayedMs/q*100);return`
          <div class="legend-item">
            <span class="legend-dot" style="--dot:${K[O%K.length]}"></span>
            <div>
              <strong>${I.title}</strong>
              <p class="muted small">${A(I.timePlayedMs)} · ${V}%</p>
            </div>
          </div>
        `}).join(""),W>0){const I=Math.round(W/q*100);Y+=`
        <div class="legend-item">
          <span class="legend-dot" style="--dot:var(--chart-6)"></span>
          <div>
            <strong>Autres</strong>
            <p class="muted small">${A(W)} · ${I}%</p>
          </div>
        </div>
      `}}else Y='<p class="muted">Pas encore de temps de jeu enregistré.</p>',te='style="--donut: conic-gradient(rgba(255, 255, 255, 0.08) 0 100%)"';const ae=[...t].filter(l=>l.bestScore!==void 0).sort((l,u)=>(u.bestScore??0)-(l.bestScore??0)).slice(0,6),Te=Math.max(1,...ae.map(l=>l.bestScore??0)),Be=ae.length?ae.map(l=>{const u=l.bestScore??0,I=Math.max(6,Math.round(u/Te*100));return`
            <div class="score-row">
              <div class="score-info">
                <strong>${l.title}</strong>
                <span class="muted small">${A(l.timePlayedMs)} joués</span>
              </div>
              <div class="score-bar"><span style="width:${I}%"></span></div>
              <div class="score-value">${X(u)}</div>
            </div>
          `}).join(""):'<p class="muted">Aucun score enregistré pour le moment.</p>';return`
    <section class="card stats-kpi">
      <div class="section-head">
        <div>
          <p class="eyebrow">Stats</p>
          <h2>Dashboard KPI</h2>
          <p class="muted">Vue globale, progression et performance par jeu.</p>
        </div>
        <div class="kpi-badges">
          <span class="chip ghost">Dernier : ${j}</span>
          <span class="chip ghost">Dernière activité : ${E}</span>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card" style="--kpi-accent: var(--chart-1)">
          <div class="kpi-top">
            <span class="kpi-icon">⏱</span>
            <span class="kpi-label">Temps total</span>
          </div>
          <strong>${A(i)}</strong>
          <p class="muted small">Session moyenne ${A(x)}</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-2)">
          <div class="kpi-top">
            <span class="kpi-icon">🎮</span>
            <span class="kpi-label">Sessions</span>
          </div>
          <strong>${X(r)}</strong>
          <p class="muted small">${h} victoires · ${f} défaites</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-3)">
          <div class="kpi-top">
            <span class="kpi-icon">⚡</span>
            <span class="kpi-label">XP globale</span>
          </div>
          <strong>${X(e.globalXP)} XP</strong>
          <p class="muted small">Niveau ${e.globalLevel} · ${oe}%</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-4)">
          <div class="kpi-top">
            <span class="kpi-icon">🧩</span>
            <span class="kpi-label">Jeux joués</span>
          </div>
          <strong>${a}/${w.games.length}</strong>
          <p class="muted small">Top : ${k.title}</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-5)">
          <div class="kpi-top">
            <span class="kpi-icon">🏆</span>
            <span class="kpi-label">Succès</span>
          </div>
          <strong>${n}/${y}</strong>
          <p class="muted small">${m}% complétés</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-6)">
          <div class="kpi-top">
            <span class="kpi-icon">📈</span>
            <span class="kpi-label">Performance</span>
          </div>
          <strong>${P}%</strong>
          <p class="muted small">Streak max ${M}</p>
        </div>
      </div>
    </section>

    <section class="card stats-curves">
      <div class="section-head">
        <div>
          <p class="eyebrow">Progression</p>
          <h2>Courbes de progression</h2>
          <p class="muted">XP, niveaux et rythme d'activité.</p>
        </div>
      </div>
      <div class="curve-grid">
        <article class="curve-card" style="--chart-primary: var(--color-primary); --chart-secondary: var(--color-secondary)">
          <div class="curve-head">
            <div>
              <h3>Niveaux & XP</h3>
              <p class="muted small">Prochain niveau : ${X(v.nextLevelXP)} XP</p>
            </div>
            <span class="chip ghost">+${X(we)} XP</span>
          </div>
          ${me(S,"xp-curve")}
          <div class="curve-metrics">
            <div>
              <span class="label">XP globale</span>
              <strong>${X(e.globalXP)}</strong>
            </div>
            <div>
              <span class="label">Progression</span>
              <strong>${oe}%</strong>
            </div>
            <div>
              <span class="label">Niveau</span>
              <strong>${e.globalLevel}</strong>
            </div>
          </div>
        </article>
        <article class="curve-card" style="--chart-primary: var(--color-accent); --chart-secondary: var(--color-primary)">
          <div class="curve-head">
            <div>
              <h3>Rythme d'activité</h3>
              <p class="muted small">${Ie}</p>
            </div>
            <span class="chip ghost">${P}% win</span>
          </div>
          ${me(je,"activity-curve")}
          ${Ce}
          <div class="curve-metrics">
            <div>
              <span class="label">Sessions</span>
              <strong>${X(r)}</strong>
            </div>
            <div>
              <span class="label">Temps total</span>
              <strong>${A(i)}</strong>
            </div>
            <div>
              <span class="label">Jeu top</span>
              <strong>${k.title}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="card stats-diagrams">
      <div class="section-head">
        <div>
          <p class="eyebrow">Jeux</p>
          <h2>Diagrammes & scores</h2>
          <p class="muted">Répartition des jeux les plus joués et meilleurs scores.</p>
        </div>
      </div>
      <div class="diagram-grid">
        <article class="diagram-card">
          <div class="diagram-head">
            <div>
              <h3>Jeux les plus joués</h3>
              <p class="muted small">${a} jeux actifs</p>
            </div>
          </div>
          <div class="donut-wrap">
            <div class="donut" ${te}></div>
            <div class="donut-center">
              <span class="label">Temps total</span>
              <strong>${A(i)}</strong>
              <p class="muted small">${a} jeux</p>
            </div>
          </div>
          <div class="donut-legend">
            ${Y}
          </div>
        </article>
        <article class="diagram-card">
          <div class="diagram-head">
            <div>
              <h3>Meilleurs scores</h3>
              <p class="muted small">Top jeux par score enregistré.</p>
            </div>
          </div>
          <div class="score-list">
            ${Be}
          </div>
        </article>
      </div>
    </section>
  `}function hs(){var h;const e=v.save,s=Object.entries(e.games||{}),t=ie(e),a=c.lastSyncedAt?Z(c.lastSyncedAt):"Jamais",i=e.playerProfile.lastPlayedGameId&&((h=w.games.find(f=>f.id===e.playerProfile.lastPlayedGameId))==null?void 0:h.title),r=Ae(),x=xe(!!r);return`
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Profil</p>
          <h2>Identité & avatar</h2>
          <p class="muted small">Pseudo lié au compte cloud. Emoji modifiable, image stockée sur Supabase.</p>
        </div>
        <span class="chip ghost">Sync : ${a}</span>
      </div>
      <div class="profile-identity">
        <div class="avatar-panel">
          <div class="avatar ${r?"has-image":""}" id="profile-avatar-preview">
            ${r?`<img src="${r}" alt="Avatar" />`:e.playerProfile.avatar||"🎮"}
          </div>
          <p class="muted small" id="profile-avatar-helper">${x}</p>
          <label class="file-drop">
            <input type="file" id="profile-avatar-upload" accept="image/*" />
            <strong>Image Supabase</strong>
            <span class="muted small">PNG/JPG · 1.5 Mo max</span>
          </label>
          <button class="btn ghost danger" id="profile-avatar-clear" type="button" ${r?"":"disabled"}>Revenir à l'emoji</button>
        </div>
        <div class="profile-form two-cols">
          <label>Pseudo <input id="player-name" value="${e.playerProfile.name}" disabled /></label>
          <label>Avatar (emoji) <input id="player-avatar" value="${e.playerProfile.avatar||"🎮"}" maxlength="4" /></label>
          <div class="actions-grid">
            <button class="btn primary" id="profile-save" type="button">Enregistrer</button>
            <button class="btn ghost" id="export-save" type="button">Exporter JSON</button>
          </div>
          <div class="info-grid">
            <div>
              <span class="label">Dernier jeu</span>
              <strong>${i||"Aucun jeu lancé"}</strong>
            </div>
            <div>
              <span class="label">Jeu le plus joué</span>
              <strong>${t.title}</strong>
              <p class="muted small">${t.duration}</p>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${e.globalStats.totalSessions}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card cloud">
      <div class="section-head">
        <div>
          <p class="eyebrow">Cloud</p>
          <h2>Supabase</h2>
          <p class="muted small">Sauvegarde manuelle sur ton compte connecté.</p>
        </div>
        <span class="chip success">Connecté : ${Pe()}</span>
      </div>
      <div class="actions-grid">
        <button class="btn primary" id="cloud-save" ${c.loading?"disabled":""}>Sauvegarder vers cloud</button>
        <button class="btn ghost" id="cloud-load" ${c.loading?"disabled":""}>Charger depuis cloud</button>
        <button class="btn ghost danger" id="cloud-logout" ${c.loading?"disabled":""}>Déconnexion</button>
      </div>
      <p class="muted small">Dernière synchro : ${a}</p>
      ${c.message?`<p class="status ok">${c.message}</p>`:'<p class="status info">Tes données locales sont synchronisées sur demande.</p>'}
      ${c.error?`<p class="status error">${c.error}</p>`:""}
    </section>

    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Sauvegardes locales</p>
          <h2>Export / Import</h2>
          <p class="muted small">Exporter, importer ou remettre à zéro la progression locale.</p>
        </div>
        <button class="btn ghost danger" id="reset-save" type="button">Reset global</button>
      </div>
      <label class="import">
        <span class="label">Import JSON</span>
        <textarea id="import-text" placeholder="Colle ici ton export JSON"></textarea>
        <button class="btn primary" id="import-btn" type="button">Importer</button>
      </label>
      <div class="save-meta">
        <div>
          <span class="label">Temps global</span>
          <strong>${A(e.globalStats.timePlayedMs)}</strong>
        </div>
        <div>
          <span class="label">Jeux joués</span>
          <strong>${Object.keys(e.games).length}/${w.games.length}</strong>
        </div>
        <div>
          <span class="label">Succès</span>
          <strong>${e.achievementsUnlocked.length}/${D.achievements.length}</strong>
        </div>
      </div>
      <div class="save-list">
        ${s.length?s.map(([f,P])=>`
          <div class="save-row">
            <div>
              <strong>${f}</strong>
              <p class="muted small">v${P.saveSchemaVersion} · Dernier : ${Z(P.lastPlayedAt)}</p>
            </div>
            <div class="chips-row">
              <span class="chip ghost">⏱ ${A(P.timePlayedMs)}</span>
              <span class="chip ghost">🏆 ${P.bestScore??"—"}</span>
            </div>
          </div>
        `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
      </div>
    </section>
  `}function U(){if(!c.user){de.innerHTML=ds(),fs();return}de.innerHTML=`
    <div class="layout">
      ${os()}
      ${ps()}
      ${C==="hub"?us():""}
      ${C==="achievements"?vs():""}
      ${C==="stats"?gs():""}
      ${C==="profile"?hs():""}
    </div>
  `,ys()}function fs(){const e=document.getElementById("gate-login"),s=document.getElementById("gate-register");e==null||e.addEventListener("click",async()=>{var i,r;const t=((i=document.getElementById("gate-identifier"))==null?void 0:i.value)||"",a=((r=document.getElementById("gate-password"))==null?void 0:r.value)||"";await _("login",{identifier:t,password:a})}),s==null||s.addEventListener("click",async()=>{var i,r;const t=((i=document.getElementById("gate-identifier"))==null?void 0:i.value)||"",a=((r=document.getElementById("gate-password"))==null?void 0:r.value)||"";await _("register",{identifier:t,password:a})})}function ys(){document.querySelectorAll(".nav-btn").forEach(d=>{d.addEventListener("click",()=>{C=d.dataset.tab,U()})});const e=document.getElementById("open-profile");e==null||e.addEventListener("click",()=>{C="profile",U()});const s=document.getElementById("player-name"),t=document.getElementById("player-avatar");s&&t&&C!=="profile"&&(s.addEventListener("change",()=>ge(s.value,(t==null?void 0:t.value)||"🎮")),t.addEventListener("change",()=>ge((s==null?void 0:s.value)||"Joueur",t.value))),document.querySelectorAll(".help-btn").forEach(d=>{d.addEventListener("click",()=>{const o=d.dataset.help,p=$e.find(b=>b.id===o);p&&$(p.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(d=>{d.addEventListener("click",()=>{const o=d.dataset.game;o&&rs(o)})});const a=document.getElementById("export-save");a==null||a.addEventListener("click",as);const i=document.getElementById("reset-save");i==null||i.addEventListener("click",()=>he()),document.querySelectorAll(".reset-game").forEach(d=>{d.addEventListener("click",()=>{const o=d.dataset.game;he(o)})});const r=document.getElementById("import-btn"),x=document.getElementById("import-text");r==null||r.addEventListener("click",()=>x&&ns(x.value));const h=document.getElementById("cloud-login"),f=document.getElementById("cloud-register"),P=document.getElementById("cloud-logout"),n=document.getElementById("cloud-save"),y=document.getElementById("cloud-load");h==null||h.addEventListener("click",async()=>{var p,b;const d=((p=document.getElementById("cloud-identifier"))==null?void 0:p.value)||"",o=((b=document.getElementById("cloud-password"))==null?void 0:b.value)||"";await _("login",{identifier:d,password:o})}),f==null||f.addEventListener("click",async()=>{var p,b;const d=((p=document.getElementById("cloud-identifier"))==null?void 0:p.value)||"",o=((b=document.getElementById("cloud-password"))==null?void 0:b.value)||"";await _("register",{identifier:d,password:o})}),P==null||P.addEventListener("click",async()=>{await _("logout"),T=null,B=!1,J()}),n==null||n.addEventListener("click",ls),y==null||y.addEventListener("click",is);const m=document.getElementById("profile-avatar-upload"),M=document.getElementById("profile-avatar-clear"),L=document.getElementById("profile-save");m==null||m.addEventListener("change",d=>{var b;const o=d.target,p=(b=o.files)==null?void 0:b[0];if(p){if(!p.type.startsWith("image/")){$("Seules les images sont autorisées.","error"),o.value="";return}if(p.size>1.5*1024*1024){$("Image trop lourde (1.5 Mo max).","error"),o.value="";return}J(),T=p,H=URL.createObjectURL(p),B=!1,ne()}}),M==null||M.addEventListener("click",()=>{B=!0,T=null,J(),ne()}),L==null||L.addEventListener("click",async()=>{const d=document.getElementById("player-avatar"),o=((d==null?void 0:d.value)||"🎮").slice(0,4),p=v.save.playerProfile.avatarStoragePath;let b=v.save.playerProfile.avatarUrl,R=p;if(T){const S=await Ke(T,p||void 0);if(!S.url||!S.path||S.error){$(S.error||"Upload avatar impossible","error");return}b=S.url,R=S.path}else B&&(b=void 0,R=void 0,p&&c.ready&&c.user&&await Ye(p));le(S=>{S.playerProfile.avatar=o,S.playerProfile.avatarUrl=b,S.playerProfile.avatarStoragePath=R,S.playerProfile.avatarType=b?"image":"emoji"}),T=null,B=!1,J(),$("Profil mis à jour","success"),N()});const g=document.getElementById("search-games"),j=document.getElementById("filter-fav"),E=Array.from(document.querySelectorAll(".chip-btn[data-category]")),k=document.getElementById("clear-filters");g==null||g.addEventListener("input",()=>{Q=g.value,U()}),E.forEach(d=>{d.addEventListener("click",()=>{G=d.dataset.category||"all",U()})}),j==null||j.addEventListener("click",()=>{F=!F,U()}),k==null||k.addEventListener("click",()=>{Q="",G="all",F=!1,U()}),ne()}function N(){v=re(),Ee(Se(w.hubTheme)),U()}U();
