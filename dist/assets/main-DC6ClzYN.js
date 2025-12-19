import{a as F,b as H,d as z,e as K,g as T,f as Y,o as W,w as B,c as Q,u as q,h as Z,r as ee,i as se,j as J,A as te}from"./index-Bc-Kp7-P.js";import{s as ae,g as ne,c as x,a as oe,l as ie}from"./cloud-10MdCNZ0.js";const U=document.getElementById("app"),h=F(),k=H(),O=z(),N=K();let w="hub",v=T(),R=v.save.globalLevel,o=ne(),I="",S="all",P=!1;function X(){var n;const e=o.user;if(!e)return"connecté";const s=(n=e.user_metadata)==null?void 0:n.identifier,t=e.email;return s||(t!=null&&t.endsWith("@user.local")?t.replace("@user.local",""):t||"connecté")}Y();V(D(h.hubTheme));ae(e=>{o=e,$()});W("ACHIEVEMENT_UNLOCKED",e=>{var n;const s=(n=e.payload)==null?void 0:n.achievementId,t=k.achievements.find(i=>i.id===s);t&&g(`Succès débloqué : ${t.title}`,"success"),s===te.achievementId&&A()});function D(e){return e?N.find(s=>s.id===e):N[0]}function V(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function g(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),300)},2600)}function M(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function C(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),n=Math.floor(s%3600/60),i=s%60;return t?`${t}h ${n}m`:n?`${n}m ${i}s`:`${i}s`}function re(e){const s=Object.entries(e.games||{});if(!s.length)return{title:"Aucun jeu",duration:"0m"};const[t,n]=s.sort((r,f)=>(f[1].timePlayedMs||0)-(r[1].timePlayedMs||0))[0],i=h.games.find(r=>r.id===t);return{title:(i==null?void 0:i.title)||t,duration:C(n.timePlayedMs)}}function G(e,s){const t=e.trim()||"Joueur",n=s.trim()||"🎮",i=o.user?v.save.playerProfile.name:t;q(r=>{r.playerProfile.name=i.slice(0,18),r.playerProfile.avatar=n.slice(0,4)}),A()}function ce(){const e=Z(),s=new Blob([e],{type:"application/json"}),t=URL.createObjectURL(s),n=document.createElement("a");n.href=t,n.download="nintendo-hub-save.json",n.click(),URL.revokeObjectURL(t),g("Sauvegarde exportée","success")}function le(e){const s=J(e);s.success?(g("Import réussi","success"),A()):g(s.error||"Import impossible","error")}function _(e){e?(ee(e),g(`Progression de ${e} réinitialisée`,"info")):(se(),g("Progression globale réinitialisée","info")),A()}function de(e){q(s=>{const t=new Set(s.favorites||[]);t.has(e)?t.delete(e):t.add(e),s.favorites=Array.from(t)}),A()}async function ue(){const e=T();await oe(e.save)?(v=e,g("Sauvegarde envoyée sur le cloud","success")):o.error&&g(o.error,"error")}async function pe(){const e=await ie();e!=null&&e.state?(J(JSON.stringify(e.state)),g("Sauvegarde cloud importée","success"),A()):e!=null&&e.error&&g(e.error,"error")}function ve(){return`
    <nav class="nav">
      <button class="nav-btn ${w==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${w==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${w==="saves"?"active":""}" data-tab="saves">Saves</button>
    </nav>
  `}function me(e){return Q(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${B("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function ge(){return`
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
  `}function fe(){var d;const e=v.save,s=e.achievementsUnlocked.length,t=k.achievements.length,n=e.globalLevel>R,i=`--progress:${v.levelProgress*100}%`,r=C(e.globalStats.timePlayedMs),f=e.globalStats.totalSessions,b=e.playerProfile.lastPlayedGameId&&((d=h.games.find(l=>l.id===e.playerProfile.lastPlayedGameId))==null?void 0:d.title);R=e.globalLevel;const E=B("/apps/profil/"),y=re(e),a=o.user?`<span class="chip success">Cloud : ${X()}</span>`:o.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          <div class="avatar">${e.playerProfile.avatar||"🎮"}</div>
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${b?`Dernier jeu : ${b}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${a}
              <span class="chip">⏱ ${r}</span>
              <span class="chip">🎮 ${f} sessions</span>
            </div>
            <div class="profile-actions">
              <a class="btn primary strong" href="${E}">Voir le profil</a>
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
            <p class="muted small">Sessions ${f}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${y.title}</strong>
            <p class="muted small">Temps ${y.duration}</p>
          </div>
        </div>
      </div>
      ${me(e)}
      <div class="level-row ${n?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${i}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(v.levelProgress*100)}% · ${v.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <p class="muted small hero-note">Profil éditable depuis la page dédiée.</p>
    </header>
  `}function he(){const e=h.games.length?[]:["games.registry.json vide ou invalide"],s=new Set(v.save.favorites||[]),t=Array.from(new Set(h.games.flatMap(a=>a.tags||[]).filter(Boolean))).sort((a,d)=>a.localeCompare(d,"fr")),n=I.trim().toLowerCase(),i=I.replace(/"/g,"&quot;"),r=h.games.filter(a=>P?s.has(a.id):!0).filter(a=>S==="all"?!0:(a.tags||[]).includes(S)).filter(a=>n?a.title.toLowerCase().includes(n)||a.description.toLowerCase().includes(n)||a.id.toLowerCase().includes(n):!0).sort((a,d)=>{const l=Number(s.has(d.id))-Number(s.has(a.id));return l!==0?l:(a.order??0)-(d.order??0)}),f=r.map(a=>{O.find(m=>m.id===a.id)||e.push(`Config manquante pour ${a.id}`);const l=v.save.games[a.id],j=l!=null&&l.lastPlayedAt?M(l.lastPlayedAt):"Jamais",L=(l==null?void 0:l.bestScore)??null,c=C(l==null?void 0:l.timePlayedMs),u=B(`/apps/games/${a.id}/`),p=s.has(a.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${a.previewEmoji||"🎮"} ${a.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${p?"active":""}" data-game="${a.id}" title="${p?"Retirer des favoris":"Ajouter aux favoris"}">
                ${p?"★":"☆"}
              </button>
              <span class="muted">MAJ ${a.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${a.description}</p>
          <div class="tags">${a.tags.map(m=>`<span class="tag">${m}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${c}</span>
            <span class="chip ghost">🏆 ${L??"—"}</span>
            <span class="chip ghost">🕘 ${j}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${u}" data-game="${a.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${a.id}">Aide</button>
          </div>
        </article>
      `}).join(""),b=P||S!=="all"||!!n,E=r.length,y=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
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
          <button class="chip-btn ${S==="all"?"active":""}" data-category="all">Toutes</button>
          ${t.map(a=>`<button class="chip-btn ${a===S?"active":""}" data-category="${a}">${a}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${P?"active":""}" id="filter-fav">
            ★ Favoris ${s.size?`<span class="badge">${s.size}</span>`:""}
          </button>
          <span class="muted small">${E}/${h.games.length} jeux</span>
          ${b?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${y}
      <div class="grid">${f||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function be(){const e=new Set(v.save.achievementsUnlocked),s=k.achievements.map(t=>`
        <article class="card achievement ${e.has(t.id)?"unlocked":""}">
          <div class="pill accent">${t.icon||"⭐️"}</div>
          <div>
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <p class="muted">${ye(t)}</p>
          </div>
          <div class="reward">+${t.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${k.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${s}</div>
    </section>
  `}function ye(e){const s=e.condition;return s.type==="eventCount"?`${s.count}x ${s.event}`:s.type==="xpReached"?`${s.xp} XP globaux`:s.type==="gamesPlayed"?`${s.count} jeux différents`:s.type==="streak"?`${s.count} ${s.event} d'affilée`:s.type==="playerXpName"?`${s.xp} XP et pseudo "${s.name}"`:""}function $e(){return o.ready?o.user?`
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Connecté</h2>
            <p class="muted">Identifiant : ${X()}</p>
          </div>
          <span class="chip ghost">Dernière sync ${o.lastSyncedAt?M(o.lastSyncedAt):"Jamais"}</span>
        </div>
        <div class="actions wrap">
          <button class="btn primary" id="cloud-save" ${o.loading?"disabled":""}>Sauvegarder vers cloud</button>
          <button class="btn ghost" id="cloud-load" ${o.loading?"disabled":""}>Charger depuis cloud</button>
          <button class="btn ghost danger" id="cloud-logout" ${o.loading?"disabled":""}>Déconnexion</button>
        </div>
        ${o.message?`<p class="status ok">${o.message}</p>`:'<p class="status info">Synchronise tes saves entre appareils.</p>'}
        ${o.error?`<p class="status error">${o.error}</p>`:""}
      </section>
    `:`
    <section class="card cloud">
      <div class="section-head">
        <div>
          <p class="eyebrow">Cloud</p>
          <h2>Supabase</h2>
          <p class="muted small">Créé pour rester optionnel : invité/local ou compte cloud.</p>
        </div>
      </div>
      <div class="profile-form two-cols">
        <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
        <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
      </div>
      <div class="actions wrap">
        <button class="btn primary" id="cloud-login" ${o.loading?"disabled":""}>Connexion</button>
        <button class="btn ghost" id="cloud-register" ${o.loading?"disabled":""}>Créer un compte</button>
      </div>
      ${o.error?`<p class="status error">${o.error}</p>`:`<p class="status info">Aucune donnée n'est envoyée sans action manuelle.</p>`}
    </section>
  `:`
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Supabase</h2>
            <p class="muted">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer la synchro.</p>
          </div>
          <span class="chip warning">Inactif</span>
        </div>
      </section>
    `}function Ee(){const e=v.save,t=Object.entries(e.games).map(([n,i])=>`
        <div class="save-row">
          <div>
            <strong>${n}</strong>
            <p class="muted">v${i.saveSchemaVersion} · Dernier : ${M(i.lastPlayedAt)}</p>
          </div>
          <div class="row-meta">
            <span class="chip ghost">⏱ ${C(i.timePlayedMs)}</span>
            <button class="btn ghost reset-game" data-game="${n}">Reset</button>
          </div>
        </div>
      `).join("");return`
    <div class="panel-grid">
      <section class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Saves</p>
            <h2>Gestion</h2>
            <p class="muted">Schema v${e.schemaVersion}</p>
          </div>
          <div class="actions">
            <button class="btn ghost" id="export-save">Exporter</button>
            <button class="btn ghost danger" id="reset-save">Reset global</button>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${C(e.globalStats.timePlayedMs)}</strong>
          </div>
          <div class="stat-card">
            <p class="label">Jeux joués</p>
            <strong>${Object.keys(e.games).length}/${h.games.length}</strong>
          </div>
          <div class="stat-card">
            <p class="label">Sessions</p>
            <strong>${e.globalStats.totalSessions}</strong>
          </div>
        </div>
        <label class="import">
          Import JSON
          <textarea id="import-text" placeholder="Colle ici ta sauvegarde"></textarea>
          <button class="btn primary" id="import-btn">Importer</button>
        </label>
      </section>
      ${$e()}
    </div>
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Par jeu</p>
          <h2>Saves détaillées</h2>
        </div>
      </div>
      <div class="save-list">
        ${t||"<p class='muted'>Aucune save par jeu pour le moment.</p>"}
      </div>
    </section>
  `}function $(){if(!o.user){U.innerHTML=ge(),Se();return}U.innerHTML=`
    <div class="layout">
      ${ve()}
      ${fe()}
      ${w==="hub"?he():""}
      ${w==="achievements"?be():""}
      ${w==="saves"?Ee():""}
    </div>
  `,we()}function Se(){const e=document.getElementById("gate-login"),s=document.getElementById("gate-register");e==null||e.addEventListener("click",async()=>{var i,r;const t=((i=document.getElementById("gate-identifier"))==null?void 0:i.value)||"",n=((r=document.getElementById("gate-password"))==null?void 0:r.value)||"";await x("login",{identifier:t,password:n})}),s==null||s.addEventListener("click",async()=>{var i,r;const t=((i=document.getElementById("gate-identifier"))==null?void 0:i.value)||"",n=((r=document.getElementById("gate-password"))==null?void 0:r.value)||"";await x("register",{identifier:t,password:n})})}function we(){document.querySelectorAll(".nav-btn").forEach(c=>{c.addEventListener("click",()=>{w=c.dataset.tab,$()})});const e=document.getElementById("player-name"),s=document.getElementById("player-avatar");e==null||e.addEventListener("change",()=>G(e.value,(s==null?void 0:s.value)||"🎮")),s==null||s.addEventListener("change",()=>G((e==null?void 0:e.value)||"Joueur",s.value)),document.querySelectorAll(".help-btn").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.help,p=O.find(m=>m.id===u);p&&g(p.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.game;u&&de(u)})});const t=document.getElementById("export-save");t==null||t.addEventListener("click",ce);const n=document.getElementById("reset-save");n==null||n.addEventListener("click",()=>_()),document.querySelectorAll(".reset-game").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.game;_(u)})});const i=document.getElementById("import-btn"),r=document.getElementById("import-text");i==null||i.addEventListener("click",()=>r&&le(r.value));const f=document.getElementById("cloud-login"),b=document.getElementById("cloud-register"),E=document.getElementById("cloud-logout"),y=document.getElementById("cloud-save"),a=document.getElementById("cloud-load");f==null||f.addEventListener("click",async()=>{var p,m;const c=((p=document.getElementById("cloud-identifier"))==null?void 0:p.value)||"",u=((m=document.getElementById("cloud-password"))==null?void 0:m.value)||"";await x("login",{identifier:c,password:u})}),b==null||b.addEventListener("click",async()=>{var p,m;const c=((p=document.getElementById("cloud-identifier"))==null?void 0:p.value)||"",u=((m=document.getElementById("cloud-password"))==null?void 0:m.value)||"";await x("register",{identifier:c,password:u})}),E==null||E.addEventListener("click",async()=>{await x("logout")}),y==null||y.addEventListener("click",ue),a==null||a.addEventListener("click",pe);const d=document.getElementById("search-games"),l=document.getElementById("filter-fav"),j=Array.from(document.querySelectorAll(".chip-btn[data-category]")),L=document.getElementById("clear-filters");d==null||d.addEventListener("input",()=>{I=d.value,$()}),j.forEach(c=>{c.addEventListener("click",()=>{S=c.dataset.category||"all",$()})}),l==null||l.addEventListener("click",()=>{P=!P,$()}),L==null||L.addEventListener("click",()=>{I="",S="all",P=!1,$()})}function A(){v=T(),V(D(h.hubTheme)),$()}$();
