import{g as E,b as j,a as x,w as C,u as O,k as J,h as M,i as P,j as y}from"./index-Bc-Kp7-P.js";import{s as N,g as A,c as h,a as k,l as L}from"./cloud-10MdCNZ0.js";const R=document.getElementById("app");let a=A();N(e=>{a=e,d()});function D(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function b(e){if(!e)return"0m";const n=Math.floor(e/1e3),t=Math.floor(n/3600),o=Math.floor(n%3600/60),c=n%60;return t?`${t}h ${o}m`:o?`${o}m ${c}s`:`${c}s`}function B(e){var o;if(!e)return"connecté";const n=(o=e.user_metadata)==null?void 0:o.identifier,t=e.email;return n||(t!=null&&t.endsWith("@user.local")?t.replace("@user.local",""):t||"connecté")}function T(e){const n=Object.entries(e.save.games||{});if(!n.length)return{title:"Aucun jeu",duration:"0m"};const[t,o]=n.sort((u,v)=>(v[1].timePlayedMs||0)-(u[1].timePlayedMs||0))[0],c=x().games.find(u=>u.id===t);return{title:(c==null?void 0:c.title)||t,duration:b(o.timePlayedMs)}}function f(e,n="info"){const t=document.createElement("div");t.className=`toast ${n}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),240)},2400)}function d(){var g;const e=E(),n=j().achievements,t=new Set(e.save.achievementsUnlocked),o=x(),c=Object.entries(e.save.games),u=a!=null&&a.user?"disabled":"",v=T(e);R.innerHTML=`
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            <div class="avatar">${e.save.playerProfile.avatar||"🎮"}</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>${e.save.playerProfile.name||"Joueur"}</h1>
              <p class="muted">${e.save.playerProfile.lastPlayedGameId?`Dernier jeu : ${((g=o.games.find(p=>p.id===e.save.playerProfile.lastPlayedGameId))==null?void 0:g.title)??"Inconnu"}`:"Aucun jeu lancé"}</p>
            </div>
          </div>
          <div class="chips">
            ${a.user?`<span class="chip success">Cloud : ${B(a.user)}</span>`:a.ready?'<span class="chip warning">Cloud : non connecté</span>':'<span class="chip warning">Supabase non configuré</span>'}
            <span class="chip">⏱ ${b(e.save.globalStats.timePlayedMs)}</span>
            <span class="chip">🎮 ${e.save.globalStats.totalSessions} sessions</span>
          </div>
          <div class="identity-actions">
            <a class="btn primary strong" href="${C("/")}">Retour hub</a>
            <button class="btn ghost" id="cloud-save-now">Sauvegarder cloud</button>
            <button class="btn ghost" id="cloud-load-now">Charger cloud</button>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <p class="label">Niveau</p>
            <strong>${e.save.globalLevel}</strong>
            <p class="muted small">${e.save.globalXP} XP</p>
          </div>
          <div class="stat-card">
            <p class="label">Succès</p>
            <strong>${t.size}/${n.length}</strong>
            <p class="muted small">Schema v${e.save.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${b(e.save.globalStats.timePlayedMs)}</strong>
            <p class="muted small">Sessions ${e.save.globalStats.totalSessions}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${v.title}</strong>
            <p class="muted small">${v.duration}</p>
          </div>
        </div>
      </header>

      <div class="sections">
        <div class="grid-two">
          <section class="card">
            <h2>Identité</h2>
            <p class="muted small">Pseudo verrouillé si connecté en cloud. Avatar toujours modifiable.</p>
            <div class="form">
              <label>Pseudo <input id="name" value="${e.save.playerProfile.name}" maxlength="18" ${u} /></label>
              <label>Avatar (emoji) <input id="avatar" value="${e.save.playerProfile.avatar}" maxlength="4" /></label>
              <div class="actions">
                <button class="btn primary" id="save-profile">Enregistrer</button>
                <button class="btn ghost danger" id="reset">Reset global</button>
              </div>
            </div>
          </section>

          <section class="card">
            <h2>Cloud Supabase</h2>
            <p class="muted small">Synchronisation cross-device (Spark gratuit). Identifiant + mot de passe.</p>
            ${a!=null&&a.user?`<div class="status ok">Connecté : ${B(a.user)}</div>
                   <div class="actions">
                     <button class="btn primary" id="cloud-save">Sauvegarder vers cloud</button>
                     <button class="btn ghost" id="cloud-load">Charger depuis cloud</button>
                     <button class="btn ghost danger" id="cloud-logout">Déconnexion</button>
                   </div>
                   <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save).</p>`:`<div class="form">
                     <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
                     <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                     <div class="actions">
                       <button class="btn primary" id="cloud-login">Connexion</button>
                       <button class="btn ghost" id="cloud-register">Créer un compte</button>
                     </div>
                     <div class="status ${a!=null&&a.error?"error":"info"}">${(a==null?void 0:a.message)??"Non connecté"}</div>
                   </div>`}
          </section>
        </div>

        <section class="card">
          <h2>Gestion des sauvegardes</h2>
          <p class="muted small">Export/Import JSON et stats locales. Les actions cloud ci-dessus restent disponibles.</p>
          <div class="actions">
            <button class="btn ghost" id="export">Exporter JSON</button>
            <button class="btn ghost danger" id="reset-save">Reset global</button>
          </div>
          <label>Import JSON
            <textarea id="import" placeholder="Colle ici ton export JSON"></textarea>
            <button class="btn primary" id="import-btn">Importer</button>
          </label>
          <div class="save-meta">
            <div>
              <span class="label">Temps global</span>
              <strong>${b(e.save.globalStats.timePlayedMs)}</strong>
            </div>
            <div>
              <span class="label">Jeux joués</span>
              <strong>${Object.keys(e.save.games).length}/${o.games.length}</strong>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${e.save.globalStats.totalSessions}</strong>
            </div>
          </div>
          <div class="save-list">
            ${c.length?c.map(([p,m])=>`
              <div class="save-row">
                <div>
                  <strong>${p}</strong>
                  <p class="muted small">v${m.saveSchemaVersion} · Dernier : ${D(m.lastPlayedAt)}</p>
                </div>
                <div class="chips-row">
                  <span class="chip ghost">⏱ ${b(m.timePlayedMs)}</span>
                  <span class="chip ghost">🏆 ${m.bestScore??"—"}</span>
                </div>
              </div>
            `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
          </div>
        </section>
      </div>
    </div>
  `,U()}function U(){var t,o,c,u,v,g,p,m,$,S,I,w;const e=document.getElementById("name"),n=document.getElementById("avatar");(t=document.getElementById("save-profile"))==null||t.addEventListener("click",()=>{O(s=>{const l=s.playerProfile.name,i=a!=null&&a.user?l:((e==null?void 0:e.value)||"Joueur").slice(0,18);s.playerProfile.name=i,s.playerProfile.avatar=((n==null?void 0:n.value)||"🎮").slice(0,4)}),J({type:"PROFILE_UPDATED"}),d()}),(o=document.getElementById("export"))==null||o.addEventListener("click",()=>{const s=M(),l=new Blob([s],{type:"application/json"}),i=URL.createObjectURL(l),r=document.createElement("a");r.href=i,r.download="arcade-galaxy-save.json",r.click(),URL.revokeObjectURL(i)}),(c=document.getElementById("reset"))==null||c.addEventListener("click",()=>{P(),d()}),(u=document.getElementById("import-btn"))==null||u.addEventListener("click",()=>{var i;const s=((i=document.getElementById("import"))==null?void 0:i.value)||"",l=y(s);l.success?d():alert(l.error||"Import impossible")}),(v=document.getElementById("reset-save"))==null||v.addEventListener("click",()=>{P(),d()}),(g=document.getElementById("cloud-login"))==null||g.addEventListener("click",async()=>{var i,r;const s=((i=document.getElementById("cloud-identifier"))==null?void 0:i.value)||"",l=((r=document.getElementById("cloud-password"))==null?void 0:r.value)||"";await h("login",{identifier:s,password:l}),d()}),(p=document.getElementById("cloud-register"))==null||p.addEventListener("click",async()=>{var i,r;const s=((i=document.getElementById("cloud-identifier"))==null?void 0:i.value)||"",l=((r=document.getElementById("cloud-password"))==null?void 0:r.value)||"";await h("register",{identifier:s,password:l}),d()}),(m=document.getElementById("cloud-logout"))==null||m.addEventListener("click",async()=>{await h("logout"),d()}),($=document.getElementById("cloud-save"))==null||$.addEventListener("click",async()=>{const s=E();await k(s.save)&&alert("Sauvegarde envoyée dans le cloud.")}),(S=document.getElementById("cloud-load"))==null||S.addEventListener("click",async()=>{const s=await L();s!=null&&s.state?(y(JSON.stringify(s.state)),alert("Sauvegarde cloud importée."),d()):s!=null&&s.error&&alert(s.error)}),(I=document.getElementById("cloud-save-now"))==null||I.addEventListener("click",async()=>{const s=E(),l=await k(s.save);f(l?"Sauvegarde envoyée":"Erreur cloud",l?"success":"error")}),(w=document.getElementById("cloud-load-now"))==null||w.addEventListener("click",async()=>{const s=await L();s!=null&&s.state?(y(JSON.stringify(s.state)),f("Sauvegarde cloud importée","success"),d()):s!=null&&s.error&&f(s.error,"error")})}d();
