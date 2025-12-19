import{a as H,b as z,d as K,e as Y,g as U,f as W,o as Q,w as B,c as Z,u as O,h as ee,r as se,i as te,j as X,A as ae}from"./index-Bc-Kp7-P.js";import{s as ne,g as oe,c as x,a as ie,l as re}from"./cloud-10MdCNZ0.js";const R=document.getElementById("app"),b=H(),k=z(),J=K(),M=Y();let y="hub",v=U(),_=v.save.globalLevel,o=oe(),I="",w="all",P=!1;function D(){var n;const e=o.user;if(!e)return"connecté";const s=(n=e.user_metadata)==null?void 0:n.identifier,t=e.email;return s||(t!=null&&t.endsWith("@user.local")?t.replace("@user.local",""):t||"connecté")}W();F(V(b.hubTheme));ne(e=>{o=e,g()});Q("ACHIEVEMENT_UNLOCKED",e=>{var n;const s=(n=e.payload)==null?void 0:n.achievementId,t=k.achievements.find(i=>i.id===s);t&&m(`Succès débloqué : ${t.title}`,"success"),s===ae.achievementId&&A()});function V(e){return e?M.find(s=>s.id===e):M[0]}function F(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function m(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),300)},2600)}function N(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function j(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),n=Math.floor(s%3600/60),i=s%60;return t?`${t}h ${n}m`:n?`${n}m ${i}s`:`${i}s`}function q(e,s){const t=e.trim()||"Joueur",n=s.trim()||"🎮",i=o.user?v.save.playerProfile.name:t;O(c=>{c.playerProfile.name=i.slice(0,18),c.playerProfile.avatar=n.slice(0,4)}),A()}function ce(){const e=ee(),s=new Blob([e],{type:"application/json"}),t=URL.createObjectURL(s),n=document.createElement("a");n.href=t,n.download="nintendo-hub-save.json",n.click(),URL.revokeObjectURL(t),m("Sauvegarde exportée","success")}function le(e){const s=X(e);s.success?(m("Import réussi","success"),A()):m(s.error||"Import impossible","error")}function G(e){e?(se(e),m(`Progression de ${e} réinitialisée`,"info")):(te(),m("Progression globale réinitialisée","info")),A()}function de(e){O(s=>{const t=new Set(s.favorites||[]);t.has(e)?t.delete(e):t.add(e),s.favorites=Array.from(t)}),A()}async function ue(){const e=U();await ie(e.save)?(v=e,m("Sauvegarde envoyée sur le cloud","success")):o.error&&m(o.error,"error")}async function pe(){const e=await re();e!=null&&e.state?(X(JSON.stringify(e.state)),m("Sauvegarde cloud importée","success"),A()):e!=null&&e.error&&m(e.error,"error")}function ve(){return`
    <nav class="nav">
      <button class="nav-btn ${y==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${y==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${y==="saves"?"active":""}" data-tab="saves">Saves</button>
    </nav>
  `}function me(e){return Z(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${B("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function ge(){const e=B("/apps/profil/");return`
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
                   <button class="btn primary" id="gate-login" ${o.loading?"disabled":""}>Connexion</button>
                   <button class="btn ghost" id="gate-register" ${o.loading?"disabled":""}>Créer un compte</button>
                   <a class="btn ghost" href="${e}">Profil</a>
                 </div>
                 ${o.error?`<p class="status error">${o.error}</p>`:'<p class="status info">Tes saves seront synchronisées entre appareils.</p>'}
               </div>`:'<p class="status error">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY puis recharge la page.</p>'}
      </header>
    </div>
  `}function fe(){var a;const e=v.save,s=e.achievementsUnlocked.length,t=k.achievements.length,n=e.globalLevel>_,i=`--progress:${v.levelProgress*100}%`,c=j(e.globalStats.timePlayedMs),f=e.globalStats.totalSessions,h=e.playerProfile.lastPlayedGameId&&((a=b.games.find(u=>u.id===e.playerProfile.lastPlayedGameId))==null?void 0:a.title);_=e.globalLevel;const $=B("/apps/profil/"),E=o.user?`<span class="chip success">Cloud : ${D()}</span>`:o.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          <div class="avatar">${e.playerProfile.avatar||"🎮"}</div>
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${h?`Dernier jeu : ${h}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${E}
              <span class="chip">⏱ ${c}</span>
              <span class="chip">🎮 ${f} sessions</span>
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
            <strong>${c}</strong>
            <p class="muted small">Sessions ${f}</p>
          </div>
        </div>
      </div>
      <div class="actions hero-actions">
        <a class="btn primary" href="${$}">Ouvrir le profil</a>
        <button class="btn ghost" id="go-saves">Voir les saves</button>
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
  `}function he(){const e=b.games.length?[]:["games.registry.json vide ou invalide"],s=new Set(v.save.favorites||[]),t=Array.from(new Set(b.games.flatMap(a=>a.tags||[]).filter(Boolean))).sort((a,u)=>a.localeCompare(u,"fr")),n=I.trim().toLowerCase(),i=I.replace(/"/g,"&quot;"),c=b.games.filter(a=>P?s.has(a.id):!0).filter(a=>w==="all"?!0:(a.tags||[]).includes(w)).filter(a=>n?a.title.toLowerCase().includes(n)||a.description.toLowerCase().includes(n)||a.id.toLowerCase().includes(n):!0).sort((a,u)=>{const l=Number(s.has(u.id))-Number(s.has(a.id));return l!==0?l:(a.order??0)-(u.order??0)}),f=c.map(a=>{J.find(p=>p.id===a.id)||e.push(`Config manquante pour ${a.id}`);const l=v.save.games[a.id],T=l!=null&&l.lastPlayedAt?N(l.lastPlayedAt):"Jamais",L=(l==null?void 0:l.bestScore)??null,C=j(l==null?void 0:l.timePlayedMs),r=B(`/apps/games/${a.id}/`),d=s.has(a.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${a.previewEmoji||"🎮"} ${a.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${d?"active":""}" data-game="${a.id}" title="${d?"Retirer des favoris":"Ajouter aux favoris"}">
                ${d?"★":"☆"}
              </button>
              <span class="muted">MAJ ${a.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${a.description}</p>
          <div class="tags">${a.tags.map(p=>`<span class="tag">${p}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${C}</span>
            <span class="chip ghost">🏆 ${L??"—"}</span>
            <span class="chip ghost">🕘 ${T}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${r}" data-game="${a.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${a.id}">Aide</button>
          </div>
        </article>
      `}).join(""),h=P||w!=="all"||!!n,$=c.length,E=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
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
          <button class="chip-btn ${w==="all"?"active":""}" data-category="all">Toutes</button>
          ${t.map(a=>`<button class="chip-btn ${a===w?"active":""}" data-category="${a}">${a}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${P?"active":""}" id="filter-fav">
            ★ Favoris ${s.size?`<span class="badge">${s.size}</span>`:""}
          </button>
          <span class="muted small">${$}/${b.games.length} jeux</span>
          ${h?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${E}
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
            <p class="muted">Identifiant : ${D()}</p>
          </div>
          <span class="chip ghost">Dernière sync ${o.lastSyncedAt?N(o.lastSyncedAt):"Jamais"}</span>
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
            <p class="muted">v${i.saveSchemaVersion} · Dernier : ${N(i.lastPlayedAt)}</p>
          </div>
          <div class="row-meta">
            <span class="chip ghost">⏱ ${j(i.timePlayedMs)}</span>
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
            <strong>${j(e.globalStats.timePlayedMs)}</strong>
          </div>
          <div class="stat-card">
            <p class="label">Jeux joués</p>
            <strong>${Object.keys(e.games).length}/${b.games.length}</strong>
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
  `}function g(){if(!o.user){R.innerHTML=ge(),Se();return}R.innerHTML=`
    <div class="layout">
      ${ve()}
      ${fe()}
      ${y==="hub"?he():""}
      ${y==="achievements"?be():""}
      ${y==="saves"?Ee():""}
    </div>
  `,we()}function Se(){const e=document.getElementById("gate-login"),s=document.getElementById("gate-register");e==null||e.addEventListener("click",async()=>{var i,c;const t=((i=document.getElementById("gate-identifier"))==null?void 0:i.value)||"",n=((c=document.getElementById("gate-password"))==null?void 0:c.value)||"";await x("login",{identifier:t,password:n})}),s==null||s.addEventListener("click",async()=>{var i,c;const t=((i=document.getElementById("gate-identifier"))==null?void 0:i.value)||"",n=((c=document.getElementById("gate-password"))==null?void 0:c.value)||"";await x("register",{identifier:t,password:n})})}function we(){var C;document.querySelectorAll(".nav-btn").forEach(r=>{r.addEventListener("click",()=>{y=r.dataset.tab,g()})});const e=document.getElementById("player-name"),s=document.getElementById("player-avatar");e==null||e.addEventListener("change",()=>q(e.value,(s==null?void 0:s.value)||"🎮")),s==null||s.addEventListener("change",()=>q((e==null?void 0:e.value)||"Joueur",s.value)),(C=document.getElementById("go-saves"))==null||C.addEventListener("click",()=>{y="saves",g()}),document.querySelectorAll(".help-btn").forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.help,p=J.find(S=>S.id===d);p&&m(p.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.game;d&&de(d)})});const t=document.getElementById("export-save");t==null||t.addEventListener("click",ce);const n=document.getElementById("reset-save");n==null||n.addEventListener("click",()=>G()),document.querySelectorAll(".reset-game").forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.game;G(d)})});const i=document.getElementById("import-btn"),c=document.getElementById("import-text");i==null||i.addEventListener("click",()=>c&&le(c.value));const f=document.getElementById("cloud-login"),h=document.getElementById("cloud-register"),$=document.getElementById("cloud-logout"),E=document.getElementById("cloud-save"),a=document.getElementById("cloud-load");f==null||f.addEventListener("click",async()=>{var p,S;const r=((p=document.getElementById("cloud-identifier"))==null?void 0:p.value)||"",d=((S=document.getElementById("cloud-password"))==null?void 0:S.value)||"";await x("login",{identifier:r,password:d})}),h==null||h.addEventListener("click",async()=>{var p,S;const r=((p=document.getElementById("cloud-identifier"))==null?void 0:p.value)||"",d=((S=document.getElementById("cloud-password"))==null?void 0:S.value)||"";await x("register",{identifier:r,password:d})}),$==null||$.addEventListener("click",async()=>{await x("logout")}),E==null||E.addEventListener("click",ue),a==null||a.addEventListener("click",pe);const u=document.getElementById("search-games"),l=document.getElementById("filter-fav"),T=Array.from(document.querySelectorAll(".chip-btn[data-category]")),L=document.getElementById("clear-filters");u==null||u.addEventListener("input",()=>{I=u.value,g()}),T.forEach(r=>{r.addEventListener("click",()=>{w=r.dataset.category||"all",g()})}),l==null||l.addEventListener("click",()=>{P=!P,g()}),L==null||L.addEventListener("click",()=>{I="",w="all",P=!1,g()})}function A(){v=U(),F(V(b.hubTheme)),g()}g();
