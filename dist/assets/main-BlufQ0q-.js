import{g as T,a as X,o as F,u as q,e as V,r as _,b as H,i as J}from"./index-niTdxgfr.js";import{g as z,a as K,b as Y,c as Q,w as W}from"./loaders-CNHm-dlv.js";import{g as Z,c as I,s as ee,l as se,a as te}from"./cloud-B4CuE7-U.js";const ae=document.getElementById("app"),$=z(),x=K(),D=Y(),R=Q();let P="hub",v=T(),M=v.save.globalLevel,n=Z(),A="",E="all",w=!1;X();O(G($.hubTheme));te(e=>{n=e,y()});F("ACHIEVEMENT_UNLOCKED",e=>{var o;const s=(o=e.payload)==null?void 0:o.achievementId,t=x.achievements.find(l=>l.id===s);t&&p(`Succès débloqué : ${t.title}`,"success")});function G(e){return e?R.find(s=>s.id===e):R[0]}function O(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function p(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),300)},2600)}function B(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function k(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),o=Math.floor(s%3600/60),l=s%60;return t?`${t}h ${o}m`:o?`${o}m ${l}s`:`${l}s`}function U(e,s){const t=e.trim()||"Joueur",o=s.trim()||"🎮";q(l=>{l.playerProfile.name=t.slice(0,18),l.playerProfile.avatar=o.slice(0,4)}),L()}function oe(){const e=V(),s=new Blob([e],{type:"application/json"}),t=URL.createObjectURL(s),o=document.createElement("a");o.href=t,o.download="nintendo-hub-save.json",o.click(),URL.revokeObjectURL(t),p("Sauvegarde exportée","success")}function ne(e){const s=J(e);s.success?(p("Import réussi","success"),L()):p(s.error||"Import impossible","error")}function N(e){e?(_(e),p(`Progression de ${e} réinitialisée`,"info")):(H(),p("Progression globale réinitialisée","info")),L()}function ie(e){q(s=>{const t=new Set(s.favorites||[]);t.has(e)?t.delete(e):t.add(e),s.favorites=Array.from(t)}),L()}async function le(){const e=T();await ee(e.save)?(v=e,p("Sauvegarde envoyée sur le cloud","success")):n.error&&p(n.error,"error")}async function ce(){const e=await se();e!=null&&e.state?(J(JSON.stringify(e.state)),p("Sauvegarde cloud importée","success"),L()):e!=null&&e.error&&p(e.error,"error")}function re(){return`
    <nav class="nav">
      <button class="nav-btn ${P==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${P==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${P==="saves"?"active":""}" data-tab="saves">Saves</button>
    </nav>
  `}function de(){var b;const e=v.save,s=e.achievementsUnlocked.length,t=x.achievements.length,o=e.globalLevel>M,l=`--progress:${v.levelProgress*100}%`,g=k(e.globalStats.timePlayedMs),h=e.globalStats.totalSessions,f=e.playerProfile.lastPlayedGameId&&((b=$.games.find(a=>a.id===e.playerProfile.lastPlayedGameId))==null?void 0:b.title);M=e.globalLevel;const S=n.user?`<span class="chip success">Cloud : ${n.user.email||"connecté"}</span>`:n.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          <div class="avatar">${e.playerProfile.avatar||"🎮"}</div>
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${f?`Dernier jeu : ${f}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${S}
              <span class="chip">⏱ ${g}</span>
              <span class="chip">🎮 ${h} sessions</span>
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
            <p class="muted small">Sessions ${h}</p>
          </div>
        </div>
      </div>
      <div class="level-row ${o?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${l}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(v.levelProgress*100)}% · ${v.nextLevelXP-e.globalXP} XP restants</div>
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
  `}function ue(){const e=$.games.length?[]:["games.registry.json vide ou invalide"],s=new Set(v.save.favorites||[]),t=Array.from(new Set($.games.flatMap(a=>a.tags||[]).filter(Boolean))).sort((a,m)=>a.localeCompare(m,"fr")),o=A.trim().toLowerCase(),l=A.replace(/"/g,"&quot;"),g=$.games.filter(a=>w?s.has(a.id):!0).filter(a=>E==="all"?!0:(a.tags||[]).includes(E)).filter(a=>o?a.title.toLowerCase().includes(o)||a.description.toLowerCase().includes(o)||a.id.toLowerCase().includes(o):!0).sort((a,m)=>{const c=Number(s.has(m.id))-Number(s.has(a.id));return c!==0?c:(a.order??0)-(m.order??0)}),h=g.map(a=>{D.find(u=>u.id===a.id)||e.push(`Config manquante pour ${a.id}`);const c=v.save.games[a.id],j=c!=null&&c.lastPlayedAt?B(c.lastPlayedAt):"Jamais",C=(c==null?void 0:c.bestScore)??null,i=k(c==null?void 0:c.timePlayedMs),r=W(`/apps/games/${a.id}/`),d=s.has(a.id);return`
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
          <div class="tags">${a.tags.map(u=>`<span class="tag">${u}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${i}</span>
            <span class="chip ghost">🏆 ${C??"—"}</span>
            <span class="chip ghost">🕘 ${j}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${r}" data-game="${a.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${a.id}">Aide</button>
          </div>
        </article>
      `}).join(""),f=w||E!=="all"||!!o,S=g.length,b=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
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
          <button class="chip-btn ${E==="all"?"active":""}" data-category="all">Toutes</button>
          ${t.map(a=>`<button class="chip-btn ${a===E?"active":""}" data-category="${a}">${a}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${w?"active":""}" id="filter-fav">
            ★ Favoris ${s.size?`<span class="badge">${s.size}</span>`:""}
          </button>
          <span class="muted small">${S}/${$.games.length} jeux</span>
          ${f?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${b}
      <div class="grid">${h||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function ve(){const e=new Set(v.save.achievementsUnlocked),s=x.achievements.map(t=>`
        <article class="card achievement ${e.has(t.id)?"unlocked":""}">
          <div class="pill accent">${t.icon||"⭐️"}</div>
          <div>
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <p class="muted">${pe(t)}</p>
          </div>
          <div class="reward">+${t.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${x.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${s}</div>
    </section>
  `}function pe(e){const s=e.condition;return s.type==="eventCount"?`${s.count}x ${s.event}`:s.type==="xpReached"?`${s.xp} XP globaux`:s.type==="gamesPlayed"?`${s.count} jeux différents`:s.type==="streak"?`${s.count} ${s.event} d'affilée`:""}function me(){return n.ready?n.user?`
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Connecté</h2>
            <p class="muted">${n.user.email||"Compte sans email"}</p>
          </div>
          <span class="chip ghost">Dernière sync ${n.lastSyncedAt?B(n.lastSyncedAt):"Jamais"}</span>
        </div>
        <div class="actions wrap">
          <button class="btn primary" id="cloud-save" ${n.loading?"disabled":""}>Sauvegarder vers cloud</button>
          <button class="btn ghost" id="cloud-load" ${n.loading?"disabled":""}>Charger depuis cloud</button>
          <button class="btn ghost danger" id="cloud-logout" ${n.loading?"disabled":""}>Déconnexion</button>
        </div>
        ${n.message?`<p class="status ok">${n.message}</p>`:'<p class="status info">Synchronise tes saves entre appareils.</p>'}
        ${n.error?`<p class="status error">${n.error}</p>`:""}
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
        <label>Email <input id="cloud-email" type="email" placeholder="mail@example.com" /></label>
        <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
      </div>
      <div class="actions wrap">
        <button class="btn primary" id="cloud-login" ${n.loading?"disabled":""}>Connexion</button>
        <button class="btn ghost" id="cloud-register" ${n.loading?"disabled":""}>Créer un compte</button>
      </div>
      ${n.error?`<p class="status error">${n.error}</p>`:`<p class="status info">Aucune donnée n'est envoyée sans action manuelle.</p>`}
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
    `}function ge(){const e=v.save,t=Object.entries(e.games).map(([o,l])=>`
        <div class="save-row">
          <div>
            <strong>${o}</strong>
            <p class="muted">v${l.saveSchemaVersion} · Dernier : ${B(l.lastPlayedAt)}</p>
          </div>
          <div class="row-meta">
            <span class="chip ghost">⏱ ${k(l.timePlayedMs)}</span>
            <button class="btn ghost reset-game" data-game="${o}">Reset</button>
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
            <strong>${k(e.globalStats.timePlayedMs)}</strong>
          </div>
          <div class="stat-card">
            <p class="label">Jeux joués</p>
            <strong>${Object.keys(e.games).length}/${$.games.length}</strong>
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
      ${me()}
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
  `}function y(){ae.innerHTML=`
    <div class="layout">
      ${re()}
      ${de()}
      ${P==="hub"?ue():""}
      ${P==="achievements"?ve():""}
      ${P==="saves"?ge():""}
    </div>
  `,he()}function he(){document.querySelectorAll(".nav-btn").forEach(i=>{i.addEventListener("click",()=>{P=i.dataset.tab,y()})});const e=document.getElementById("player-name"),s=document.getElementById("player-avatar");e==null||e.addEventListener("change",()=>U(e.value,(s==null?void 0:s.value)||"🎮")),s==null||s.addEventListener("change",()=>U((e==null?void 0:e.value)||"Joueur",s.value)),document.querySelectorAll(".help-btn").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.help,d=D.find(u=>u.id===r);d&&p(d.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.game;r&&ie(r)})});const t=document.getElementById("export-save");t==null||t.addEventListener("click",oe);const o=document.getElementById("reset-save");o==null||o.addEventListener("click",()=>N()),document.querySelectorAll(".reset-game").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.game;N(r)})});const l=document.getElementById("import-btn"),g=document.getElementById("import-text");l==null||l.addEventListener("click",()=>g&&ne(g.value));const h=document.getElementById("cloud-login"),f=document.getElementById("cloud-register"),S=document.getElementById("cloud-logout"),b=document.getElementById("cloud-save"),a=document.getElementById("cloud-load");h==null||h.addEventListener("click",async()=>{var d,u;const i=((d=document.getElementById("cloud-email"))==null?void 0:d.value)||"",r=((u=document.getElementById("cloud-password"))==null?void 0:u.value)||"";await I("login",{email:i,password:r})}),f==null||f.addEventListener("click",async()=>{var d,u;const i=((d=document.getElementById("cloud-email"))==null?void 0:d.value)||"",r=((u=document.getElementById("cloud-password"))==null?void 0:u.value)||"";await I("register",{email:i,password:r})}),S==null||S.addEventListener("click",async()=>{await I("logout")}),b==null||b.addEventListener("click",le),a==null||a.addEventListener("click",ce);const m=document.getElementById("search-games"),c=document.getElementById("filter-fav"),j=Array.from(document.querySelectorAll(".chip-btn[data-category]")),C=document.getElementById("clear-filters");m==null||m.addEventListener("input",()=>{A=m.value,y()}),j.forEach(i=>{i.addEventListener("click",()=>{E=i.dataset.category||"all",y()})}),c==null||c.addEventListener("click",()=>{w=!w,y()}),C==null||C.addEventListener("click",()=>{A="",E="all",w=!1,y()})}function L(){v=T(),O(G($.hubTheme)),y()}y();
