import{g as E,b as j,a as B,w as C,u as O,k as J,h as M,i as w,j as y}from"./index-Bc-Kp7-P.js";import{g as x,c as f,a as P,l as k}from"./cloud-10MdCNZ0.js";const N=document.getElementById("app");function A(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function b(e){if(!e)return"0m";const n=Math.floor(e/1e3),a=Math.floor(n/3600),l=Math.floor(n%3600/60),t=n%60;return a?`${a}h ${l}m`:l?`${l}m ${t}s`:`${t}s`}function L(e){var l;if(!e)return"connecté";const n=(l=e.user_metadata)==null?void 0:l.identifier,a=e.email;return n||(a!=null&&a.endsWith("@user.local")?a.replace("@user.local",""):a||"connecté")}function R(e){const n=Object.entries(e.save.games||{});if(!n.length)return{title:"Aucun jeu",duration:"0m"};const[a,l]=n.sort((r,v)=>(v[1].timePlayedMs||0)-(r[1].timePlayedMs||0))[0],t=B().games.find(r=>r.id===a);return{title:(t==null?void 0:t.title)||a,duration:b(l.timePlayedMs)}}function h(e,n="info"){const a=document.createElement("div");a.className=`toast ${n}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("visible")),setTimeout(()=>{a.classList.remove("visible"),setTimeout(()=>a.remove(),240)},2400)}function d(){var g;const e=E(),n=j().achievements,a=new Set(e.save.achievementsUnlocked),l=B(),t=x(),r=Object.entries(e.save.games),v=t!=null&&t.user?"disabled":"",p=R(e);N.innerHTML=`
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            <div class="avatar">${e.save.playerProfile.avatar||"🎮"}</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>${e.save.playerProfile.name||"Joueur"}</h1>
              <p class="muted">${e.save.playerProfile.lastPlayedGameId?`Dernier jeu : ${((g=l.games.find(m=>m.id===e.save.playerProfile.lastPlayedGameId))==null?void 0:g.title)??"Inconnu"}`:"Aucun jeu lancé"}</p>
            </div>
          </div>
          <div class="chips">
            ${t.user?`<span class="chip success">Cloud : ${L(t.user)}</span>`:t.ready?'<span class="chip warning">Cloud : non connecté</span>':'<span class="chip warning">Supabase non configuré</span>'}
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
            <strong>${a.size}/${n.length}</strong>
            <p class="muted small">Schema v${e.save.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${b(e.save.globalStats.timePlayedMs)}</strong>
            <p class="muted small">Sessions ${e.save.globalStats.totalSessions}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${p.title}</strong>
            <p class="muted small">${p.duration}</p>
          </div>
        </div>
      </header>

      <div class="sections">
        <div class="grid-two">
          <section class="card">
            <h2>Identité</h2>
            <p class="muted small">Pseudo verrouillé si connecté en cloud. Avatar toujours modifiable.</p>
            <div class="form">
              <label>Pseudo <input id="name" value="${e.save.playerProfile.name}" maxlength="18" ${v} /></label>
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
            ${t!=null&&t.user?`<div class="status ok">Connecté : ${L(t.user)}</div>
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
                     <div class="status ${t!=null&&t.error?"error":"info"}">${(t==null?void 0:t.message)??"Non connecté"}</div>
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
              <strong>${Object.keys(e.save.games).length}/${l.games.length}</strong>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${e.save.globalStats.totalSessions}</strong>
            </div>
          </div>
          <div class="save-list">
            ${r.length?r.map(([m,u])=>`
              <div class="save-row">
                <div>
                  <strong>${m}</strong>
                  <p class="muted small">v${u.saveSchemaVersion} · Dernier : ${A(u.lastPlayedAt)}</p>
                </div>
                <div class="chips-row">
                  <span class="chip ghost">⏱ ${b(u.timePlayedMs)}</span>
                  <span class="chip ghost">🏆 ${u.bestScore??"—"}</span>
                </div>
              </div>
            `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
          </div>
        </section>
      </div>
    </div>
  `,D()}function D(){var a,l,t,r,v,p,g,m,u,$,S,I;const e=document.getElementById("name"),n=document.getElementById("avatar");(a=document.getElementById("save-profile"))==null||a.addEventListener("click",()=>{const s=x();O(o=>{const i=o.playerProfile.name,c=s!=null&&s.user?i:((e==null?void 0:e.value)||"Joueur").slice(0,18);o.playerProfile.name=c,o.playerProfile.avatar=((n==null?void 0:n.value)||"🎮").slice(0,4)}),J({type:"PROFILE_UPDATED"}),d()}),(l=document.getElementById("export"))==null||l.addEventListener("click",()=>{const s=M(),o=new Blob([s],{type:"application/json"}),i=URL.createObjectURL(o),c=document.createElement("a");c.href=i,c.download="arcade-galaxy-save.json",c.click(),URL.revokeObjectURL(i)}),(t=document.getElementById("reset"))==null||t.addEventListener("click",()=>{w(),d()}),(r=document.getElementById("import-btn"))==null||r.addEventListener("click",()=>{var i;const s=((i=document.getElementById("import"))==null?void 0:i.value)||"",o=y(s);o.success?d():alert(o.error||"Import impossible")}),(v=document.getElementById("reset-save"))==null||v.addEventListener("click",()=>{w(),d()}),(p=document.getElementById("cloud-login"))==null||p.addEventListener("click",async()=>{var i,c;const s=((i=document.getElementById("cloud-identifier"))==null?void 0:i.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await f("login",{identifier:s,password:o}),d()}),(g=document.getElementById("cloud-register"))==null||g.addEventListener("click",async()=>{var i,c;const s=((i=document.getElementById("cloud-identifier"))==null?void 0:i.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await f("register",{identifier:s,password:o}),d()}),(m=document.getElementById("cloud-logout"))==null||m.addEventListener("click",async()=>{await f("logout"),d()}),(u=document.getElementById("cloud-save"))==null||u.addEventListener("click",async()=>{const s=E();await P(s.save)&&alert("Sauvegarde envoyée dans le cloud.")}),($=document.getElementById("cloud-load"))==null||$.addEventListener("click",async()=>{const s=await k();s!=null&&s.state?(y(JSON.stringify(s.state)),alert("Sauvegarde cloud importée."),d()):s!=null&&s.error&&alert(s.error)}),(S=document.getElementById("cloud-save-now"))==null||S.addEventListener("click",async()=>{const s=E(),o=await P(s.save);h(o?"Sauvegarde envoyée":"Erreur cloud",o?"success":"error")}),(I=document.getElementById("cloud-load-now"))==null||I.addEventListener("click",async()=>{const s=await k();s!=null&&s.state?(y(JSON.stringify(s.state)),h("Sauvegarde cloud importée","success"),d()):s!=null&&s.error&&h(s.error,"error")})}d();
