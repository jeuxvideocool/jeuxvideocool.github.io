import{g as x,b as M,o as R,u as J,a as N,c as G,r as q,i as I}from"./index-DEUwev7d.js";import{g as D,a as O,b as X,c as V,w as _}from"./loaders-C6hX0A3C.js";import{g as H,c as w,s as F,l as K,a as z}from"./cloud-B4CuE7-U.js";const Y=document.getElementById("app"),f=D(),$=O(),T=X(),L=V();let y="hub",r=x(),A=r.save.globalLevel,o=H();M();U(B(f.hubTheme));z(e=>{o=e,E()});R("ACHIEVEMENT_UNLOCKED",e=>{var t;const s=(t=e.payload)==null?void 0:t.achievementId,a=$.achievements.find(n=>n.id===s);a&&c(`Succès débloqué : ${a.title}`,"success")});function B(e){return e?L.find(s=>s.id===e):L[0]}function U(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function c(e,s="info"){const a=document.createElement("div");a.className=`toast ${s}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("visible")),setTimeout(()=>{a.classList.remove("visible"),setTimeout(()=>a.remove(),300)},2600)}function C(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function S(e){if(!e)return"0m";const s=Math.floor(e/1e3),a=Math.floor(s/3600),t=Math.floor(s%3600/60),n=s%60;return a?`${a}h ${t}m`:t?`${t}m ${n}s`:`${n}s`}function k(e,s){const a=e.trim()||"Joueur",t=s.trim()||"🎮";J(n=>{n.playerProfile.name=a.slice(0,18),n.playerProfile.avatar=t.slice(0,4)}),P()}function Q(){const e=N(),s=new Blob([e],{type:"application/json"}),a=URL.createObjectURL(s),t=document.createElement("a");t.href=a,t.download="nintendo-hub-save.json",t.click(),URL.revokeObjectURL(a),c("Sauvegarde exportée","success")}function W(e){const s=I(e);s.success?(c("Import réussi","success"),P()):c(s.error||"Import impossible","error")}function j(e){e?(G(e),c(`Progression de ${e} réinitialisée`,"info")):(q(),c("Progression globale réinitialisée","info")),P()}async function Z(){const e=x();await F(e.save)?(r=e,c("Sauvegarde envoyée sur le cloud","success")):o.error&&c(o.error,"error")}async function ee(){const e=await K();e!=null&&e.state?(I(JSON.stringify(e.state)),c("Sauvegarde cloud importée","success"),P()):e!=null&&e.error&&c(e.error,"error")}function se(){return`
    <nav class="nav">
      <button class="nav-btn ${y==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${y==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${y==="saves"?"active":""}" data-tab="saves">Saves</button>
    </nav>
  `}function te(){var p;const e=r.save,s=e.achievementsUnlocked.length,a=$.achievements.length,t=e.globalLevel>A,n=`--progress:${r.levelProgress*100}%`,l=S(e.globalStats.timePlayedMs),u=e.globalStats.totalSessions,v=e.playerProfile.lastPlayedGameId&&((p=f.games.find(d=>d.id===e.playerProfile.lastPlayedGameId))==null?void 0:p.title);A=e.globalLevel;const g=o.user?`<span class="chip success">Cloud : ${o.user.email||"connecté"}</span>`:o.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          <div class="avatar">${e.playerProfile.avatar||"🎮"}</div>
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${v?`Dernier jeu : ${v}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${g}
              <span class="chip">⏱ ${l}</span>
              <span class="chip">🎮 ${u} sessions</span>
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
            <strong>${s}/${a}</strong>
            <p class="muted small">Schema v${e.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${l}</strong>
            <p class="muted small">Sessions ${u}</p>
          </div>
        </div>
      </div>
      <div class="level-row ${t?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${n}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(r.levelProgress*100)}% · ${r.nextLevelXP-e.globalXP} XP restants</div>
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
  `}function ae(){const e=f.games.length?[]:["games.registry.json vide ou invalide"],s=f.games.slice().sort((t,n)=>(t.order??0)-(n.order??0)).map(t=>{T.find(d=>d.id===t.id)||e.push(`Config manquante pour ${t.id}`);const l=r.save.games[t.id],u=l!=null&&l.lastPlayedAt?C(l.lastPlayedAt):"Jamais",v=(l==null?void 0:l.bestScore)??null,g=S(l==null?void 0:l.timePlayedMs),p=_(`/apps/games/${t.id}/`);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${t.previewEmoji||"🎮"} ${t.title}</div>
            <span class="muted">MAJ ${t.lastUpdated||"N/A"}</span>
          </div>
          <p class="game-desc">${t.description}</p>
          <div class="tags">${t.tags.map(d=>`<span class="tag">${d}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${g}</span>
            <span class="chip ghost">🏆 ${v??"—"}</span>
            <span class="chip ghost">🕘 ${u}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${p}" data-game="${t.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${t.id}">Aide</button>
          </div>
        </article>
      `}).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Catalogue</p>
          <h2>Choisis ton mini-jeu</h2>
        </div>
      </div>
      ${e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:""}
      <div class="grid">${s}</div>
    </section>
  `}function oe(){const e=new Set(r.save.achievementsUnlocked),s=$.achievements.map(a=>`
        <article class="card achievement ${e.has(a.id)?"unlocked":""}">
          <div class="pill accent">${a.icon||"⭐️"}</div>
          <div>
            <h3>${a.title}</h3>
            <p>${a.description}</p>
            <p class="muted">${ne(a)}</p>
          </div>
          <div class="reward">+${a.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${$.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${s}</div>
    </section>
  `}function ne(e){const s=e.condition;return s.type==="eventCount"?`${s.count}x ${s.event}`:s.type==="xpReached"?`${s.xp} XP globaux`:s.type==="gamesPlayed"?`${s.count} jeux différents`:s.type==="streak"?`${s.count} ${s.event} d'affilée`:""}function le(){return o.ready?o.user?`
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Connecté</h2>
            <p class="muted">${o.user.email||"Compte sans email"}</p>
          </div>
          <span class="chip ghost">Dernière sync ${o.lastSyncedAt?C(o.lastSyncedAt):"Jamais"}</span>
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
        <label>Email <input id="cloud-email" type="email" placeholder="mail@example.com" /></label>
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
    `}function ie(){const e=r.save,a=Object.entries(e.games).map(([t,n])=>`
        <div class="save-row">
          <div>
            <strong>${t}</strong>
            <p class="muted">v${n.saveSchemaVersion} · Dernier : ${C(n.lastPlayedAt)}</p>
          </div>
          <div class="row-meta">
            <span class="chip ghost">⏱ ${S(n.timePlayedMs)}</span>
            <button class="btn ghost reset-game" data-game="${t}">Reset</button>
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
            <strong>${S(e.globalStats.timePlayedMs)}</strong>
          </div>
          <div class="stat-card">
            <p class="label">Jeux joués</p>
            <strong>${Object.keys(e.games).length}/${f.games.length}</strong>
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
      ${le()}
    </div>
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Par jeu</p>
          <h2>Saves détaillées</h2>
        </div>
      </div>
      <div class="save-list">
        ${a||"<p class='muted'>Aucune save par jeu pour le moment.</p>"}
      </div>
    </section>
  `}function E(){Y.innerHTML=`
    <div class="layout">
      ${se()}
      ${te()}
      ${y==="hub"?ae():""}
      ${y==="achievements"?oe():""}
      ${y==="saves"?ie():""}
    </div>
  `,ce()}function ce(){document.querySelectorAll(".nav-btn").forEach(i=>{i.addEventListener("click",()=>{y=i.dataset.tab,E()})});const e=document.getElementById("player-name"),s=document.getElementById("player-avatar");e==null||e.addEventListener("change",()=>k(e.value,(s==null?void 0:s.value)||"🎮")),s==null||s.addEventListener("change",()=>k((e==null?void 0:e.value)||"Joueur",s.value)),document.querySelectorAll(".help-btn").forEach(i=>{i.addEventListener("click",()=>{const h=i.dataset.help,m=T.find(b=>b.id===h);m&&c(m.uiText.help,"info")})});const a=document.getElementById("export-save");a==null||a.addEventListener("click",Q);const t=document.getElementById("reset-save");t==null||t.addEventListener("click",()=>j()),document.querySelectorAll(".reset-game").forEach(i=>{i.addEventListener("click",()=>{const h=i.dataset.game;j(h)})});const n=document.getElementById("import-btn"),l=document.getElementById("import-text");n==null||n.addEventListener("click",()=>l&&W(l.value));const u=document.getElementById("cloud-login"),v=document.getElementById("cloud-register"),g=document.getElementById("cloud-logout"),p=document.getElementById("cloud-save"),d=document.getElementById("cloud-load");u==null||u.addEventListener("click",async()=>{var m,b;const i=((m=document.getElementById("cloud-email"))==null?void 0:m.value)||"",h=((b=document.getElementById("cloud-password"))==null?void 0:b.value)||"";await w("login",{email:i,password:h})}),v==null||v.addEventListener("click",async()=>{var m,b;const i=((m=document.getElementById("cloud-email"))==null?void 0:m.value)||"",h=((b=document.getElementById("cloud-password"))==null?void 0:b.value)||"";await w("register",{email:i,password:h})}),g==null||g.addEventListener("click",async()=>{await w("logout")}),p==null||p.addEventListener("click",Z),d==null||d.addEventListener("click",ee)}function P(){r=x(),U(B(f.hubTheme)),E()}E();
