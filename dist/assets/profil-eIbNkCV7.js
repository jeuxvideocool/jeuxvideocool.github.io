import{g as G,b as q,a as V,w as x,u as X,l as z,i as Y,j as O,k as K}from"./index-Dht2C2Xm.js";import{subscribe as Q,getAuthState as Z,uploadAvatarImage as ee,removeAvatarImage as te,requestCloudResetSync as T,saveCloud as M,connectCloud as R,syncCloudToLocal as ae,getAvatarPublicUrl as N}from"./cloud-ByLG0KQ1.js";const H=document.getElementById("app");let t=Z(),h,b=null,i=null,g=!1,B=!1;const se=1.5*1024*1024;Q(e=>{t=e,B||f()});function J(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function L(e){if(!e)return"0m";const s=Math.floor(e/1e3),a=Math.floor(s/3600),o=Math.floor(s%3600/60),c=s%60;return a?`${a}h ${o}m`:o?`${o}m ${c}s`:`${c}s`}function D(e){var o;if(!e)return"connecté";const s=(o=e.user_metadata)==null?void 0:o.identifier,a=e.email;return s||(a!=null&&a.endsWith("@user.local")?a.replace("@user.local",""):a||"connecté")}function re(e){const s=Object.entries(e.save.games||{});if(!s.length)return{title:"Aucun jeu",duration:"0m"};const[a,o]=s.sort((v,m)=>(m[1].timePlayedMs||0)-(v[1].timePlayedMs||0))[0],c=V().games.find(v=>v.id===a);return{title:(c==null?void 0:c.title)||a,duration:L(o.timePlayedMs)}}function u(e,s="info"){const a=document.createElement("div");a.className=`toast ${s}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("visible")),setTimeout(()=>{a.classList.remove("visible"),setTimeout(()=>a.remove(),240)},2400)}function ne(e){return/^https?:\/\//i.test(e)||e.startsWith("blob:")||e.startsWith("data:")}function C(e,s){if(e){const a=e.trim();return ne(a)?a:N(s||a)||null}return N(s)||null}function _(e,s,a,o){const c=C(s,o),v=!!c;return`<div class="avatar ${v?"has-image":""}" id="${e}">
    ${v?`<img src="${c}" alt="Avatar" />`:`<span>${a}</span>`}
  </div>`}function F(e){return e?"Image utilisée pour l'avatar (stockée sur Supabase).":t.ready?t.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image.":"Supabase non configuré (.env)."}function w(){var y;const e=((y=document.getElementById("avatar"))==null?void 0:y.value)||"🎮",s=document.getElementById("avatar-preview"),a=document.getElementById("avatar-helper"),o=document.getElementById("avatar-clear"),c=C(h.save.playerProfile.avatarUrl,h.save.playerProfile.avatarStoragePath),v=g?null:i||c,m=!!v;s&&(s.classList.toggle("has-image",m),s.innerHTML=m?`<img src="${v}" alt="Avatar" />`:`<span>${e}</span>`),a&&(a.textContent=F(m)),o&&(o.disabled=!m)}function j(e,s,a=!0){const o=x("/apps/auth/"),c=x("/");H.innerHTML=`
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            <div class="avatar">☁️</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>${e}</h1>
              <p class="muted">${s}</p>
            </div>
          </div>
          <div class="identity-actions">
            ${a?`<a class="btn primary strong" href="${o}">Connexion cloud</a>`:""}
            <a class="btn ghost" href="${c}">Retour hub</a>
          </div>
        </div>
      </header>
    </div>
  `}function f(){var d;if(!t.ready){j("Cloud indisponible","Supabase n'est pas configuré. Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.",!1);return}if(!t.user){j("Connexion requise","Connecte-toi au cloud pour consulter et gérer ta progression.");return}if(!t.hydrated){j("Synchronisation cloud en cours","Chargement de ta sauvegarde avant d'afficher le profil.",!1);return}h=G();const e=h,s=q().achievements,a=new Set(e.save.achievementsUnlocked),o=V(),c=Object.entries(e.save.games),v=t!=null&&t.user?"disabled":"",m=re(e),y=t.lastSyncedAt?J(t.lastSyncedAt):"Jamais",E=e.save.playerProfile.avatar||"🎮",$=C(e.save.playerProfile.avatarUrl,e.save.playerProfile.avatarStoragePath),P=g?null:i||$,I=F(!!P),S=e.save.playerProfile.lastPlayedGameId?((d=o.games.find(l=>l.id===e.save.playerProfile.lastPlayedGameId))==null?void 0:d.title)??"Inconnu":null,A=t.user?`<span class="chip success">Cloud : ${D(t.user)}</span>`:t.ready?'<span class="chip ghost">Cloud : non connecté</span>':'<span class="chip warning">Supabase non configuré</span>';H.innerHTML=`
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            ${_("avatar-hero",$,E,e.save.playerProfile.avatarStoragePath)}
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
            <a class="btn primary strong" href="${x("/")}">Retour hub</a>
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
                ${_("avatar-preview",P,E,e.save.playerProfile.avatarStoragePath)}
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
              <p class="muted small">Export/Import JSON et stats. Les actions cloud ci-dessus restent disponibles.</p>
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
              <strong>${Object.keys(e.save.games).length}/${o.games.length}</strong>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${e.save.globalStats.totalSessions}</strong>
            </div>
          </div>
          <div class="save-list">
            ${c.length?c.map(([l,r])=>`
              <div class="save-row">
                <div>
                  <strong>${l}</strong>
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
  `,oe()}function oe(){var c,v,m,y,E,$,P,I,S,A;const e=document.getElementById("name"),s=document.getElementById("avatar"),a=document.getElementById("avatar-upload"),o=document.getElementById("avatar-clear");s==null||s.addEventListener("input",w),a==null||a.addEventListener("change",d=>{var n;const l=d.target,r=(n=l.files)==null?void 0:n[0];if(r){if(!t.ready){u("Supabase non configuré pour les avatars.","error"),l.value="";return}if(!t.user){u("Connecte-toi au cloud pour envoyer une image.","error"),l.value="";return}if(!r.type.startsWith("image/")){u("Seules les images sont autorisées.","error"),l.value="";return}if(r.size>se){u("Image trop lourde (1.5 Mo max).","error"),l.value="";return}i&&URL.revokeObjectURL(i),b=r,i=URL.createObjectURL(r),g=!1,w()}}),o==null||o.addEventListener("click",()=>{g=!0,b=null,i&&(URL.revokeObjectURL(i),i=null),w()}),(c=document.getElementById("save-profile"))==null||c.addEventListener("click",async()=>{B=!0;try{const d=h.save.playerProfile.name,l=t!=null&&t.user?d:((e==null?void 0:e.value)||"Joueur").slice(0,18),r=((s==null?void 0:s.value)||"🎮").slice(0,4),n=h.save.playerProfile.avatarStoragePath;let U=h.save.playerProfile.avatarUrl,k=n;if(b){const p=await ee(b,n||void 0);if(!p.url||!p.path||p.error){u(p.error||"Upload avatar impossible","error");return}U=p.url,k=p.path}else g&&(U=void 0,k=void 0,n&&t.ready&&t.user&&await te(n));X(p=>{const W=t!=null&&t.user?p.playerProfile.name:l;p.playerProfile.name=W,p.playerProfile.avatar=r,p.playerProfile.avatarUrl=U,p.playerProfile.avatarStoragePath=k,p.playerProfile.avatarType=U?"image":"emoji"}),b=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,z({type:"PROFILE_UPDATED"}),u("Profil mis à jour","success"),f()}finally{B=!1}}),(v=document.getElementById("export"))==null||v.addEventListener("click",()=>{try{const d=Y(),l=new Blob([d],{type:"application/json"}),r=URL.createObjectURL(l),n=document.createElement("a");n.href=r,n.download="arcade-galaxy-save.json",document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(r),u("Export JSON prêt","success")}catch(d){console.error("Export JSON failed",d),u("Export impossible","error")}}),(m=document.getElementById("reset"))==null||m.addEventListener("click",()=>{T(),O(),b=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,u("Progression réinitialisée","info"),f()}),(y=document.getElementById("import-btn"))==null||y.addEventListener("click",async()=>{var r;const d=((r=document.getElementById("import"))==null?void 0:r.value)||"",l=K(d);if(l.success)if(b=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,u("Import réussi","success"),f(),t.user)try{const n=await M(h.save,{allowEmpty:!0});u(n?"Sauvegarde cloud remplacée":t.error||"Erreur cloud",n?"success":"error")}catch(n){console.error("Cloud save failed after import",n),u("Erreur cloud","error")}else t.ready&&u("Connecte-toi pour envoyer l'import sur le cloud","info");else u(l.error||"Import impossible","error")}),(E=document.getElementById("reset-save"))==null||E.addEventListener("click",()=>{T(),O(),u("Sauvegarde réinitialisée","info"),f()}),($=document.getElementById("cloud-login"))==null||$.addEventListener("click",async()=>{var r,n;const d=((r=document.getElementById("cloud-identifier"))==null?void 0:r.value)||"",l=((n=document.getElementById("cloud-password"))==null?void 0:n.value)||"";await R("login",{identifier:d,password:l}),f()}),(P=document.getElementById("cloud-register"))==null||P.addEventListener("click",async()=>{var r,n;const d=((r=document.getElementById("cloud-identifier"))==null?void 0:r.value)||"",l=((n=document.getElementById("cloud-password"))==null?void 0:n.value)||"";await R("register",{identifier:d,password:l}),f()}),(I=document.getElementById("cloud-logout"))==null||I.addEventListener("click",async()=>{await R("logout"),b=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,f()}),(S=document.getElementById("cloud-save"))==null||S.addEventListener("click",async()=>{const d=G(),l=await M(d.save);u(l?"Sauvegarde envoyée dans le cloud.":t.error||"Erreur cloud",l?"success":"error")}),(A=document.getElementById("cloud-load"))==null||A.addEventListener("click",async()=>{await ae()?(b=null,i&&(URL.revokeObjectURL(i),i=null),g=!1,u("Sauvegarde cloud importée.","success"),f()):t.error?u(t.error,"error"):u("Import cloud impossible","error")}),w()}f();
