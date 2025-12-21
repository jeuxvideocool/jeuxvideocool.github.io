import{a as ce,b as de,d as ue,e as pe,g as V,f as ve,o as me,w as Z,u as _,c as ge,h as fe,r as he,i as be,j as ee,A as ye}from"./index-D6AlT0_O.js";import{s as $e,g as Pe,c as N,u as Ee,r as Se,a as te,l as Ae,b as F,d as we}from"./cloud-CtgX7T7A.js";const z=document.getElementById("app"),$=ce(),M=de(),se=ue(),W=pe();let E="hub",p=V(),K=p.save.globalLevel,o=Pe(),G="",k="all",U=!1,S=null,O=null,A=!1;function ae(){var r;const e=o.user;if(!e)return"connecté";const t=(r=e.user_metadata)==null?void 0:r.identifier,s=e.email;return t||(s!=null&&s.endsWith("@user.local")?s.replace("@user.local",""):s||"connecté")}function re(e){return e?"Image stockée sur Supabase. L'emoji reste disponible en secours.":o.ready?o.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image. Emoji disponible hors-ligne.":"Supabase non configuré (.env)."}ve();le(ne($.hubTheme));$e(e=>{o=e,L()});me("ACHIEVEMENT_UNLOCKED",e=>{var r;const t=(r=e.payload)==null?void 0:r.achievementId,s=M.achievements.find(l=>l.id===t);s&&v(`Succès débloqué : ${s.title}`,"success"),t===ye.achievementId&&L()});function ne(e){return e?W.find(t=>t.id===e):W[0]}function le(e){if(!e)return;const t=document.documentElement.style;t.setProperty("--color-primary",e.colors.primary),t.setProperty("--color-secondary",e.colors.secondary),t.setProperty("--color-accent",e.colors.accent),t.setProperty("--color-bg",e.colors.background),t.setProperty("--color-surface",e.colors.surface),t.setProperty("--color-text",e.colors.text),t.setProperty("--color-muted",e.colors.muted),e.gradient&&t.setProperty("--hero-gradient",e.gradient)}function v(e,t="info"){const s=document.createElement("div");s.className=`toast ${t}`,s.textContent=e,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("visible")),setTimeout(()=>{s.classList.remove("visible"),setTimeout(()=>s.remove(),300)},2600)}function q(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function B(e){if(!e)return"0m";const t=Math.floor(e/1e3),s=Math.floor(t/3600),r=Math.floor(t%3600/60),l=t%60;return s?`${s}h ${r}m`:r?`${r}m ${l}s`:`${l}s`}function D(e){const t=Object.entries(e.games||{});if(!t.length)return{title:"Aucun jeu",duration:"0m"};const[s,r]=t.sort((n,h)=>(h[1].timePlayedMs||0)-(n[1].timePlayedMs||0))[0],l=$.games.find(n=>n.id===s);return{title:(l==null?void 0:l.title)||s,duration:B(r.timePlayedMs)}}function xe(e){return/^https?:\/\//i.test(e)||e.startsWith("blob:")||e.startsWith("data:")}function oe(e,t){if(e){const s=e.trim();return xe(s)?s:F(t||s)||null}return F(t)||null}function Le(e,t,s){const r=(t||"🎮").slice(0,4),l=oe(e,s);return`<div class="avatar ${l?"has-image":""}">${l?`<img src="${l}" alt="Avatar" />`:r}</div>`}function ie(){if(A)return null;const e=oe(p.save.playerProfile.avatarUrl,p.save.playerProfile.avatarStoragePath);return O||e}function C(){O&&(URL.revokeObjectURL(O),O=null)}function H(){const e=document.getElementById("profile-avatar-preview"),t=document.getElementById("profile-avatar-helper"),s=document.getElementById("profile-avatar-clear"),r=ie(),l=p.save.playerProfile.avatar||"🎮",n=!!r;e&&(e.classList.toggle("has-image",n),e.innerHTML=n?`<img src="${r}" alt="Avatar" />`:l),t&&(t.textContent=re(n)),s&&(s.disabled=!n)}function Y(e,t){const s=e.trim()||"Joueur",r=t.trim()||"🎮",l=o.user?p.save.playerProfile.name:s;_(n=>{n.playerProfile.name=l.slice(0,18),n.playerProfile.avatar=r.slice(0,4),n.playerProfile.avatarType=n.playerProfile.avatarUrl?"image":"emoji"}),L()}function je(){const e=fe(),t=new Blob([e],{type:"application/json"}),s=URL.createObjectURL(t),r=document.createElement("a");r.href=s,r.download="nintendo-hub-save.json",r.click(),URL.revokeObjectURL(s),v("Sauvegarde exportée","success")}async function Ie(e){const t=ee(e);if(t.success)if(v("Import réussi","success"),C(),S=null,A=!1,L(),o.user)try{const s=await te(p.save,{allowEmpty:!0});v(s?"Sauvegarde cloud remplacée":o.error||"Erreur cloud",s?"success":"error")}catch(s){console.error("Cloud save failed after import",s),v("Erreur cloud","error")}else o.ready&&v("Connecte-toi pour envoyer l'import sur le cloud","info");else v(t.error||"Import impossible","error")}function Q(e){we(),e?(he(e),v(`Progression de ${e} réinitialisée`,"info")):(be(),v("Progression globale réinitialisée","info")),C(),S=null,A=!1,L()}function ke(e){_(t=>{const s=new Set(t.favorites||[]);s.has(e)?s.delete(e):s.add(e),t.favorites=Array.from(s)}),L()}async function Ce(){const e=V();await te(e.save)?(p=e,v("Sauvegarde envoyée sur le cloud","success")):o.error&&v(o.error,"error")}async function Be(){const e=await Ae();e!=null&&e.state?(ee(JSON.stringify(e.state)),v("Sauvegarde cloud importée","success"),C(),S=null,A=!1,L()):e!=null&&e.error&&v(e.error,"error")}function Te(){return`
    <nav class="nav">
      <button class="nav-btn ${E==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${E==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${E==="stats"?"active":""}" data-tab="stats">Stats</button>
      <button class="nav-btn ${E==="profile"?"active":""}" data-tab="profile">Profil</button>
    </nav>
  `}function Ue(e){return ge(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${Z("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function Me(){return`
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
  `}function Re(){var a;const e=p.save,t=e.achievementsUnlocked.length,s=M.achievements.length,r=e.globalLevel>K,l=`--progress:${p.levelProgress*100}%`,n=B(e.globalStats.timePlayedMs),h=e.globalStats.totalSessions,b=e.playerProfile.lastPlayedGameId&&((a=$.games.find(y=>y.id===e.playerProfile.lastPlayedGameId))==null?void 0:a.title);K=e.globalLevel;const g=D(e),c=o.user?`<span class="chip success">Cloud : ${ae()}</span>`:o.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          ${Le(e.playerProfile.avatarUrl,e.playerProfile.avatar,e.playerProfile.avatarStoragePath)}
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${b?`Dernier jeu : ${b}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${c}
              <span class="chip">⏱ ${n}</span>
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
            <strong>${n}</strong>
            <p class="muted small">Sessions ${h}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${g.title}</strong>
            <p class="muted small">Temps ${g.duration}</p>
          </div>
        </div>
      </div>
      ${Ue(e)}
      <div class="level-row ${r?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${l}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(p.levelProgress*100)}% · ${p.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <p class="muted small hero-note">Profil éditable depuis la page dédiée.</p>
    </header>
  `}function Je(){const e=$.games.length?[]:["games.registry.json vide ou invalide"],t=new Set(p.save.favorites||[]),s=Array.from(new Set($.games.flatMap(a=>a.tags||[]).filter(Boolean))).sort((a,y)=>a.localeCompare(y,"fr")),r=G.trim().toLowerCase(),l=G.replace(/"/g,"&quot;"),n=$.games.filter(a=>U?t.has(a.id):!0).filter(a=>k==="all"?!0:(a.tags||[]).includes(k)).filter(a=>r?a.title.toLowerCase().includes(r)||a.description.toLowerCase().includes(r)||a.id.toLowerCase().includes(r):!0).sort((a,y)=>{const d=Number(t.has(y.id))-Number(t.has(a.id));return d!==0?d:(a.order??0)-(y.order??0)}),h=n.map(a=>{se.find(I=>I.id===a.id)||e.push(`Config manquante pour ${a.id}`);const d=p.save.games[a.id],w=d!=null&&d.lastPlayedAt?q(d.lastPlayedAt):"Jamais",j=(d==null?void 0:d.bestScore)??null,T=B(d==null?void 0:d.timePlayedMs),R=Z(`/apps/games/${a.id}/`),J=t.has(a.id);return`
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
          <div class="tags">${a.tags.map(I=>`<span class="tag">${I}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${T}</span>
            <span class="chip ghost">🏆 ${j??"—"}</span>
            <span class="chip ghost">🕘 ${w}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${R}" data-game="${a.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${a.id}">Aide</button>
          </div>
        </article>
      `}).join(""),b=U||k!=="all"||!!r,g=n.length,c=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
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
          <button class="chip-btn ${k==="all"?"active":""}" data-category="all">Toutes</button>
          ${s.map(a=>`<button class="chip-btn ${a===k?"active":""}" data-category="${a}">${a}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${U?"active":""}" id="filter-fav">
            ★ Favoris ${t.size?`<span class="badge">${t.size}</span>`:""}
          </button>
          <span class="muted small">${g}/${$.games.length} jeux</span>
          ${b?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${c}
      <div class="grid">${h||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function Ne(){const e=new Set(p.save.achievementsUnlocked),t=M.achievements.map(s=>`
        <article class="card achievement ${e.has(s.id)?"unlocked":""}">
          <div class="pill accent">${s.icon||"⭐️"}</div>
          <div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
            <p class="muted">${Oe(s)}</p>
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
  `}function Oe(e){const t=e.condition;return t.type==="eventCount"?`${t.count}x ${t.event}`:t.type==="xpReached"?`${t.xp} XP globaux`:t.type==="gamesPlayed"?`${t.count} jeux différents`:t.type==="streak"?`${t.count} ${t.event} d'affilée`:t.type==="playerXpName"?`${t.xp} XP et pseudo "${t.name}"`:""}function Ge(){var g;const e=p.save,t=Object.entries(e.games||{}),s=Math.max(1,...t.map(([,c])=>Math.max(c.timePlayedMs??0,1))),r=e.achievementsUnlocked.length,l=M.achievements.length,n=t.map(([c,a])=>({id:c,last:a.lastPlayedAt||0})).sort((c,a)=>a.last-c.last)[0],h=n&&n.last?((g=$.games.find(c=>c.id===n.id))==null?void 0:g.title)||n.id:"Aucun jeu",b=t.length===0?"<p class='muted'>Pas encore de données de jeu.</p>":t.map(([c,a])=>{var w;const y=((w=$.games.find(j=>j.id===c))==null?void 0:w.title)||c,d=Math.max(5,Math.round((a.timePlayedMs||0)/s*100));return`
            <div class="chart-row">
              <div>
                <strong>${y}</strong>
                <p class="muted small">${B(a.timePlayedMs)} · ${a.bestScore?`Best ${a.bestScore}`:"Aucun score"} · ${a.lastPlayedAt?q(a.lastPlayedAt):"Jamais"}</p>
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
          <strong>${B(e.globalStats.timePlayedMs)}</strong>
          <p class="muted small">${e.globalStats.totalSessions} sessions</p>
        </div>
        <div class="stat-card">
          <p class="label">Jeux joués</p>
          <strong>${Object.keys(e.games).length}/${$.games.length}</strong>
          <p class="muted small">Dernier : ${h}</p>
        </div>
        <div class="stat-card">
          <p class="label">Succès</p>
          <strong>${r}/${l}</strong>
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
  `}function qe(){var b;const e=p.save,t=Object.entries(e.games||{}),s=D(e),r=o.lastSyncedAt?q(o.lastSyncedAt):"Jamais",l=e.playerProfile.lastPlayedGameId&&((b=$.games.find(g=>g.id===e.playerProfile.lastPlayedGameId))==null?void 0:b.title),n=ie(),h=re(!!n);return`
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Profil</p>
          <h2>Identité & avatar</h2>
          <p class="muted small">Pseudo lié au compte cloud. Emoji modifiable, image stockée sur Supabase.</p>
        </div>
        <span class="chip ghost">Sync : ${r}</span>
      </div>
      <div class="profile-identity">
        <div class="avatar-panel">
          <div class="avatar ${n?"has-image":""}" id="profile-avatar-preview">
            ${n?`<img src="${n}" alt="Avatar" />`:e.playerProfile.avatar||"🎮"}
          </div>
          <p class="muted small" id="profile-avatar-helper">${h}</p>
          <label class="file-drop">
            <input type="file" id="profile-avatar-upload" accept="image/*" />
            <strong>Image Supabase</strong>
            <span class="muted small">PNG/JPG · 1.5 Mo max</span>
          </label>
          <button class="btn ghost danger" id="profile-avatar-clear" type="button" ${n?"":"disabled"}>Revenir à l'emoji</button>
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
        <span class="chip success">Connecté : ${ae()}</span>
      </div>
      <div class="actions-grid">
        <button class="btn primary" id="cloud-save" ${o.loading?"disabled":""}>Sauvegarder vers cloud</button>
        <button class="btn ghost" id="cloud-load" ${o.loading?"disabled":""}>Charger depuis cloud</button>
        <button class="btn ghost danger" id="cloud-logout" ${o.loading?"disabled":""}>Déconnexion</button>
      </div>
      <p class="muted small">Dernière synchro : ${r}</p>
      ${o.message?`<p class="status ok">${o.message}</p>`:'<p class="status info">Tes données locales sont synchronisées sur demande.</p>'}
      ${o.error?`<p class="status error">${o.error}</p>`:""}
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
          <strong>${B(e.globalStats.timePlayedMs)}</strong>
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
        ${t.length?t.map(([g,c])=>`
          <div class="save-row">
            <div>
              <strong>${g}</strong>
              <p class="muted small">v${c.saveSchemaVersion} · Dernier : ${q(c.lastPlayedAt)}</p>
            </div>
            <div class="chips-row">
              <span class="chip ghost">⏱ ${B(c.timePlayedMs)}</span>
              <span class="chip ghost">🏆 ${c.bestScore??"—"}</span>
            </div>
          </div>
        `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
      </div>
    </section>
  `}function x(){if(!o.user){z.innerHTML=Me(),De();return}z.innerHTML=`
    <div class="layout">
      ${Te()}
      ${Re()}
      ${E==="hub"?Je():""}
      ${E==="achievements"?Ne():""}
      ${E==="stats"?Ge():""}
      ${E==="profile"?qe():""}
    </div>
  `,Xe()}function De(){const e=document.getElementById("gate-login"),t=document.getElementById("gate-register");e==null||e.addEventListener("click",async()=>{var l,n;const s=((l=document.getElementById("gate-identifier"))==null?void 0:l.value)||"",r=((n=document.getElementById("gate-password"))==null?void 0:n.value)||"";await N("login",{identifier:s,password:r})}),t==null||t.addEventListener("click",async()=>{var l,n;const s=((l=document.getElementById("gate-identifier"))==null?void 0:l.value)||"",r=((n=document.getElementById("gate-password"))==null?void 0:n.value)||"";await N("register",{identifier:s,password:r})})}function Xe(){document.querySelectorAll(".nav-btn").forEach(i=>{i.addEventListener("click",()=>{E=i.dataset.tab,x()})});const e=document.getElementById("open-profile");e==null||e.addEventListener("click",()=>{E="profile",x()});const t=document.getElementById("player-name"),s=document.getElementById("player-avatar");t&&s&&E!=="profile"&&(t.addEventListener("change",()=>Y(t.value,(s==null?void 0:s.value)||"🎮")),s.addEventListener("change",()=>Y((t==null?void 0:t.value)||"Joueur",s.value))),document.querySelectorAll(".help-btn").forEach(i=>{i.addEventListener("click",()=>{const m=i.dataset.help,u=se.find(f=>f.id===m);u&&v(u.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(i=>{i.addEventListener("click",()=>{const m=i.dataset.game;m&&ke(m)})});const r=document.getElementById("export-save");r==null||r.addEventListener("click",je);const l=document.getElementById("reset-save");l==null||l.addEventListener("click",()=>Q()),document.querySelectorAll(".reset-game").forEach(i=>{i.addEventListener("click",()=>{const m=i.dataset.game;Q(m)})});const n=document.getElementById("import-btn"),h=document.getElementById("import-text");n==null||n.addEventListener("click",()=>h&&Ie(h.value));const b=document.getElementById("cloud-login"),g=document.getElementById("cloud-register"),c=document.getElementById("cloud-logout"),a=document.getElementById("cloud-save"),y=document.getElementById("cloud-load");b==null||b.addEventListener("click",async()=>{var u,f;const i=((u=document.getElementById("cloud-identifier"))==null?void 0:u.value)||"",m=((f=document.getElementById("cloud-password"))==null?void 0:f.value)||"";await N("login",{identifier:i,password:m})}),g==null||g.addEventListener("click",async()=>{var u,f;const i=((u=document.getElementById("cloud-identifier"))==null?void 0:u.value)||"",m=((f=document.getElementById("cloud-password"))==null?void 0:f.value)||"";await N("register",{identifier:i,password:m})}),c==null||c.addEventListener("click",async()=>{await N("logout"),S=null,A=!1,C()}),a==null||a.addEventListener("click",Ce),y==null||y.addEventListener("click",Be);const d=document.getElementById("profile-avatar-upload"),w=document.getElementById("profile-avatar-clear"),j=document.getElementById("profile-save");d==null||d.addEventListener("change",i=>{var f;const m=i.target,u=(f=m.files)==null?void 0:f[0];if(u){if(!u.type.startsWith("image/")){v("Seules les images sont autorisées.","error"),m.value="";return}if(u.size>1.5*1024*1024){v("Image trop lourde (1.5 Mo max).","error"),m.value="";return}C(),S=u,O=URL.createObjectURL(u),A=!1,H()}}),w==null||w.addEventListener("click",()=>{A=!0,S=null,C(),H()}),j==null||j.addEventListener("click",async()=>{const i=document.getElementById("player-avatar"),m=((i==null?void 0:i.value)||"🎮").slice(0,4),u=p.save.playerProfile.avatarStoragePath;let f=p.save.playerProfile.avatarUrl,X=u;if(S){const P=await Ee(S,u||void 0);if(!P.url||!P.path||P.error){v(P.error||"Upload avatar impossible","error");return}f=P.url,X=P.path}else A&&(f=void 0,X=void 0,u&&o.ready&&o.user&&await Se(u));_(P=>{P.playerProfile.avatar=m,P.playerProfile.avatarUrl=f,P.playerProfile.avatarStoragePath=X,P.playerProfile.avatarType=f?"image":"emoji"}),S=null,A=!1,C(),v("Profil mis à jour","success"),L()});const T=document.getElementById("search-games"),R=document.getElementById("filter-fav"),J=Array.from(document.querySelectorAll(".chip-btn[data-category]")),I=document.getElementById("clear-filters");T==null||T.addEventListener("input",()=>{G=T.value,x()}),J.forEach(i=>{i.addEventListener("click",()=>{k=i.dataset.category||"all",x()})}),R==null||R.addEventListener("click",()=>{U=!U,x()}),I==null||I.addEventListener("click",()=>{G="",k="all",U=!1,x()}),H()}function L(){p=V(),le(ne($.hubTheme)),x()}x();
