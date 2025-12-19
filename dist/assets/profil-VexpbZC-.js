import{g as $,b as S,a as I,w as h,u as P,k,h as B,i as L,j as y}from"./index-Bc-Kp7-P.js";import{g as E,c as m,a as w,l as x}from"./cloud-10MdCNZ0.js";const j=document.getElementById("app");function A(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function f(e){if(!e)return"0m";const n=Math.floor(e/1e3),a=Math.floor(n/3600),i=Math.floor(n%3600/60),s=n%60;return a?`${a}h ${i}m`:i?`${i}m ${s}s`:`${s}s`}function C(e){var i;if(!e)return"connecté";const n=(i=e.user_metadata)==null?void 0:i.identifier,a=e.email;return n||(a!=null&&a.endsWith("@user.local")?a.replace("@user.local",""):a||"connecté")}function d(){const e=$(),n=S().achievements,a=new Set(e.save.achievementsUnlocked),i=I(),s=E(),p=Object.entries(e.save.games),v=s!=null&&s.user?"disabled":"";j.innerHTML=`
    <div class="shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Profil joueur</p>
          <h1>${e.save.playerProfile.avatar} ${e.save.playerProfile.name}</h1>
          <p class="muted">Niveau ${e.save.globalLevel} · ${e.save.globalXP} XP · ${a.size}/${n.length} succès</p>
        </div>
        <div class="actions">
          <a class="btn ghost" href="${h("/apps/hub/")}">Accueil</a>
          <a class="btn primary" href="${h("/")}">Hub de jeux</a>
        </div>
      </header>

      <section class="panel">
        <h2>Identité</h2>
        <div class="form">
          <label>Pseudo <input id="name" value="${e.save.playerProfile.name}" maxlength="18" ${v} /></label>
          <label>Avatar (emoji) <input id="avatar" value="${e.save.playerProfile.avatar}" maxlength="4" /></label>
          <button class="btn primary" id="save-profile">Enregistrer</button>
          ${s!=null&&s.user?'<p class="muted small">Pseudo verrouillé (compte cloud connecté).</p>':""}
        </div>
      </section>

      <section class="panel">
        <h2>Progression</h2>
        <div class="stats">
          <div><span class="label">XP manquants</span><strong>${e.nextLevelXP-e.save.globalXP}</strong></div>
          <div><span class="label">Jeux joués</span><strong>${Object.keys(e.save.games).length}/${i.games.length}</strong></div>
          <div><span class="label">Succès</span><strong>${a.size}/${n.length}</strong></div>
        </div>
      </section>

      <section class="panel">
        <h2>Backup</h2>
        <div class="form">
          <button class="btn ghost" id="export">Exporter JSON</button>
          <button class="btn ghost danger" id="reset">Reset global</button>
          <textarea id="import" placeholder="Colle ici ton export JSON"></textarea>
          <button class="btn primary" id="import-btn">Importer</button>
          <p class="muted small">Les données restent sur ton appareil (localStorage). Aucun service externe n'est utilisé.</p>
        </div>
      </section>

      <section class="panel">
        <h2>Sauvegardes locales</h2>
        <p class="muted small">Vue rapide de ce qui est stocké sur cet appareil (cloud ci-dessous).</p>
        <div class="save-meta">
          <div>
            <span class="label">Temps global</span>
            <strong>${f(e.save.globalStats.timePlayedMs)}</strong>
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
          ${p.length?p.map(([r,u])=>`
              <div class="save-row">
                <div>
                  <strong>${r}</strong>
                  <p class="muted small">v${u.saveSchemaVersion} · Dernier : ${A(u.lastPlayedAt)}</p>
                </div>
                <div class="chips">
                  <span class="chip ghost">⏱ ${f(u.timePlayedMs)}</span>
                  <span class="chip ghost">🏆 ${u.bestScore??"—"}</span>
                </div>
              </div>
            `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
        </div>
      </section>

      <section class="panel">
        <h2>Cloud (Supabase)</h2>
        <div class="form">
          <p class="muted small">Synchronisation cross-device via Supabase (Spark gratuit). Renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.</p>
          ${s!=null&&s.user?`<div class="status ok">Connecté : ${C(s.user)}</div>
                 <div class="actions">
                    <button class="btn primary" id="cloud-save">Sauvegarder vers cloud</button>
                    <button class="btn ghost" id="cloud-load">Charger depuis cloud</button>
                    <button class="btn ghost danger" id="cloud-logout">Déconnexion</button>
                 </div>
                 <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save).</p>`:`<label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
                 <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                 <div class="actions">
                   <button class="btn primary" id="cloud-login">Connexion</button>
                   <button class="btn ghost" id="cloud-register">Créer un compte</button>
                 </div>
                 <div class="status ${s!=null&&s.error?"error":"info"}">${(s==null?void 0:s.message)??"Non connecté"}</div>`}
        </div>
      </section>

      <section class="panel">
        <h2>Succès</h2>
        <div class="ach-list">
          ${n.map(r=>`
                <article class="ach ${a.has(r.id)?"ok":""}">
                  <div class="pill">${r.icon||"⭐️"}</div>
                  <div>
                    <h3>${r.title}</h3>
                    <p class="muted">${r.description}</p>
                  </div>
                </article>
              `).join("")}
        </div>
      </section>
    </div>
  `,O()}function O(){var a,i,s,p,v,r,u,g,b;const e=document.getElementById("name"),n=document.getElementById("avatar");(a=document.getElementById("save-profile"))==null||a.addEventListener("click",()=>{const t=E();P(o=>{const l=o.playerProfile.name,c=t!=null&&t.user?l:((e==null?void 0:e.value)||"Joueur").slice(0,18);o.playerProfile.name=c,o.playerProfile.avatar=((n==null?void 0:n.value)||"🎮").slice(0,4)}),k({type:"PROFILE_UPDATED"}),d()}),(i=document.getElementById("export"))==null||i.addEventListener("click",()=>{const t=B(),o=new Blob([t],{type:"application/json"}),l=URL.createObjectURL(o),c=document.createElement("a");c.href=l,c.download="arcade-galaxy-save.json",c.click(),URL.revokeObjectURL(l)}),(s=document.getElementById("reset"))==null||s.addEventListener("click",()=>{L(),d()}),(p=document.getElementById("import-btn"))==null||p.addEventListener("click",()=>{var l;const t=((l=document.getElementById("import"))==null?void 0:l.value)||"",o=y(t);o.success?d():alert(o.error||"Import impossible")}),(v=document.getElementById("cloud-login"))==null||v.addEventListener("click",async()=>{var l,c;const t=((l=document.getElementById("cloud-identifier"))==null?void 0:l.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await m("login",{identifier:t,password:o}),d()}),(r=document.getElementById("cloud-register"))==null||r.addEventListener("click",async()=>{var l,c;const t=((l=document.getElementById("cloud-identifier"))==null?void 0:l.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await m("register",{identifier:t,password:o}),d()}),(u=document.getElementById("cloud-logout"))==null||u.addEventListener("click",async()=>{await m("logout"),d()}),(g=document.getElementById("cloud-save"))==null||g.addEventListener("click",async()=>{const t=$();await w(t.save)&&alert("Sauvegarde envoyée dans le cloud.")}),(b=document.getElementById("cloud-load"))==null||b.addEventListener("click",async()=>{const t=await x();t!=null&&t.state?(y(JSON.stringify(t.state)),alert("Sauvegarde cloud importée."),d()):t!=null&&t.error&&alert(t.error)})}d();
