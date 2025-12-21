import{g as k,b as F,a as D,w as H,u as V,k as W,h as X,i as O,j as C}from"./index-DIQBX7Jk.js";import{s as z,g as q,u as Y,r as K,c as B,a as Q,l as Z,b as M}from"./cloud-Cv-CswlC.js";const ee=document.getElementById("app");let a=q(),h=k(),f=null,l=null,g=!1,R=!1;const te=1.5*1024*1024;z(e=>{a=e,R||b()});function J(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function L(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),i=Math.floor(s%3600/60),d=s%60;return t?`${t}h ${i}m`:i?`${i}m ${d}s`:`${d}s`}function N(e){var i;if(!e)return"connecté";const s=(i=e.user_metadata)==null?void 0:i.identifier,t=e.email;return s||(t!=null&&t.endsWith("@user.local")?t.replace("@user.local",""):t||"connecté")}function ae(e){const s=Object.entries(e.save.games||{});if(!s.length)return{title:"Aucun jeu",duration:"0m"};const[t,i]=s.sort((v,m)=>(m[1].timePlayedMs||0)-(v[1].timePlayedMs||0))[0],d=D().games.find(v=>v.id===t);return{title:(d==null?void 0:d.title)||t,duration:L(i.timePlayedMs)}}function u(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),240)},2400)}function se(e){return/^https?:\/\//i.test(e)||e.startsWith("blob:")||e.startsWith("data:")}function x(e,s){if(e){const t=e.trim();return se(t)?t:M(s||t)||null}return M(s)||null}function T(e,s,t,i){const d=x(s,i),v=!!d;return`<div class="avatar ${v?"has-image":""}" id="${e}">
    ${v?`<img src="${d}" alt="Avatar" />`:`<span>${t}</span>`}
  </div>`}function G(e){return e?"Image utilisée pour l'avatar (stockée sur Supabase). L'emoji reste disponible en secours.":a.ready?a.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image. Emoji disponible hors-ligne.":"Supabase non configuré (.env)."}function j(){var y;const e=((y=document.getElementById("avatar"))==null?void 0:y.value)||"🎮",s=document.getElementById("avatar-preview"),t=document.getElementById("avatar-helper"),i=document.getElementById("avatar-clear"),d=x(h.save.playerProfile.avatarUrl,h.save.playerProfile.avatarStoragePath),v=g?null:l||d,m=!!v;s&&(s.classList.toggle("has-image",m),s.innerHTML=m?`<img src="${v}" alt="Avatar" />`:`<span>${e}</span>`),t&&(t.textContent=G(m)),i&&(i.disabled=!m)}function b(){var n;h=k();const e=h,s=F().achievements,t=new Set(e.save.achievementsUnlocked),i=D(),d=Object.entries(e.save.games),v=a!=null&&a.user?"disabled":"",m=ae(e),y=a.lastSyncedAt?J(a.lastSyncedAt):"Jamais",P=e.save.playerProfile.avatar||"🎮",$=x(e.save.playerProfile.avatarUrl,e.save.playerProfile.avatarStoragePath),E=g?null:l||$,I=G(!!E),S=e.save.playerProfile.lastPlayedGameId?((n=i.games.find(o=>o.id===e.save.playerProfile.lastPlayedGameId))==null?void 0:n.title)??"Inconnu":null,A=a.user?`<span class="chip success">Cloud : ${N(a.user)}</span>`:a.ready?'<span class="chip ghost">Cloud : non connecté</span>':'<span class="chip warning">Supabase non configuré</span>';ee.innerHTML=`
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            ${T("avatar-hero",$,P,e.save.playerProfile.avatarStoragePath)}
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>${e.save.playerProfile.name||"Joueur"}</h1>
              <p class="muted">${S?`Dernier jeu : ${S}`:"Aucun jeu lancé"}</p>
            </div>
          </div>
          <div class="chips">
            ${A}
            <span class="chip ghost">Sync : ${y}</span>
            <span class="chip">⏱ ${L(e.save.globalStats.timePlayedMs)}</span>
            <span class="chip">🎮 ${e.save.globalStats.totalSessions} sessions</span>
          </div>
          <div class="identity-actions">
            <a class="btn primary strong" href="${H("/")}">Retour hub</a>
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
            <strong>${t.size}/${s.length}</strong>
            <p class="muted small">Schema v${e.save.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${L(e.save.globalStats.timePlayedMs)}</strong>
            <p class="muted small">Sessions ${e.save.globalStats.totalSessions}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${m.title}</strong>
            <p class="muted small">${m.duration}</p>
          </div>
        </div>
      </header>

      <div class="sections">
        <div class="grid-two">
          <section class="card">
            <div class="section-head">
              <div>
                <h2>Identité</h2>
                <p class="muted small">Pseudo verrouillé si connecté en cloud. Avatar toujours modifiable.</p>
              </div>
              <span class="chip ghost">Avatar image</span>
            </div>
            <div class="identity-grid">
            <div class="avatar-panel">
                ${T("avatar-preview",E,P,e.save.playerProfile.avatarStoragePath)}
                <p class="muted small" id="avatar-helper">${I}</p>
                <div class="avatar-actions">
                  <label class="file-drop">
                    <input type="file" id="avatar-upload" accept="image/*" />
                    <strong>Image de profil (Supabase)</strong>
                    <span class="muted small">PNG/JPG · 1.5 Mo max</span>
                  </label>
                  <button class="btn ghost danger" id="avatar-clear" type="button" ${E?"":"disabled"}>Revenir à l'emoji</button>
                </div>
              </div>
              <div class="form">
                <label>Pseudo <input id="name" value="${e.save.playerProfile.name}" maxlength="18" ${v} /></label>
                <label>Avatar (emoji) <input id="avatar" value="${P}" maxlength="4" /></label>
                <div class="actions stretch">
                  <button class="btn primary" id="save-profile" type="button">Enregistrer</button>
                  <button class="btn ghost danger" id="reset" type="button">Reset global</button>
                </div>
              </div>
            </div>
          </section>

          <section class="card">
            <h2>Cloud Supabase</h2>
            <p class="muted small">Synchronisation cross-device (Spark gratuit). Identifiant + mot de passe.</p>
            ${a!=null&&a.user?`<div class="status ok">Connecté : ${N(a.user)}</div>
                   <div class="actions stretch">
                     <button class="btn primary" id="cloud-save" type="button">Sauvegarder vers cloud</button>
                     <button class="btn ghost" id="cloud-load" type="button">Charger depuis cloud</button>
                     <button class="btn ghost danger" id="cloud-logout" type="button">Déconnexion</button>
                   </div>
                   <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save). Dernière synchro : ${y}.</p>`:`<div class="form">
                     <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
                     <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                     <div class="actions stretch">
                       <button class="btn primary" id="cloud-login" type="button">Connexion</button>
                       <button class="btn ghost" id="cloud-register" type="button">Créer un compte</button>
                     </div>
                     <div class="status ${a!=null&&a.error?"error":"info"}">${(a==null?void 0:a.message)??"Non connecté"}</div>
                   </div>`}
          </section>
        </div>

        <section class="card">
          <div class="section-head">
            <div>
              <h2>Gestion des sauvegardes</h2>
              <p class="muted small">Export/Import JSON et stats locales. Les actions cloud ci-dessus restent disponibles.</p>
            </div>
            <span class="chip ghost">Local</span>
          </div>
          <div class="actions stretch">
            <button class="btn ghost" id="export" type="button">Exporter JSON</button>
            <button class="btn ghost danger" id="reset-save" type="button">Reset global</button>
          </div>
          <label>Import JSON
            <textarea id="import" placeholder="Colle ici ton export JSON"></textarea>
            <button class="btn primary" id="import-btn" type="button">Importer</button>
          </label>
          <div class="save-meta">
            <div>
              <span class="label">Temps global</span>
              <strong>${L(e.save.globalStats.timePlayedMs)}</strong>
            </div>
            <div>
              <span class="label">Jeux joués</span>
              <strong>${Object.keys(e.save.games).length}/${i.games.length}</strong>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${e.save.globalStats.totalSessions}</strong>
            </div>
          </div>
          <div class="save-list">
            ${d.length?d.map(([o,r])=>`
              <div class="save-row">
                <div>
                  <strong>${o}</strong>
                  <p class="muted small">v${r.saveSchemaVersion} · Dernier : ${J(r.lastPlayedAt)}</p>
                </div>
                <div class="chips-row">
                  <span class="chip ghost">⏱ ${L(r.timePlayedMs)}</span>
                  <span class="chip ghost">🏆 ${r.bestScore??"—"}</span>
                </div>
              </div>
            `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
          </div>
        </section>
      </div>
    </div>
  `,ne()}function ne(){var d,v,m,y,P,$,E,I,S,A;const e=document.getElementById("name"),s=document.getElementById("avatar"),t=document.getElementById("avatar-upload"),i=document.getElementById("avatar-clear");s==null||s.addEventListener("input",j),t==null||t.addEventListener("change",n=>{var c;const o=n.target,r=(c=o.files)==null?void 0:c[0];if(r){if(!a.ready){u("Supabase non configuré pour les avatars.","error"),o.value="";return}if(!a.user){u("Connecte-toi au cloud pour envoyer une image.","error"),o.value="";return}if(!r.type.startsWith("image/")){u("Seules les images sont autorisées.","error"),o.value="";return}if(r.size>te){u("Image trop lourde (1.5 Mo max).","error"),o.value="";return}l&&URL.revokeObjectURL(l),f=r,l=URL.createObjectURL(r),g=!1,j()}}),i==null||i.addEventListener("click",()=>{g=!0,f=null,l&&(URL.revokeObjectURL(l),l=null),j()}),(d=document.getElementById("save-profile"))==null||d.addEventListener("click",async()=>{R=!0;try{const n=h.save.playerProfile.name,o=a!=null&&a.user?n:((e==null?void 0:e.value)||"Joueur").slice(0,18),r=((s==null?void 0:s.value)||"🎮").slice(0,4),c=h.save.playerProfile.avatarStoragePath;let U=h.save.playerProfile.avatarUrl,w=c;if(f){const p=await Y(f,c||void 0);if(!p.url||!p.path||p.error){u(p.error||"Upload avatar impossible","error");return}U=p.url,w=p.path}else g&&(U=void 0,w=void 0,c&&a.ready&&a.user&&await K(c));V(p=>{const _=a!=null&&a.user?p.playerProfile.name:o;p.playerProfile.name=_,p.playerProfile.avatar=r,p.playerProfile.avatarUrl=U,p.playerProfile.avatarStoragePath=w,p.playerProfile.avatarType=U?"image":"emoji"}),f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,W({type:"PROFILE_UPDATED"}),u("Profil mis à jour","success"),b()}finally{R=!1}}),(v=document.getElementById("export"))==null||v.addEventListener("click",()=>{try{const n=X(),o=new Blob([n],{type:"application/json"}),r=URL.createObjectURL(o),c=document.createElement("a");c.href=r,c.download="arcade-galaxy-save.json",document.body.appendChild(c),c.click(),c.remove(),URL.revokeObjectURL(r),u("Export JSON prêt","success")}catch(n){console.error("Export JSON failed",n),u("Export impossible","error")}}),(m=document.getElementById("reset"))==null||m.addEventListener("click",()=>{O(),f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,u("Progression réinitialisée","info"),b()}),(y=document.getElementById("import-btn"))==null||y.addEventListener("click",()=>{var r;const n=((r=document.getElementById("import"))==null?void 0:r.value)||"",o=C(n);o.success?(f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,u("Import réussi","success"),b()):u(o.error||"Import impossible","error")}),(P=document.getElementById("reset-save"))==null||P.addEventListener("click",()=>{O(),u("Sauvegarde locale réinitialisée","info"),b()}),($=document.getElementById("cloud-login"))==null||$.addEventListener("click",async()=>{var r,c;const n=((r=document.getElementById("cloud-identifier"))==null?void 0:r.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await B("login",{identifier:n,password:o}),b()}),(E=document.getElementById("cloud-register"))==null||E.addEventListener("click",async()=>{var r,c;const n=((r=document.getElementById("cloud-identifier"))==null?void 0:r.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await B("register",{identifier:n,password:o}),b()}),(I=document.getElementById("cloud-logout"))==null||I.addEventListener("click",async()=>{await B("logout"),f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,b()}),(S=document.getElementById("cloud-save"))==null||S.addEventListener("click",async()=>{const n=k(),o=await Q(n.save);u(o?"Sauvegarde envoyée dans le cloud.":a.error||"Erreur cloud",o?"success":"error")}),(A=document.getElementById("cloud-load"))==null||A.addEventListener("click",async()=>{const n=await Z();n!=null&&n.state?(C(JSON.stringify(n.state)),f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,u("Sauvegarde cloud importée.","success"),b()):n!=null&&n.error&&u(n.error,"error")}),j()}b();
