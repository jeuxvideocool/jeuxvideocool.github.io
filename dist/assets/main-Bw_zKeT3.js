import{a as Xe,b as Ne,d as Re,e as Ge,f as Je,o as Fe,g as ye,w as be,u as ee,c as Oe,h as De,i as qe,r as He,j as _e,k as ze,A as Ve}from"./index-B0OSZgpc.js";import{subscribe as We,getAuthState as Ke,connectCloud as z,uploadAvatarImage as Ye,removeAvatarImage as Qe,requestCloudResetSync as Ze,saveCloud as $e,syncCloudToLocal as es,getAvatarPublicUrl as pe}from"./cloud-Cc8C0fya.js";const le=document.getElementById("app"),L=Xe(),q=Ne(),Pe=Re(),ue=Ge();let C="hub",m,ce=1,ve=!1,o=Ke(),se="",G="all",D=!1,U=null,V=null,X=!1;function xe(){var a;const e=o.user;if(!e)return"connecté";const s=(a=e.user_metadata)==null?void 0:a.identifier,t=e.email;return s||(t!=null&&t.endsWith("@user.local")?t.replace("@user.local",""):t||"connecté")}function Ee(e){return e?"Image stockée sur Supabase.":o.ready?o.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image.":"Supabase non configuré (.env)."}Je();ke(Se(L.hubTheme));We(e=>{o=e,T()});Fe("ACHIEVEMENT_UNLOCKED",e=>{var a;const s=(a=e.payload)==null?void 0:a.achievementId,t=q.achievements.find(l=>l.id===s);t&&$(`Succès débloqué : ${t.title}`,"success"),s===Ve.achievementId&&T()});function Se(e){return e?ue.find(s=>s.id===e):ue[0]}function ke(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function $(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),300)},2600)}function te(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function w(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),a=Math.floor(s%3600/60),l=s%60;return t?`${t}h ${a}m`:a?`${a}m ${l}s`:`${l}s`}function R(e){return new Intl.NumberFormat("fr-FR").format(e)}function ss(e){return e.trim().slice(0,3).toUpperCase()}function me(e,s){if(e.length<2)return null;const t=e.map(g=>Number.isFinite(g)?g:0),a=100,l=42,r=4,P=Math.max(...t,1),d=Math.min(...t,0),x=P-d||1,E=(a-r*2)/Math.max(1,t.length-1),n=t.map((g,c)=>{const h=r+E*c,v=(g-d)/x,b=r+(l-r*2)*(1-v);return{x:h,y:b}}),f=n.map(g=>`${g.x.toFixed(2)},${g.y.toFixed(2)}`).join(" "),u=`${r},${l-r} ${f} ${a-r},${l-r}`,B=s===void 0?n.length-1:s,I=Math.max(0,Math.min(B,n.length-1)),y=Math.floor(I),j=I-y,S=n.slice(0,y+1);if(j>0&&y<n.length-1){const g=n[y],c=n[y+1];S.push({x:g.x+(c.x-g.x)*j,y:g.y+(c.y-g.y)*j})}const A=S.map(g=>`${g.x.toFixed(2)},${g.y.toFixed(2)}`).join(" "),W=S[S.length-1];return{points:f,area:u,progress:A,marker:W}}function ge(e,s){return e?`
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
  `:'<div class="chart-empty">Pas encore assez de données.</div>'}function de(e){const s=Object.entries(e.games||{});if(!s.length)return{title:"Aucun jeu",duration:"0m"};const[t,a]=s.sort((r,P)=>(P[1].timePlayedMs||0)-(r[1].timePlayedMs||0))[0],l=L.games.find(r=>r.id===t);return{title:(l==null?void 0:l.title)||t,duration:w(a.timePlayedMs)}}function ts(e){return/^https?:\/\//i.test(e)||e.startsWith("blob:")||e.startsWith("data:")}function Ae(e,s){if(e){const t=e.trim();return ts(t)?t:pe(s||t)||null}return pe(s)||null}function as(e,s,t){const a=(s||"🎮").slice(0,4),l=Ae(e,t);return`<div class="avatar ${l?"has-image":""}">${l?`<img src="${l}" alt="Avatar" />`:a}</div>`}function we(){if(X)return null;const e=Ae(m.save.playerProfile.avatarUrl,m.save.playerProfile.avatarStoragePath);return V||e}function J(){V&&(URL.revokeObjectURL(V),V=null)}function oe(){const e=document.getElementById("profile-avatar-preview"),s=document.getElementById("profile-avatar-helper"),t=document.getElementById("profile-avatar-clear"),a=we(),l=m.save.playerProfile.avatar||"🎮",r=!!a;e&&(e.classList.toggle("has-image",r),e.innerHTML=r?`<img src="${a}" alt="Avatar" />`:l),s&&(s.textContent=Ee(r)),t&&(t.disabled=!r)}function he(e,s){const t=e.trim()||"Joueur",a=s.trim()||"🎮",l=o.user?m.save.playerProfile.name:t;ee(r=>{r.playerProfile.name=l.slice(0,18),r.playerProfile.avatar=a.slice(0,4),r.playerProfile.avatarType=r.playerProfile.avatarUrl?"image":"emoji"}),T()}function rs(){const e=qe(),s=new Blob([e],{type:"application/json"}),t=URL.createObjectURL(s),a=document.createElement("a");a.href=t,a.download="nintendo-hub-save.json",a.click(),URL.revokeObjectURL(t),$("Sauvegarde exportée","success")}async function ns(e){const s=ze(e);if(s.success)if($("Import réussi","success"),J(),U=null,X=!1,T(),o.user)try{const t=await $e(m.save,{allowEmpty:!0});$(t?"Sauvegarde cloud remplacée":o.error||"Erreur cloud",t?"success":"error")}catch(t){console.error("Cloud save failed after import",t),$("Erreur cloud","error")}else o.ready&&$("Connecte-toi pour envoyer l'import sur le cloud","info");else $(s.error||"Import impossible","error")}function fe(e){Ze(),e?(He(e),$(`Progression de ${e} réinitialisée`,"info")):(_e(),$("Progression globale réinitialisée","info")),J(),U=null,X=!1,T()}function is(e){ee(s=>{const t=new Set(s.favorites||[]);t.has(e)?t.delete(e):t.add(e),s.favorites=Array.from(t)}),T()}async function ls(){const e=ye();await $e(e.save)?(m=e,$("Sauvegarde envoyée sur le cloud","success")):o.error&&$(o.error,"error")}async function os(){await es()?($("Sauvegarde cloud importée","success"),J(),U=null,X=!1,T()):o.error?$(o.error,"error"):$("Import cloud impossible","error")}function cs(){return`
    <nav class="nav">
      <button class="nav-btn ${C==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${C==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${C==="stats"?"active":""}" data-tab="stats">Stats</button>
      <button class="nav-btn ${C==="profile"?"active":""}" data-tab="profile">Profil</button>
    </nav>
  `}function ds(e){return Oe(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${be("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function ps(){return`
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
                <span class="chip ${o.ready?"warning":"error"}">Cloud : ${o.ready?"non connecté":"Supabase non configuré"}</span>
                <span class="chip ghost">Saves verrouillées</span>
              </div>
            </div>
          </div>
        </div>
        ${o.ready?`<div class="gate-form">
                 <label>Identifiant <input id="gate-identifier" type="text" placeholder="mon-pseudo" /></label>
                 <label>Mot de passe <input id="gate-password" type="password" placeholder="8+ caractères" /></label>
                 <div class="gate-actions">
                   <button class="btn primary strong" id="gate-login" ${o.loading?"disabled":""}>Connexion</button>
                   <button class="btn ghost strong" id="gate-register" ${o.loading?"disabled":""}>Créer un compte</button>
                 </div>
                 ${o.error?`<p class="status error">${o.error}</p>`:'<p class="status info">Tes saves seront synchronisées entre appareils.</p>'}
               </div>`:'<p class="status error">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY puis recharge la page.</p>'}
      </header>
    </div>
  `}function us(){return`
    <div class="layout">
      <header class="card hero auth-gate">
        <div class="hero-glow"></div>
        <div class="hero-top">
          <div class="profile">
            <div class="avatar">☁️</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>Synchronisation cloud en cours</h1>
              <p class="muted">Chargement de ta sauvegarde avant d'accéder au hub.</p>
              <div class="chips">
                <span class="chip accent">Sauvegarde cloud</span>
                <span class="chip ghost">${o.loading?"Chargement...":"En attente"}</span>
              </div>
            </div>
          </div>
        </div>
        ${o.error?`<p class="status error">${o.error}</p>`:""}
      </header>
    </div>
  `}function vs(){var f;const e=m.save,s=e.achievementsUnlocked.length,t=q.achievements.length,a=e.globalLevel>ce,l=`--progress:${m.levelProgress*100}%`,r=w(e.globalStats.timePlayedMs),P=e.globalStats.totalSessions,d=e.playerProfile.lastPlayedGameId&&((f=L.games.find(u=>u.id===e.playerProfile.lastPlayedGameId))==null?void 0:f.title);ce=e.globalLevel;const x=de(e),E=o.user?xe():e.playerProfile.name||"Joueur",n=d?`Dernier jeu : ${d}`:"Aucun jeu lancé";return`
    <header class="card hero hero-premium">
      <div class="hero-glow"></div>
      <div class="hero-top hero-premium-top">
        <div class="profile hero-profile">
          ${as(e.playerProfile.avatarUrl,e.playerProfile.avatar,e.playerProfile.avatarStoragePath)}
          <div class="hero-identity">
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${E}</h1>
            <p class="hero-subtitle">${n}</p>
            <div class="hero-badges">
              <span class="hero-badge">⏱ ${r}</span>
              <span class="hero-badge">🎮 ${P} sessions</span>
            </div>
          </div>
        </div>
        <div class="stat-grid compact hero-stats">
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
            <p class="muted small">Sessions ${P}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${x.title}</strong>
            <p class="muted small">Temps ${x.duration}</p>
          </div>
        </div>
      </div>
      ${ds(e)}
      <div class="level-row hero-progress ${a?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${l}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(m.levelProgress*100)}% · ${m.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <p class="muted small hero-note">Profil accessible via l'onglet Profil.</p>
    </header>
  `}function ms(){const e=L.games.length?[]:["games.registry.json vide ou invalide"],s=new Set(m.save.favorites||[]),t=Array.from(new Set(L.games.flatMap(n=>n.tags||[]).filter(Boolean))).sort((n,f)=>n.localeCompare(f,"fr")),a=se.trim().toLowerCase(),l=se.replace(/"/g,"&quot;"),r=L.games.filter(n=>D?s.has(n.id):!0).filter(n=>G==="all"?!0:(n.tags||[]).includes(G)).filter(n=>a?n.title.toLowerCase().includes(a)||n.description.toLowerCase().includes(a)||n.id.toLowerCase().includes(a):!0).sort((n,f)=>{const u=Number(s.has(f.id))-Number(s.has(n.id));return u!==0?u:(n.order??0)-(f.order??0)}),P=r.map(n=>{Pe.find(A=>A.id===n.id)||e.push(`Config manquante pour ${n.id}`);const u=m.save.games[n.id],B=u!=null&&u.lastPlayedAt?te(u.lastPlayedAt):"Jamais",I=(u==null?void 0:u.bestScore)??null,y=w(u==null?void 0:u.timePlayedMs),j=be(`/apps/games/${n.id}/`),S=s.has(n.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${n.previewEmoji||"🎮"} ${n.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${S?"active":""}" data-game="${n.id}" title="${S?"Retirer des favoris":"Ajouter aux favoris"}">
                ${S?"★":"☆"}
              </button>
              <span class="muted">MAJ ${n.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${n.description}</p>
          <div class="tags">${n.tags.map(A=>`<span class="tag">${A}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${y}</span>
            <span class="chip ghost">🏆 ${I??"—"}</span>
            <span class="chip ghost">🕘 ${B}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${j}" data-game="${n.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${n.id}">Aide</button>
          </div>
        </article>
      `}).join(""),d=D||G!=="all"||!!a,x=r.length,E=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
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
            value="${l}"
          />
        </div>
        <div class="filter group">
          <button class="chip-btn ${G==="all"?"active":""}" data-category="all">Toutes</button>
          ${t.map(n=>`<button class="chip-btn ${n===G?"active":""}" data-category="${n}">${n}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${D?"active":""}" id="filter-fav">
            ★ Favoris ${s.size?`<span class="badge">${s.size}</span>`:""}
          </button>
          <span class="muted small">${x}/${L.games.length} jeux</span>
          ${d?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${E}
      <div class="grid">${P||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function gs(){const e=new Set(m.save.achievementsUnlocked),s=q.achievements.length,t=s?Math.round(e.size/s*100):0,a=m.save.playerProfile.achievementMessage||"",l=a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),r=a.trim()?l:"Ecris un message pour Alexiane.",P=q.achievements.map(d=>`
        <article class="card achievement ${e.has(d.id)?"unlocked":""}">
          <div class="pill accent">${d.icon||"⭐️"}</div>
          <div>
            <h3>${d.title}</h3>
            <p>${d.description}</p>
            <p class="muted">${hs(d)}</p>
          </div>
          <div class="reward">+${d.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${s} débloqués</p>
        </div>
        <div class="pill accent">✨ ${t}%</div>
      </div>
      <div class="achievement-spotlight">
        <div class="card achievement-message">
          <div class="card-top">
            <div>
              <p class="eyebrow">Message perso</p>
              <h3>Pour Alexiane</h3>
              <p class="muted small">Un mot doux qui s'affiche dans la collection.</p>
            </div>
            <span class="chip ghost">Privé</span>
          </div>
          <textarea id="achievement-note" placeholder="Alexiane, ...">${l}</textarea>
          <div class="message-preview">
            <span class="label">Aperçu</span>
            <p id="achievement-note-preview">${r}</p>
          </div>
        </div>
        <div class="card achievement-progress">
          <p class="eyebrow">Progression</p>
          <h3>${e.size} succès</h3>
          <div class="progress-ring" style="--progress:${t}">
            <span>${t}%</span>
          </div>
          <p class="muted small">${s} objectifs pour une collection premium.</p>
        </div>
      </div>
      <div class="stack">${P}</div>
    </section>
  `}function hs(e){const s=e.condition;return s.type==="eventCount"?`${s.count}x ${s.event}`:s.type==="xpReached"?`${s.xp} XP globaux`:s.type==="gamesPlayed"?`${s.count} jeux différents`:s.type==="streak"?`${s.count} ${s.event} d'affilée`:s.type==="playerXpName"?`${s.xp} XP et pseudo "${s.name}"`:""}function fs(){const e=m.save,t=Object.entries(e.games||{}).map(([i,p])=>{var O;const M=((O=L.games.find(_=>_.id===i))==null?void 0:O.title)||i;return{id:i,title:M,timePlayedMs:p.timePlayedMs??0,bestScore:p.bestScore,xpEarned:p.xpEarned??0,lastPlayedAt:p.lastPlayedAt??0}}),a=t.length,l=e.globalStats.timePlayedMs??0,r=e.globalStats.totalSessions??0,P=r?l/r:0,d=e.globalStats.events.SESSION_WIN??0,x=e.globalStats.events.SESSION_FAIL??0,E=d+x>0?Math.round(d/(d+x)*100):0,n=e.achievementsUnlocked.length,f=q.achievements.length,u=f?Math.round(n/f*100):0,B=Math.max(0,...Object.values(e.globalStats.streaks||{})),I=[...t].sort((i,p)=>p.timePlayedMs-i.timePlayedMs),y=[...t].filter(i=>i.lastPlayedAt).sort((i,p)=>p.lastPlayedAt-i.lastPlayedAt)[0],j=(y==null?void 0:y.title)||"Aucun jeu",S=y!=null&&y.lastPlayedAt?te(y.lastPlayedAt):"Jamais",A=de(e),g=[...De().levels].sort((i,p)=>i.level-p.level),c=g.map(i=>i.requiredXP),v=Math.max(0,g.findIndex(i=>i.level===e.globalLevel))+m.levelProgress,b=me(c,v),F=Math.round(m.levelProgress*100),k=Math.max(0,m.nextLevelXP-e.globalXP),ae=[...t].filter(i=>i.lastPlayedAt).sort((i,p)=>i.lastPlayedAt-p.lastPlayedAt).slice(-8),re=ae.length>=2?ae:I.filter(i=>i.timePlayedMs>0).slice(0,8),Le=re.map(i=>i.timePlayedMs),Ie=me(Le),je=ae.length>=2?"Derniers jeux lancés":"Top temps de jeu",Me=re.length?`<div class="curve-labels">
        ${re.map(i=>`<span title="${i.title}">${ss(i.title)}</span>`).join("")}
      </div>`:"",H=t.reduce((i,p)=>i+p.timePlayedMs,0),K=I.filter(i=>i.timePlayedMs>0).slice(0,5),Ce=K.reduce((i,p)=>i+p.timePlayedMs,0),Y=Math.max(0,H-Ce),Q=["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)","var(--chart-6)"];let ne="",Z="";if(H>0&&K.length){let i=0;const p=K.map((M,O)=>{const _=M.timePlayedMs/H*100,Ue=i;return i+=_,`${Q[O%Q.length]} ${Ue.toFixed(2)}% ${i.toFixed(2)}%`});if(Y>0&&p.push(`var(--chart-6) ${i.toFixed(2)}% 100%`),ne=`style="--donut: conic-gradient(${p.join(", ")})"`,Z=K.map((M,O)=>{const _=Math.round(M.timePlayedMs/H*100);return`
          <div class="legend-item">
            <span class="legend-dot" style="--dot:${Q[O%Q.length]}"></span>
            <div>
              <strong>${M.title}</strong>
              <p class="muted small">${w(M.timePlayedMs)} · ${_}%</p>
            </div>
          </div>
        `}).join(""),Y>0){const M=Math.round(Y/H*100);Z+=`
        <div class="legend-item">
          <span class="legend-dot" style="--dot:var(--chart-6)"></span>
          <div>
            <strong>Autres</strong>
            <p class="muted small">${w(Y)} · ${M}%</p>
          </div>
        </div>
      `}}else Z='<p class="muted">Pas encore de temps de jeu enregistré.</p>',ne='style="--donut: conic-gradient(rgba(255, 255, 255, 0.08) 0 100%)"';const ie=[...t].filter(i=>i.xpEarned>0).sort((i,p)=>p.xpEarned-i.xpEarned).slice(0,6),Te=Math.max(1,...ie.map(i=>i.xpEarned)),Be=ie.length?ie.map(i=>{const p=i.xpEarned,M=Math.max(6,Math.round(p/Te*100));return`
            <div class="score-row">
              <div class="score-info">
                <strong>${i.title}</strong>
                <span class="muted small">${w(i.timePlayedMs)} joués</span>
              </div>
              <div class="score-bar"><span style="width:${M}%"></span></div>
              <div class="score-value">${R(p)} XP</div>
            </div>
          `}).join(""):'<p class="muted">Aucune XP enregistrée pour le moment.</p>';return`
    <section class="card stats-kpi">
      <div class="section-head">
        <div>
          <p class="eyebrow">Stats</p>
          <h2>Dashboard KPI</h2>
          <p class="muted">Vue globale, progression et performance par jeu.</p>
        </div>
        <div class="kpi-badges">
          <span class="chip ghost">Dernier : ${j}</span>
          <span class="chip ghost">Dernière activité : ${S}</span>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card" style="--kpi-accent: var(--chart-1)">
          <div class="kpi-top">
            <span class="kpi-icon">⏱</span>
            <span class="kpi-label">Temps total</span>
          </div>
          <strong>${w(l)}</strong>
          <p class="muted small">Session moyenne ${w(P)}</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-2)">
          <div class="kpi-top">
            <span class="kpi-icon">🎮</span>
            <span class="kpi-label">Sessions</span>
          </div>
          <strong>${R(r)}</strong>
          <p class="muted small">${d} victoires · ${x} défaites</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-3)">
          <div class="kpi-top">
            <span class="kpi-icon">⚡</span>
            <span class="kpi-label">XP globale</span>
          </div>
          <strong>${R(e.globalXP)} XP</strong>
          <p class="muted small">Niveau ${e.globalLevel} · ${F}%</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-4)">
          <div class="kpi-top">
            <span class="kpi-icon">🧩</span>
            <span class="kpi-label">Jeux joués</span>
          </div>
          <strong>${a}/${L.games.length}</strong>
          <p class="muted small">Top : ${A.title}</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-5)">
          <div class="kpi-top">
            <span class="kpi-icon">🏆</span>
            <span class="kpi-label">Succès</span>
          </div>
          <strong>${n}/${f}</strong>
          <p class="muted small">${u}% complétés</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-6)">
          <div class="kpi-top">
            <span class="kpi-icon">📈</span>
            <span class="kpi-label">Performance</span>
          </div>
          <strong>${E}%</strong>
          <p class="muted small">Streak max ${B}</p>
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
              <p class="muted small">Prochain niveau : ${R(m.nextLevelXP)} XP</p>
            </div>
            <span class="chip ghost">+${R(k)} XP</span>
          </div>
          ${ge(b,"xp-curve")}
          <div class="curve-metrics">
            <div>
              <span class="label">XP globale</span>
              <strong>${R(e.globalXP)}</strong>
            </div>
            <div>
              <span class="label">Progression</span>
              <strong>${F}%</strong>
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
              <p class="muted small">${je}</p>
            </div>
            <span class="chip ghost">${E}% win</span>
          </div>
          ${ge(Ie,"activity-curve")}
          ${Me}
          <div class="curve-metrics">
            <div>
              <span class="label">Sessions</span>
              <strong>${R(r)}</strong>
            </div>
            <div>
              <span class="label">Temps total</span>
              <strong>${w(l)}</strong>
            </div>
            <div>
              <span class="label">Jeu top</span>
              <strong>${A.title}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="card stats-diagrams">
      <div class="section-head">
        <div>
          <p class="eyebrow">Jeux</p>
          <h2>Diagrammes & XP</h2>
          <p class="muted">Répartition des jeux les plus joués et XP générée.</p>
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
            <div class="donut" ${ne}></div>
            <div class="donut-center">
              <span class="label">Temps total</span>
              <strong>${w(l)}</strong>
              <p class="muted small">${a} jeux</p>
            </div>
          </div>
          <div class="donut-legend">
            ${Z}
          </div>
        </article>
        <article class="diagram-card">
          <div class="diagram-head">
            <div>
              <h3>XP générée</h3>
              <p class="muted small">Top jeux par XP gagnée.</p>
            </div>
          </div>
          <div class="score-list">
            ${Be}
          </div>
        </article>
      </div>
    </section>
  `}function ys(){var d;const e=m.save,s=Object.entries(e.games||{}),t=de(e),a=o.lastSyncedAt?te(o.lastSyncedAt):"Jamais",l=e.playerProfile.lastPlayedGameId&&((d=L.games.find(x=>x.id===e.playerProfile.lastPlayedGameId))==null?void 0:d.title),r=we(),P=Ee(!!r);return`
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
          <p class="muted small" id="profile-avatar-helper">${P}</p>
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
              <strong>${l||"Aucun jeu lancé"}</strong>
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
          <p class="muted small">Sauvegarde cloud (source de vérité) liée à ton compte.</p>
        </div>
        <span class="chip success">Connecté : ${xe()}</span>
      </div>
      <div class="actions-grid">
        <button class="btn primary" id="cloud-save" ${o.loading?"disabled":""}>Sauvegarder vers cloud</button>
        <button class="btn ghost" id="cloud-load" ${o.loading?"disabled":""}>Charger depuis cloud</button>
        <button class="btn ghost danger" id="cloud-logout" ${o.loading?"disabled":""}>Déconnexion</button>
      </div>
      <p class="muted small">Dernière synchro : ${a}</p>
      ${o.message?`<p class="status ok">${o.message}</p>`:'<p class="status info">Synchronisation cloud active.</p>'}
      ${o.error?`<p class="status error">${o.error}</p>`:""}
    </section>

    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Sauvegardes</p>
          <h2>Export / Import</h2>
          <p class="muted small">Exporter, importer ou remettre à zéro ta progression.</p>
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
          <strong>${w(e.globalStats.timePlayedMs)}</strong>
        </div>
        <div>
          <span class="label">Jeux joués</span>
          <strong>${Object.keys(e.games).length}/${L.games.length}</strong>
        </div>
        <div>
          <span class="label">Succès</span>
          <strong>${e.achievementsUnlocked.length}/${q.achievements.length}</strong>
        </div>
      </div>
      <div class="save-list">
        ${s.length?s.map(([x,E])=>`
          <div class="save-row">
            <div>
              <strong>${x}</strong>
              <p class="muted small">v${E.saveSchemaVersion} · Dernier : ${te(E.lastPlayedAt)}</p>
            </div>
            <div class="chips-row">
              <span class="chip ghost">⏱ ${w(E.timePlayedMs)}</span>
              <span class="chip ghost">🏆 ${E.bestScore??"—"}</span>
            </div>
          </div>
        `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
      </div>
    </section>
  `}function N(){if(!o.ready||!o.user){le.innerHTML=ps(),bs();return}if(!o.hydrated){le.innerHTML=us();return}le.innerHTML=`
    <div class="layout">
      ${cs()}
      ${vs()}
      ${C==="hub"?ms():""}
      ${C==="achievements"?gs():""}
      ${C==="stats"?fs():""}
      ${C==="profile"?ys():""}
    </div>
  `,$s()}function bs(){const e=document.getElementById("gate-login"),s=document.getElementById("gate-register");e==null||e.addEventListener("click",async()=>{var l,r;const t=((l=document.getElementById("gate-identifier"))==null?void 0:l.value)||"",a=((r=document.getElementById("gate-password"))==null?void 0:r.value)||"";await z("login",{identifier:t,password:a})}),s==null||s.addEventListener("click",async()=>{var l,r;const t=((l=document.getElementById("gate-identifier"))==null?void 0:l.value)||"",a=((r=document.getElementById("gate-password"))==null?void 0:r.value)||"";await z("register",{identifier:t,password:a})})}function $s(){document.querySelectorAll(".nav-btn").forEach(c=>{c.addEventListener("click",()=>{C=c.dataset.tab,N()})});const e=document.getElementById("open-profile");e==null||e.addEventListener("click",()=>{C="profile",N()});const s=document.getElementById("player-name"),t=document.getElementById("player-avatar");s&&t&&C!=="profile"&&(s.addEventListener("change",()=>he(s.value,(t==null?void 0:t.value)||"🎮")),t.addEventListener("change",()=>he((s==null?void 0:s.value)||"Joueur",t.value)));const a=document.getElementById("achievement-note"),l=document.getElementById("achievement-note-preview");a==null||a.addEventListener("input",()=>{const c=a.value.slice(0,280);a.value!==c&&(a.value=c),ee(h=>{h.playerProfile.achievementMessage=c}),l&&(l.textContent=c.trim()?c:"Ecris un message pour Alexiane.")}),document.querySelectorAll(".help-btn").forEach(c=>{c.addEventListener("click",()=>{const h=c.dataset.help,v=Pe.find(b=>b.id===h);v&&$(v.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(c=>{c.addEventListener("click",()=>{const h=c.dataset.game;h&&is(h)})});const r=document.getElementById("export-save");r==null||r.addEventListener("click",rs);const P=document.getElementById("reset-save");P==null||P.addEventListener("click",()=>fe()),document.querySelectorAll(".reset-game").forEach(c=>{c.addEventListener("click",()=>{const h=c.dataset.game;fe(h)})});const d=document.getElementById("import-btn"),x=document.getElementById("import-text");d==null||d.addEventListener("click",()=>x&&ns(x.value));const E=document.getElementById("cloud-login"),n=document.getElementById("cloud-register"),f=document.getElementById("cloud-logout"),u=document.getElementById("cloud-save"),B=document.getElementById("cloud-load");E==null||E.addEventListener("click",async()=>{var v,b;const c=((v=document.getElementById("cloud-identifier"))==null?void 0:v.value)||"",h=((b=document.getElementById("cloud-password"))==null?void 0:b.value)||"";await z("login",{identifier:c,password:h})}),n==null||n.addEventListener("click",async()=>{var v,b;const c=((v=document.getElementById("cloud-identifier"))==null?void 0:v.value)||"",h=((b=document.getElementById("cloud-password"))==null?void 0:b.value)||"";await z("register",{identifier:c,password:h})}),f==null||f.addEventListener("click",async()=>{await z("logout"),U=null,X=!1,J()}),u==null||u.addEventListener("click",ls),B==null||B.addEventListener("click",os);const I=document.getElementById("profile-avatar-upload"),y=document.getElementById("profile-avatar-clear"),j=document.getElementById("profile-save");I==null||I.addEventListener("change",c=>{var b;const h=c.target,v=(b=h.files)==null?void 0:b[0];if(v){if(!v.type.startsWith("image/")){$("Seules les images sont autorisées.","error"),h.value="";return}if(v.size>1.5*1024*1024){$("Image trop lourde (1.5 Mo max).","error"),h.value="";return}J(),U=v,V=URL.createObjectURL(v),X=!1,oe()}}),y==null||y.addEventListener("click",()=>{X=!0,U=null,J(),oe()}),j==null||j.addEventListener("click",async()=>{const c=document.getElementById("player-avatar"),h=((c==null?void 0:c.value)||"🎮").slice(0,4),v=m.save.playerProfile.avatarStoragePath;let b=m.save.playerProfile.avatarUrl,F=v;if(U){const k=await Ye(U,v||void 0);if(!k.url||!k.path||k.error){$(k.error||"Upload avatar impossible","error");return}b=k.url,F=k.path}else X&&(b=void 0,F=void 0,v&&o.ready&&o.user&&await Qe(v));ee(k=>{k.playerProfile.avatar=h,k.playerProfile.avatarUrl=b,k.playerProfile.avatarStoragePath=F,k.playerProfile.avatarType=b?"image":"emoji"}),U=null,X=!1,J(),$("Profil mis à jour","success"),T()});const S=document.getElementById("search-games"),A=document.getElementById("filter-fav"),W=Array.from(document.querySelectorAll(".chip-btn[data-category]")),g=document.getElementById("clear-filters");S==null||S.addEventListener("input",()=>{se=S.value,N()}),W.forEach(c=>{c.addEventListener("click",()=>{G=c.dataset.category||"all",N()})}),A==null||A.addEventListener("click",()=>{D=!D,N()}),g==null||g.addEventListener("click",()=>{se="",G="all",D=!1,N()}),oe()}function T(){if(!o.ready||!o.user||!o.hydrated){N();return}const e=ye();ve||(ce=e.save.globalLevel,ve=!0),m=e,ke(Se(L.hubTheme)),N()}window.addEventListener("pageshow",()=>{T()});document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&T()});T();
