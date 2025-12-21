import{g as B,b as V,a as _,w as W,u as X,k as q,h as z,i as C,j as O}from"./index-D6AlT0_O.js";import{s as Y,g as K,u as Q,r as Z,d as M,a as J,c as R,l as ee,b as N}from"./cloud-CtgX7T7A.js";const te=document.getElementById("app");let t=K(),h=B(),f=null,i=null,g=!1,k=!1;const ae=1.5*1024*1024;Y(e=>{t=e,k||b()});function T(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function L(e){if(!e)return"0m";const s=Math.floor(e/1e3),a=Math.floor(s/3600),c=Math.floor(s%3600/60),u=s%60;return a?`${a}h ${c}m`:c?`${c}m ${u}s`:`${u}s`}function D(e){var c;if(!e)return"connecté";const s=(c=e.user_metadata)==null?void 0:c.identifier,a=e.email;return s||(a!=null&&a.endsWith("@user.local")?a.replace("@user.local",""):a||"connecté")}function se(e){const s=Object.entries(e.save.games||{});if(!s.length)return{title:"Aucun jeu",duration:"0m"};const[a,c]=s.sort((v,m)=>(m[1].timePlayedMs||0)-(v[1].timePlayedMs||0))[0],u=_().games.find(v=>v.id===a);return{title:(u==null?void 0:u.title)||a,duration:L(c.timePlayedMs)}}function d(e,s="info"){const a=document.createElement("div");a.className=`toast ${s}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("visible")),setTimeout(()=>{a.classList.remove("visible"),setTimeout(()=>a.remove(),240)},2400)}function re(e){return/^https?:\/\//i.test(e)||e.startsWith("blob:")||e.startsWith("data:")}function x(e,s){if(e){const a=e.trim();return re(a)?a:N(s||a)||null}return N(s)||null}function G(e,s,a,c){const u=x(s,c),v=!!u;return`<div class="avatar ${v?"has-image":""}" id="${e}">
    ${v?`<img src="${u}" alt="Avatar" />`:`<span>${a}</span>`}
  </div>`}function F(e){return e?"Image utilisée pour l'avatar (stockée sur Supabase). L'emoji reste disponible en secours.":t.ready?t.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image. Emoji disponible hors-ligne.":"Supabase non configuré (.env)."}function w(){var y;const e=((y=document.getElementById("avatar"))==null?void 0:y.value)||"🎮",s=document.getElementById("avatar-preview"),a=document.getElementById("avatar-helper"),c=document.getElementById("avatar-clear"),u=x(h.save.playerProfile.avatarUrl,h.save.playerProfile.avatarStoragePath),v=g?null:i||u,m=!!v;s&&(s.classList.toggle("has-image",m),s.innerHTML=m?`<img src="${v}" alt="Avatar" />`:`<span>${e}</span>`),a&&(a.textContent=F(m)),c&&(c.disabled=!m)}function b(){var r;h=B();const e=h,s=V().achievements,a=new Set(e.save.achievementsUnlocked),c=_(),u=Object.entries(e.save.games),v=t!=null&&t.user?"disabled":"",m=se(e),y=t.lastSyncedAt?T(t.lastSyncedAt):"Jamais",E=e.save.playerProfile.avatar||"🎮",$=x(e.save.playerProfile.avatarUrl,e.save.playerProfile.avatarStoragePath),P=g?null:i||$,I=F(!!P),S=e.save.playerProfile.lastPlayedGameId?((r=c.games.find(l=>l.id===e.save.playerProfile.lastPlayedGameId))==null?void 0:r.title)??"Inconnu":null,A=t.user?`<span class="chip success">Cloud : ${D(t.user)}</span>`:t.ready?'<span class="chip ghost">Cloud : non connecté</span>':'<span class="chip warning">Supabase non configuré</span>';te.innerHTML=`
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            ${G("avatar-hero",$,E,e.save.playerProfile.avatarStoragePath)}
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
            <a class="btn primary strong" href="${W("/")}">Retour hub</a>
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
            <strong>${a.size}/${s.length}</strong>
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
                ${G("avatar-preview",P,E,e.save.playerProfile.avatarStoragePath)}
                <p class="muted small" id="avatar-helper">${I}</p>
                <div class="avatar-actions">
                  <label class="file-drop">
                    <input type="file" id="avatar-upload" accept="image/*" />
                    <strong>Image de profil (Supabase)</strong>
                    <span class="muted small">PNG/JPG · 1.5 Mo max</span>
                  </label>
                  <button class="btn ghost danger" id="avatar-clear" type="button" ${P?"":"disabled"}>Revenir à l'emoji</button>
                </div>
              </div>
              <div class="form">
                <label>Pseudo <input id="name" value="${e.save.playerProfile.name}" maxlength="18" ${v} /></label>
                <label>Avatar (emoji) <input id="avatar" value="${E}" maxlength="4" /></label>
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
            ${t!=null&&t.user?`<div class="status ok">Connecté : ${D(t.user)}</div>
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
                     <div class="status ${t!=null&&t.error?"error":"info"}">${(t==null?void 0:t.message)??"Non connecté"}</div>
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
              <strong>${Object.keys(e.save.games).length}/${c.games.length}</strong>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${e.save.globalStats.totalSessions}</strong>
            </div>
          </div>
          <div class="save-list">
            ${u.length?u.map(([l,n])=>`
              <div class="save-row">
                <div>
                  <strong>${l}</strong>
                  <p class="muted small">v${n.saveSchemaVersion} · Dernier : ${T(n.lastPlayedAt)}</p>
                </div>
                <div class="chips-row">
                  <span class="chip ghost">⏱ ${L(n.timePlayedMs)}</span>
                  <span class="chip ghost">🏆 ${n.bestScore??"—"}</span>
                </div>
              </div>
            `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
          </div>
        </section>
      </div>
    </div>
  `,ne()}function ne(){var u,v,m,y,E,$,P,I,S,A;const e=document.getElementById("name"),s=document.getElementById("avatar"),a=document.getElementById("avatar-upload"),c=document.getElementById("avatar-clear");s==null||s.addEventListener("input",w),a==null||a.addEventListener("change",r=>{var o;const l=r.target,n=(o=l.files)==null?void 0:o[0];if(n){if(!t.ready){d("Supabase non configuré pour les avatars.","error"),l.value="";return}if(!t.user){d("Connecte-toi au cloud pour envoyer une image.","error"),l.value="";return}if(!n.type.startsWith("image/")){d("Seules les images sont autorisées.","error"),l.value="";return}if(n.size>ae){d("Image trop lourde (1.5 Mo max).","error"),l.value="";return}i&&URL.revokeObjectURL(i),f=n,i=URL.createObjectURL(n),g=!1,w()}}),c==null||c.addEventListener("click",()=>{g=!0,f=null,i&&(URL.revokeObjectURL(i),i=null),w()}),(u=document.getElementById("save-profile"))==null||u.addEventListener("click",async()=>{k=!0;try{const r=h.save.playerProfile.name,l=t!=null&&t.user?r:((e==null?void 0:e.value)||"Joueur").slice(0,18),n=((s==null?void 0:s.value)||"🎮").slice(0,4),o=h.save.playerProfile.avatarStoragePath;let U=h.save.playerProfile.avatarUrl,j=o;if(f){const p=await Q(f,o||void 0);if(!p.url||!p.path||p.error){d(p.error||"Upload avatar impossible","error");return}U=p.url,j=p.path}else g&&(U=void 0,j=void 0,o&&t.ready&&t.user&&await Z(o));X(p=>{const H=t!=null&&t.user?p.playerProfile.name:l;p.playerProfile.name=H,p.playerProfile.avatar=n,p.playerProfile.avatarUrl=U,p.playerProfile.avatarStoragePath=j,p.playerProfile.avatarType=U?"image":"emoji"}),f=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,q({type:"PROFILE_UPDATED"}),d("Profil mis à jour","success"),b()}finally{k=!1}}),(v=document.getElementById("export"))==null||v.addEventListener("click",()=>{try{const r=z(),l=new Blob([r],{type:"application/json"}),n=URL.createObjectURL(l),o=document.createElement("a");o.href=n,o.download="arcade-galaxy-save.json",document.body.appendChild(o),o.click(),o.remove(),URL.revokeObjectURL(n),d("Export JSON prêt","success")}catch(r){console.error("Export JSON failed",r),d("Export impossible","error")}}),(m=document.getElementById("reset"))==null||m.addEventListener("click",()=>{M(),C(),f=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,d("Progression réinitialisée","info"),b()}),(y=document.getElementById("import-btn"))==null||y.addEventListener("click",async()=>{var n;const r=((n=document.getElementById("import"))==null?void 0:n.value)||"",l=O(r);if(l.success)if(f=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,d("Import réussi","success"),b(),t.user)try{const o=await J(h.save,{allowEmpty:!0});d(o?"Sauvegarde cloud remplacée":t.error||"Erreur cloud",o?"success":"error")}catch(o){console.error("Cloud save failed after import",o),d("Erreur cloud","error")}else t.ready&&d("Connecte-toi pour envoyer l'import sur le cloud","info");else d(l.error||"Import impossible","error")}),(E=document.getElementById("reset-save"))==null||E.addEventListener("click",()=>{M(),C(),d("Sauvegarde locale réinitialisée","info"),b()}),($=document.getElementById("cloud-login"))==null||$.addEventListener("click",async()=>{var n,o;const r=((n=document.getElementById("cloud-identifier"))==null?void 0:n.value)||"",l=((o=document.getElementById("cloud-password"))==null?void 0:o.value)||"";await R("login",{identifier:r,password:l}),b()}),(P=document.getElementById("cloud-register"))==null||P.addEventListener("click",async()=>{var n,o;const r=((n=document.getElementById("cloud-identifier"))==null?void 0:n.value)||"",l=((o=document.getElementById("cloud-password"))==null?void 0:o.value)||"";await R("register",{identifier:r,password:l}),b()}),(I=document.getElementById("cloud-logout"))==null||I.addEventListener("click",async()=>{await R("logout"),f=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,b()}),(S=document.getElementById("cloud-save"))==null||S.addEventListener("click",async()=>{const r=B(),l=await J(r.save);d(l?"Sauvegarde envoyée dans le cloud.":t.error||"Erreur cloud",l?"success":"error")}),(A=document.getElementById("cloud-load"))==null||A.addEventListener("click",async()=>{const r=await ee();r!=null&&r.state?(O(JSON.stringify(r.state)),f=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,d("Sauvegarde cloud importée.","success"),b()):r!=null&&r.error&&d(r.error,"error")}),w()}b();
