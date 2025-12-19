import{a as oe,b as re,d as ie,e as ce,g as V,f as de,o as ue,w as Q,u as _,c as pe,h as ve,r as me,i as ge,j as Z,A as fe}from"./index-DUQ7dej_.js";import{s as he,g as be,c as N,u as ye,r as $e,a as Pe,l as Ee}from"./cloud-renlPHrB.js";const F=document.getElementById("app"),$=oe(),M=re(),ee=ie(),z=ce();let E="hub",p=V(),K=p.save.globalLevel,r=be(),G="",I="all",U=!1,S=null,O=null,w=!1;function te(){var n;const e=r.user;if(!e)return"connecté";const t=(n=e.user_metadata)==null?void 0:n.identifier,s=e.email;return t||(s!=null&&s.endsWith("@user.local")?s.replace("@user.local",""):s||"connecté")}function se(e){return e?"Image stockée sur Supabase. L'emoji reste disponible en secours.":r.ready?r.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image. Emoji disponible hors-ligne.":"Supabase non configuré (.env)."}de();ne(ae($.hubTheme));he(e=>{r=e,A()});ue("ACHIEVEMENT_UNLOCKED",e=>{var n;const t=(n=e.payload)==null?void 0:n.achievementId,s=M.achievements.find(o=>o.id===t);s&&f(`Succès débloqué : ${s.title}`,"success"),t===fe.achievementId&&B()});function ae(e){return e?z.find(t=>t.id===e):z[0]}function ne(e){if(!e)return;const t=document.documentElement.style;t.setProperty("--color-primary",e.colors.primary),t.setProperty("--color-secondary",e.colors.secondary),t.setProperty("--color-accent",e.colors.accent),t.setProperty("--color-bg",e.colors.background),t.setProperty("--color-surface",e.colors.surface),t.setProperty("--color-text",e.colors.text),t.setProperty("--color-muted",e.colors.muted),e.gradient&&t.setProperty("--hero-gradient",e.gradient)}function f(e,t="info"){const s=document.createElement("div");s.className=`toast ${t}`,s.textContent=e,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("visible")),setTimeout(()=>{s.classList.remove("visible"),setTimeout(()=>s.remove(),300)},2600)}function q(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function C(e){if(!e)return"0m";const t=Math.floor(e/1e3),s=Math.floor(t/3600),n=Math.floor(t%3600/60),o=t%60;return s?`${s}h ${n}m`:n?`${n}m ${o}s`:`${o}s`}function D(e){const t=Object.entries(e.games||{});if(!t.length)return{title:"Aucun jeu",duration:"0m"};const[s,n]=t.sort((l,h)=>(h[1].timePlayedMs||0)-(l[1].timePlayedMs||0))[0],o=$.games.find(l=>l.id===s);return{title:(o==null?void 0:o.title)||s,duration:C(n.timePlayedMs)}}function Se(e,t){const s=(t||"🎮").slice(0,4);return`<div class="avatar ${e?"has-image":""}">${e?`<img src="${e}" alt="Avatar" />`:s}</div>`}function le(){return w?null:O||p.save.playerProfile.avatarUrl||null}function k(){O&&(URL.revokeObjectURL(O),O=null)}function H(){const e=document.getElementById("profile-avatar-preview"),t=document.getElementById("profile-avatar-helper"),s=document.getElementById("profile-avatar-clear"),n=le(),o=p.save.playerProfile.avatar||"🎮",l=!!n;e&&(e.classList.toggle("has-image",l),e.innerHTML=l?`<img src="${n}" alt="Avatar" />`:o),t&&(t.textContent=se(l)),s&&(s.disabled=!l)}function W(e,t){const s=e.trim()||"Joueur",n=t.trim()||"🎮",o=r.user?p.save.playerProfile.name:s;_(l=>{l.playerProfile.name=o.slice(0,18),l.playerProfile.avatar=n.slice(0,4),l.playerProfile.avatarType=l.playerProfile.avatarUrl?"image":"emoji"}),B()}function Ae(){const e=ve(),t=new Blob([e],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download="nintendo-hub-save.json",n.click(),URL.revokeObjectURL(s),f("Sauvegarde exportée","success")}function we(e){const t=Z(e);t.success?(f("Import réussi","success"),k(),S=null,w=!1,B()):f(t.error||"Import impossible","error")}function Y(e){e?(me(e),f(`Progression de ${e} réinitialisée`,"info")):(ge(),f("Progression globale réinitialisée","info")),k(),S=null,w=!1,B()}function xe(e){_(t=>{const s=new Set(t.favorites||[]);s.has(e)?s.delete(e):s.add(e),t.favorites=Array.from(s)}),B()}async function Le(){const e=V();await Pe(e.save)?(p=e,f("Sauvegarde envoyée sur le cloud","success")):r.error&&f(r.error,"error")}async function je(){const e=await Ee();e!=null&&e.state?(Z(JSON.stringify(e.state)),f("Sauvegarde cloud importée","success"),k(),S=null,w=!1,B()):e!=null&&e.error&&f(e.error,"error")}function Ie(){return`
    <nav class="nav">
      <button class="nav-btn ${E==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${E==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${E==="stats"?"active":""}" data-tab="stats">Stats</button>
      <button class="nav-btn ${E==="profile"?"active":""}" data-tab="profile">Profil</button>
    </nav>
  `}function ke(e){return pe(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${Q("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function Ce(){return`
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
                <span class="chip ${r.ready?"warning":"error"}">Cloud : ${r.ready?"non connecté":"Supabase non configuré"}</span>
                <span class="chip ghost">Saves verrouillées</span>
              </div>
            </div>
          </div>
        </div>
        ${r.ready?`<div class="gate-form">
                 <label>Identifiant <input id="gate-identifier" type="text" placeholder="mon-pseudo" /></label>
                 <label>Mot de passe <input id="gate-password" type="password" placeholder="8+ caractères" /></label>
                 <div class="gate-actions">
                   <button class="btn primary strong" id="gate-login" ${r.loading?"disabled":""}>Connexion</button>
                   <button class="btn ghost strong" id="gate-register" ${r.loading?"disabled":""}>Créer un compte</button>
                 </div>
                 ${r.error?`<p class="status error">${r.error}</p>`:'<p class="status info">Tes saves seront synchronisées entre appareils.</p>'}
               </div>`:'<p class="status error">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY puis recharge la page.</p>'}
      </header>
    </div>
  `}function Be(){var a;const e=p.save,t=e.achievementsUnlocked.length,s=M.achievements.length,n=e.globalLevel>K,o=`--progress:${p.levelProgress*100}%`,l=C(e.globalStats.timePlayedMs),h=e.globalStats.totalSessions,b=e.playerProfile.lastPlayedGameId&&((a=$.games.find(y=>y.id===e.playerProfile.lastPlayedGameId))==null?void 0:a.title);K=e.globalLevel;const m=D(e),c=r.user?`<span class="chip success">Cloud : ${te()}</span>`:r.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          ${Se(e.playerProfile.avatarUrl,e.playerProfile.avatar)}
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${b?`Dernier jeu : ${b}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${c}
              <span class="chip">⏱ ${l}</span>
              <span class="chip">🎮 ${h} sessions</span>
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
            <strong>${t}/${s}</strong>
            <p class="muted small">Schema v${e.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${l}</strong>
            <p class="muted small">Sessions ${h}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${m.title}</strong>
            <p class="muted small">Temps ${m.duration}</p>
          </div>
        </div>
      </div>
      ${ke(e)}
      <div class="level-row ${n?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${o}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(p.levelProgress*100)}% · ${p.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <p class="muted small hero-note">Profil éditable depuis la page dédiée.</p>
    </header>
  `}function Te(){const e=$.games.length?[]:["games.registry.json vide ou invalide"],t=new Set(p.save.favorites||[]),s=Array.from(new Set($.games.flatMap(a=>a.tags||[]).filter(Boolean))).sort((a,y)=>a.localeCompare(y,"fr")),n=G.trim().toLowerCase(),o=G.replace(/"/g,"&quot;"),l=$.games.filter(a=>U?t.has(a.id):!0).filter(a=>I==="all"?!0:(a.tags||[]).includes(I)).filter(a=>n?a.title.toLowerCase().includes(n)||a.description.toLowerCase().includes(n)||a.id.toLowerCase().includes(n):!0).sort((a,y)=>{const d=Number(t.has(y.id))-Number(t.has(a.id));return d!==0?d:(a.order??0)-(y.order??0)}),h=l.map(a=>{ee.find(j=>j.id===a.id)||e.push(`Config manquante pour ${a.id}`);const d=p.save.games[a.id],x=d!=null&&d.lastPlayedAt?q(d.lastPlayedAt):"Jamais",L=(d==null?void 0:d.bestScore)??null,T=C(d==null?void 0:d.timePlayedMs),R=Q(`/apps/games/${a.id}/`),J=t.has(a.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${a.previewEmoji||"🎮"} ${a.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${J?"active":""}" data-game="${a.id}" title="${J?"Retirer des favoris":"Ajouter aux favoris"}">
                ${J?"★":"☆"}
              </button>
              <span class="muted">MAJ ${a.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${a.description}</p>
          <div class="tags">${a.tags.map(j=>`<span class="tag">${j}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${T}</span>
            <span class="chip ghost">🏆 ${L??"—"}</span>
            <span class="chip ghost">🕘 ${x}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${R}" data-game="${a.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${a.id}">Aide</button>
          </div>
        </article>
      `}).join(""),b=U||I!=="all"||!!n,m=l.length,c=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
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
            value="${o}"
          />
        </div>
        <div class="filter group">
          <button class="chip-btn ${I==="all"?"active":""}" data-category="all">Toutes</button>
          ${s.map(a=>`<button class="chip-btn ${a===I?"active":""}" data-category="${a}">${a}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${U?"active":""}" id="filter-fav">
            ★ Favoris ${t.size?`<span class="badge">${t.size}</span>`:""}
          </button>
          <span class="muted small">${m}/${$.games.length} jeux</span>
          ${b?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${c}
      <div class="grid">${h||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function Ue(){const e=new Set(p.save.achievementsUnlocked),t=M.achievements.map(s=>`
        <article class="card achievement ${e.has(s.id)?"unlocked":""}">
          <div class="pill accent">${s.icon||"⭐️"}</div>
          <div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
            <p class="muted">${Me(s)}</p>
          </div>
          <div class="reward">+${s.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${M.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${t}</div>
    </section>
  `}function Me(e){const t=e.condition;return t.type==="eventCount"?`${t.count}x ${t.event}`:t.type==="xpReached"?`${t.xp} XP globaux`:t.type==="gamesPlayed"?`${t.count} jeux différents`:t.type==="streak"?`${t.count} ${t.event} d'affilée`:t.type==="playerXpName"?`${t.xp} XP et pseudo "${t.name}"`:""}function Re(){var m;const e=p.save,t=Object.entries(e.games||{}),s=Math.max(1,...t.map(([,c])=>Math.max(c.timePlayedMs??0,1))),n=e.achievementsUnlocked.length,o=M.achievements.length,l=t.map(([c,a])=>({id:c,last:a.lastPlayedAt||0})).sort((c,a)=>a.last-c.last)[0],h=l&&l.last?((m=$.games.find(c=>c.id===l.id))==null?void 0:m.title)||l.id:"Aucun jeu",b=t.length===0?"<p class='muted'>Pas encore de données de jeu.</p>":t.map(([c,a])=>{var x;const y=((x=$.games.find(L=>L.id===c))==null?void 0:x.title)||c,d=Math.max(5,Math.round((a.timePlayedMs||0)/s*100));return`
            <div class="chart-row">
              <div>
                <strong>${y}</strong>
                <p class="muted small">${C(a.timePlayedMs)} · ${a.bestScore?`Best ${a.bestScore}`:"Aucun score"} · ${a.lastPlayedAt?q(a.lastPlayedAt):"Jamais"}</p>
              </div>
              <div class="chart-bar">
                <span style="width:${d}%"></span>
              </div>
            </div>
          `}).join("");return`
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Stats</p>
          <h2>Vue d'ensemble</h2>
          <p class="muted">Activité, temps de jeu et progression globale.</p>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat-card">
          <p class="label">Temps total</p>
          <strong>${C(e.globalStats.timePlayedMs)}</strong>
          <p class="muted small">${e.globalStats.totalSessions} sessions</p>
        </div>
        <div class="stat-card">
          <p class="label">Jeux joués</p>
          <strong>${Object.keys(e.games).length}/${$.games.length}</strong>
          <p class="muted small">Dernier : ${h}</p>
        </div>
        <div class="stat-card">
          <p class="label">Succès</p>
          <strong>${n}/${o}</strong>
          <p class="muted small">Schema v${e.schemaVersion}</p>
        </div>
        <div class="stat-card">
          <p class="label">Jeu le plus joué</p>
          <strong>${D(e).title}</strong>
          <p class="muted small">${D(e).duration}</p>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Temps par jeu</p>
          <h2>Répartition</h2>
          <p class="muted">Temps passé, scores et derniers lancements.</p>
        </div>
      </div>
      <div class="chart-list">
        ${b}
      </div>
    </section>
  `}function Je(){var b;const e=p.save,t=Object.entries(e.games||{}),s=D(e),n=r.lastSyncedAt?q(r.lastSyncedAt):"Jamais",o=e.playerProfile.lastPlayedGameId&&((b=$.games.find(m=>m.id===e.playerProfile.lastPlayedGameId))==null?void 0:b.title),l=le(),h=se(!!l);return`
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Profil</p>
          <h2>Identité & avatar</h2>
          <p class="muted small">Pseudo lié au compte cloud. Emoji modifiable, image stockée sur Supabase.</p>
        </div>
        <span class="chip ghost">Sync : ${n}</span>
      </div>
      <div class="profile-identity">
        <div class="avatar-panel">
          <div class="avatar ${l?"has-image":""}" id="profile-avatar-preview">
            ${l?`<img src="${l}" alt="Avatar" />`:e.playerProfile.avatar||"🎮"}
          </div>
          <p class="muted small" id="profile-avatar-helper">${h}</p>
          <label class="file-drop">
            <input type="file" id="profile-avatar-upload" accept="image/*" />
            <strong>Image Supabase</strong>
            <span class="muted small">PNG/JPG · 1.5 Mo max</span>
          </label>
          <button class="btn ghost danger" id="profile-avatar-clear" type="button" ${l?"":"disabled"}>Revenir à l'emoji</button>
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
              <strong>${o||"Aucun jeu lancé"}</strong>
            </div>
            <div>
              <span class="label">Jeu le plus joué</span>
              <strong>${s.title}</strong>
              <p class="muted small">${s.duration}</p>
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
        <span class="chip success">Connecté : ${te()}</span>
      </div>
      <div class="actions-grid">
        <button class="btn primary" id="cloud-save" ${r.loading?"disabled":""}>Sauvegarder vers cloud</button>
        <button class="btn ghost" id="cloud-load" ${r.loading?"disabled":""}>Charger depuis cloud</button>
        <button class="btn ghost danger" id="cloud-logout" ${r.loading?"disabled":""}>Déconnexion</button>
      </div>
      <p class="muted small">Dernière synchro : ${n}</p>
      ${r.message?`<p class="status ok">${r.message}</p>`:'<p class="status info">Tes données locales sont synchronisées sur demande.</p>'}
      ${r.error?`<p class="status error">${r.error}</p>`:""}
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
          <strong>${C(e.globalStats.timePlayedMs)}</strong>
        </div>
        <div>
          <span class="label">Jeux joués</span>
          <strong>${Object.keys(e.games).length}/${$.games.length}</strong>
        </div>
        <div>
          <span class="label">Succès</span>
          <strong>${e.achievementsUnlocked.length}/${M.achievements.length}</strong>
        </div>
      </div>
      <div class="save-list">
        ${t.length?t.map(([m,c])=>`
          <div class="save-row">
            <div>
              <strong>${m}</strong>
              <p class="muted small">v${c.saveSchemaVersion} · Dernier : ${q(c.lastPlayedAt)}</p>
            </div>
            <div class="chips-row">
              <span class="chip ghost">⏱ ${C(c.timePlayedMs)}</span>
              <span class="chip ghost">🏆 ${c.bestScore??"—"}</span>
            </div>
          </div>
        `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
      </div>
    </section>
  `}function A(){if(!r.user){F.innerHTML=Ce(),Ne();return}F.innerHTML=`
    <div class="layout">
      ${Ie()}
      ${Be()}
      ${E==="hub"?Te():""}
      ${E==="achievements"?Ue():""}
      ${E==="stats"?Re():""}
      ${E==="profile"?Je():""}
    </div>
  `,Oe()}function Ne(){const e=document.getElementById("gate-login"),t=document.getElementById("gate-register");e==null||e.addEventListener("click",async()=>{var o,l;const s=((o=document.getElementById("gate-identifier"))==null?void 0:o.value)||"",n=((l=document.getElementById("gate-password"))==null?void 0:l.value)||"";await N("login",{identifier:s,password:n})}),t==null||t.addEventListener("click",async()=>{var o,l;const s=((o=document.getElementById("gate-identifier"))==null?void 0:o.value)||"",n=((l=document.getElementById("gate-password"))==null?void 0:l.value)||"";await N("register",{identifier:s,password:n})})}function Oe(){document.querySelectorAll(".nav-btn").forEach(i=>{i.addEventListener("click",()=>{E=i.dataset.tab,A()})});const e=document.getElementById("open-profile");e==null||e.addEventListener("click",()=>{E="profile",A()});const t=document.getElementById("player-name"),s=document.getElementById("player-avatar");t&&s&&E!=="profile"&&(t.addEventListener("change",()=>W(t.value,(s==null?void 0:s.value)||"🎮")),s.addEventListener("change",()=>W((t==null?void 0:t.value)||"Joueur",s.value))),document.querySelectorAll(".help-btn").forEach(i=>{i.addEventListener("click",()=>{const v=i.dataset.help,u=ee.find(g=>g.id===v);u&&f(u.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(i=>{i.addEventListener("click",()=>{const v=i.dataset.game;v&&xe(v)})});const n=document.getElementById("export-save");n==null||n.addEventListener("click",Ae);const o=document.getElementById("reset-save");o==null||o.addEventListener("click",()=>Y()),document.querySelectorAll(".reset-game").forEach(i=>{i.addEventListener("click",()=>{const v=i.dataset.game;Y(v)})});const l=document.getElementById("import-btn"),h=document.getElementById("import-text");l==null||l.addEventListener("click",()=>h&&we(h.value));const b=document.getElementById("cloud-login"),m=document.getElementById("cloud-register"),c=document.getElementById("cloud-logout"),a=document.getElementById("cloud-save"),y=document.getElementById("cloud-load");b==null||b.addEventListener("click",async()=>{var u,g;const i=((u=document.getElementById("cloud-identifier"))==null?void 0:u.value)||"",v=((g=document.getElementById("cloud-password"))==null?void 0:g.value)||"";await N("login",{identifier:i,password:v})}),m==null||m.addEventListener("click",async()=>{var u,g;const i=((u=document.getElementById("cloud-identifier"))==null?void 0:u.value)||"",v=((g=document.getElementById("cloud-password"))==null?void 0:g.value)||"";await N("register",{identifier:i,password:v})}),c==null||c.addEventListener("click",async()=>{await N("logout"),S=null,w=!1,k()}),a==null||a.addEventListener("click",Le),y==null||y.addEventListener("click",je);const d=document.getElementById("profile-avatar-upload"),x=document.getElementById("profile-avatar-clear"),L=document.getElementById("profile-save");d==null||d.addEventListener("change",i=>{var g;const v=i.target,u=(g=v.files)==null?void 0:g[0];if(u){if(!u.type.startsWith("image/")){f("Seules les images sont autorisées.","error"),v.value="";return}if(u.size>1.5*1024*1024){f("Image trop lourde (1.5 Mo max).","error"),v.value="";return}k(),S=u,O=URL.createObjectURL(u),w=!1,H()}}),x==null||x.addEventListener("click",()=>{w=!0,S=null,k(),H()}),L==null||L.addEventListener("click",async()=>{const i=document.getElementById("player-avatar"),v=((i==null?void 0:i.value)||"🎮").slice(0,4),u=p.save.playerProfile.avatarStoragePath;let g=p.save.playerProfile.avatarUrl,X=u;if(S){const P=await ye(S,u||void 0);if(!P.url||!P.path||P.error){f(P.error||"Upload avatar impossible","error");return}g=P.url,X=P.path}else w&&(g=void 0,X=void 0,u&&r.ready&&r.user&&await $e(u));_(P=>{P.playerProfile.avatar=v,P.playerProfile.avatarUrl=g,P.playerProfile.avatarStoragePath=X,P.playerProfile.avatarType=g?"image":"emoji"}),S=null,w=!1,k(),f("Profil mis à jour","success"),B()});const T=document.getElementById("search-games"),R=document.getElementById("filter-fav"),J=Array.from(document.querySelectorAll(".chip-btn[data-category]")),j=document.getElementById("clear-filters");T==null||T.addEventListener("input",()=>{G=T.value,A()}),J.forEach(i=>{i.addEventListener("click",()=>{I=i.dataset.category||"all",A()})}),R==null||R.addEventListener("click",()=>{U=!U,A()}),j==null||j.addEventListener("click",()=>{G="",I="all",U=!1,A()}),H()}function B(){p=V(),ne(ae($.hubTheme)),A()}A();
