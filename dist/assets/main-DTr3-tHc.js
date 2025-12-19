import{g as B,a as F,o as V,c as H,u as q,e as z,r as K,b as W,i as J,A as Y}from"./index-D5lPzJ7_.js";import{g as Q,a as Z,b as ee,c as se,w as A}from"./loaders-Bj0CnEmo.js";import{s as te,g as ae,c as T,a as ne,l as oe}from"./cloud-Vs8Bl6sx.js";const ie=document.getElementById("app"),y=Q(),C=Z(),O=ee(),U=se();let P="hub",p=B(),M=p.save.globalLevel,o=ae(),k="",E="all",w=!1;function D(){var n;const e=o.user;if(!e)return"connecté";const s=(n=e.user_metadata)==null?void 0:n.identifier,t=e.email;return s||(t!=null&&t.endsWith("@user.local")?t.replace("@user.local",""):t||"connecté")}F();_(G(y.hubTheme));te(e=>{o=e,b()});V("ACHIEVEMENT_UNLOCKED",e=>{var n;const s=(n=e.payload)==null?void 0:n.achievementId,t=C.achievements.find(c=>c.id===s);t&&m(`Succès débloqué : ${t.title}`,"success"),s===Y.achievementId&&x()});function G(e){return e?U.find(s=>s.id===e):U[0]}function _(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function m(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),300)},2600)}function R(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function j(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),n=Math.floor(s%3600/60),c=s%60;return t?`${t}h ${n}m`:n?`${n}m ${c}s`:`${c}s`}function N(e,s){const t=e.trim()||"Joueur",n=s.trim()||"🎮";q(c=>{c.playerProfile.name=t.slice(0,18),c.playerProfile.avatar=n.slice(0,4)}),x()}function ce(){const e=z(),s=new Blob([e],{type:"application/json"}),t=URL.createObjectURL(s),n=document.createElement("a");n.href=t,n.download="nintendo-hub-save.json",n.click(),URL.revokeObjectURL(t),m("Sauvegarde exportée","success")}function re(e){const s=J(e);s.success?(m("Import réussi","success"),x()):m(s.error||"Import impossible","error")}function X(e){e?(K(e),m(`Progression de ${e} réinitialisée`,"info")):(W(),m("Progression globale réinitialisée","info")),x()}function le(e){q(s=>{const t=new Set(s.favorites||[]);t.has(e)?t.delete(e):t.add(e),s.favorites=Array.from(t)}),x()}async function de(){const e=B();await ne(e.save)?(p=e,m("Sauvegarde envoyée sur le cloud","success")):o.error&&m(o.error,"error")}async function ue(){const e=await oe();e!=null&&e.state?(J(JSON.stringify(e.state)),m("Sauvegarde cloud importée","success"),x()):e!=null&&e.error&&m(e.error,"error")}function ve(){return`
    <nav class="nav">
      <button class="nav-btn ${P==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${P==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${P==="saves"?"active":""}" data-tab="saves">Saves</button>
    </nav>
  `}function pe(e){return H(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${A("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function me(){var l;const e=p.save,s=e.achievementsUnlocked.length,t=C.achievements.length,n=e.globalLevel>M,c=`--progress:${p.levelProgress*100}%`,g=j(e.globalStats.timePlayedMs),f=e.globalStats.totalSessions,h=e.playerProfile.lastPlayedGameId&&((l=y.games.find(r=>r.id===e.playerProfile.lastPlayedGameId))==null?void 0:l.title);M=e.globalLevel;const $=A("/apps/profil/"),S=A("/apps/auth/"),a=o.user?`<span class="chip success">Cloud : ${D()}</span>`:o.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
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
              ${a}
              <span class="chip">⏱ ${g}</span>
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
            <strong>${g}</strong>
            <p class="muted small">Sessions ${f}</p>
          </div>
        </div>
      </div>
      <div class="actions hero-actions">
        <a class="btn primary" href="${S}">Connexion / Invité</a>
        <a class="btn ghost" href="${$}">Page Profil complète</a>
      </div>
      ${pe(e)}
      <div class="level-row ${n?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${c}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(p.levelProgress*100)}% · ${p.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <div class="profile-form">
        <label>
          Pseudo
          <input id="player-name" type="text" value="${e.playerProfile.name}" maxlength="18" />
        </label>
        <label>
          Avatar (emoji)
          <input id="player-avatar" type="text" value="${e.playerProfile.avatar}" maxlength="4" />
        </label>
      </div>
    </header>
  `}function ge(){const e=y.games.length?[]:["games.registry.json vide ou invalide"],s=new Set(p.save.favorites||[]),t=Array.from(new Set(y.games.flatMap(a=>a.tags||[]).filter(Boolean))).sort((a,l)=>a.localeCompare(l,"fr")),n=k.trim().toLowerCase(),c=k.replace(/"/g,"&quot;"),g=y.games.filter(a=>w?s.has(a.id):!0).filter(a=>E==="all"?!0:(a.tags||[]).includes(E)).filter(a=>n?a.title.toLowerCase().includes(n)||a.description.toLowerCase().includes(n)||a.id.toLowerCase().includes(n):!0).sort((a,l)=>{const r=Number(s.has(l.id))-Number(s.has(a.id));return r!==0?r:(a.order??0)-(l.order??0)}),f=g.map(a=>{O.find(v=>v.id===a.id)||e.push(`Config manquante pour ${a.id}`);const r=p.save.games[a.id],I=r!=null&&r.lastPlayedAt?R(r.lastPlayedAt):"Jamais",L=(r==null?void 0:r.bestScore)??null,i=j(r==null?void 0:r.timePlayedMs),d=A(`/apps/games/${a.id}/`),u=s.has(a.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${a.previewEmoji||"🎮"} ${a.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${u?"active":""}" data-game="${a.id}" title="${u?"Retirer des favoris":"Ajouter aux favoris"}">
                ${u?"★":"☆"}
              </button>
              <span class="muted">MAJ ${a.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${a.description}</p>
          <div class="tags">${a.tags.map(v=>`<span class="tag">${v}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${i}</span>
            <span class="chip ghost">🏆 ${L??"—"}</span>
            <span class="chip ghost">🕘 ${I}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${d}" data-game="${a.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${a.id}">Aide</button>
          </div>
        </article>
      `}).join(""),h=w||E!=="all"||!!n,$=g.length,S=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
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
            value="${c}"
          />
        </div>
        <div class="filter group">
          <button class="chip-btn ${E==="all"?"active":""}" data-category="all">Toutes</button>
          ${t.map(a=>`<button class="chip-btn ${a===E?"active":""}" data-category="${a}">${a}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${w?"active":""}" id="filter-fav">
            ★ Favoris ${s.size?`<span class="badge">${s.size}</span>`:""}
          </button>
          <span class="muted small">${$}/${y.games.length} jeux</span>
          ${h?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${S}
      <div class="grid">${f||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function fe(){const e=new Set(p.save.achievementsUnlocked),s=C.achievements.map(t=>`
        <article class="card achievement ${e.has(t.id)?"unlocked":""}">
          <div class="pill accent">${t.icon||"⭐️"}</div>
          <div>
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <p class="muted">${he(t)}</p>
          </div>
          <div class="reward">+${t.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${C.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${s}</div>
    </section>
  `}function he(e){const s=e.condition;return s.type==="eventCount"?`${s.count}x ${s.event}`:s.type==="xpReached"?`${s.xp} XP globaux`:s.type==="gamesPlayed"?`${s.count} jeux différents`:s.type==="streak"?`${s.count} ${s.event} d'affilée`:s.type==="playerXpName"?`${s.xp} XP et pseudo "${s.name}"`:""}function be(){return o.ready?o.user?`
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Connecté</h2>
            <p class="muted">Identifiant : ${D()}</p>
          </div>
          <span class="chip ghost">Dernière sync ${o.lastSyncedAt?R(o.lastSyncedAt):"Jamais"}</span>
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
    `}function ye(){const e=p.save,t=Object.entries(e.games).map(([n,c])=>`
        <div class="save-row">
          <div>
            <strong>${n}</strong>
            <p class="muted">v${c.saveSchemaVersion} · Dernier : ${R(c.lastPlayedAt)}</p>
          </div>
          <div class="row-meta">
            <span class="chip ghost">⏱ ${j(c.timePlayedMs)}</span>
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
            <strong>${Object.keys(e.games).length}/${y.games.length}</strong>
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
      ${be()}
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
  `}function b(){ie.innerHTML=`
    <div class="layout">
      ${ve()}
      ${me()}
      ${P==="hub"?ge():""}
      ${P==="achievements"?fe():""}
      ${P==="saves"?ye():""}
    </div>
  `,$e()}function $e(){document.querySelectorAll(".nav-btn").forEach(i=>{i.addEventListener("click",()=>{P=i.dataset.tab,b()})});const e=document.getElementById("player-name"),s=document.getElementById("player-avatar");e==null||e.addEventListener("change",()=>N(e.value,(s==null?void 0:s.value)||"🎮")),s==null||s.addEventListener("change",()=>N((e==null?void 0:e.value)||"Joueur",s.value)),document.querySelectorAll(".help-btn").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.help,u=O.find(v=>v.id===d);u&&m(u.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.game;d&&le(d)})});const t=document.getElementById("export-save");t==null||t.addEventListener("click",ce);const n=document.getElementById("reset-save");n==null||n.addEventListener("click",()=>X()),document.querySelectorAll(".reset-game").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.game;X(d)})});const c=document.getElementById("import-btn"),g=document.getElementById("import-text");c==null||c.addEventListener("click",()=>g&&re(g.value));const f=document.getElementById("cloud-login"),h=document.getElementById("cloud-register"),$=document.getElementById("cloud-logout"),S=document.getElementById("cloud-save"),a=document.getElementById("cloud-load");f==null||f.addEventListener("click",async()=>{var u,v;const i=((u=document.getElementById("cloud-identifier"))==null?void 0:u.value)||"",d=((v=document.getElementById("cloud-password"))==null?void 0:v.value)||"";await T("login",{identifier:i,password:d})}),h==null||h.addEventListener("click",async()=>{var u,v;const i=((u=document.getElementById("cloud-identifier"))==null?void 0:u.value)||"",d=((v=document.getElementById("cloud-password"))==null?void 0:v.value)||"";await T("register",{identifier:i,password:d})}),$==null||$.addEventListener("click",async()=>{await T("logout")}),S==null||S.addEventListener("click",de),a==null||a.addEventListener("click",ue);const l=document.getElementById("search-games"),r=document.getElementById("filter-fav"),I=Array.from(document.querySelectorAll(".chip-btn[data-category]")),L=document.getElementById("clear-filters");l==null||l.addEventListener("input",()=>{k=l.value,b()}),I.forEach(i=>{i.addEventListener("click",()=>{E=i.dataset.category||"all",b()})}),r==null||r.addEventListener("click",()=>{w=!w,b()}),L==null||L.addEventListener("click",()=>{k="",E="all",w=!1,b()})}function x(){p=B(),_(G(y.hubTheme)),b()}b();
