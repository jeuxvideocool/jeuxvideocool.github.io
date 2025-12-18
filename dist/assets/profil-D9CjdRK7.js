import{a as f,g as $,w as h}from"./loaders-C6hX0A3C.js";import{g as E,u as I,e as B,a as k,r as S,i as y}from"./index-DEUwev7d.js";import{g as L,c as u,s as P,l as x}from"./cloud-B4CuE7-U.js";const w=document.getElementById("app");function l(){const t=E(),c=f().achievements,d=new Set(t.save.achievementsUnlocked),r=$(),s=L();w.innerHTML=`
    <div class="shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Profil joueur</p>
          <h1>${t.save.playerProfile.avatar} ${t.save.playerProfile.name}</h1>
          <p class="muted">Niveau ${t.save.globalLevel} · ${t.save.globalXP} XP · ${d.size}/${c.length} succès</p>
        </div>
        <div class="actions">
          <a class="btn ghost" href="${h("/apps/home/")}">Accueil</a>
          <a class="btn primary" href="${h("/apps/hub_de_jeux/")}">Hub de jeux</a>
        </div>
      </header>

      <section class="panel">
        <h2>Identité</h2>
        <div class="form">
          <label>Pseudo <input id="name" value="${t.save.playerProfile.name}" maxlength="18" /></label>
          <label>Avatar (emoji) <input id="avatar" value="${t.save.playerProfile.avatar}" maxlength="4" /></label>
          <button class="btn primary" id="save-profile">Enregistrer</button>
        </div>
      </section>

      <section class="panel">
        <h2>Progression</h2>
        <div class="stats">
          <div><span class="label">XP manquants</span><strong>${t.nextLevelXP-t.save.globalXP}</strong></div>
          <div><span class="label">Jeux joués</span><strong>${Object.keys(t.save.games).length}/${r.games.length}</strong></div>
          <div><span class="label">Succès</span><strong>${d.size}/${c.length}</strong></div>
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
        <h2>Cloud (Supabase)</h2>
        <div class="form">
          <p class="muted small">Synchronisation cross-device via Supabase (Spark gratuit). Renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.</p>
          ${s!=null&&s.user?`<div class="status ok">Connecté : ${s.user.email||"compte sans email"}</div>
                 <div class="actions">
                    <button class="btn primary" id="cloud-save">Sauvegarder vers cloud</button>
                    <button class="btn ghost" id="cloud-load">Charger depuis cloud</button>
                    <button class="btn ghost danger" id="cloud-logout">Déconnexion</button>
                 </div>
                 <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save).</p>`:`<label>Email <input id="cloud-email" type="email" placeholder="mail@example.com" /></label>
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
          ${c.map(i=>`
                <article class="ach ${d.has(i.id)?"ok":""}">
                  <div class="pill">${i.icon||"⭐️"}</div>
                  <div>
                    <h3>${i.title}</h3>
                    <p class="muted">${i.description}</p>
                  </div>
                </article>
              `).join("")}
        </div>
      </section>
    </div>
  `,j()}function j(){var d,r,s,i,m,p,v,g,b;const t=document.getElementById("name"),c=document.getElementById("avatar");(d=document.getElementById("save-profile"))==null||d.addEventListener("click",()=>{I(e=>{e.playerProfile.name=((t==null?void 0:t.value)||"Joueur").slice(0,18),e.playerProfile.avatar=((c==null?void 0:c.value)||"🎮").slice(0,4)}),B({type:"PROFILE_UPDATED"}),l()}),(r=document.getElementById("export"))==null||r.addEventListener("click",()=>{const e=k(),n=new Blob([e],{type:"application/json"}),a=URL.createObjectURL(n),o=document.createElement("a");o.href=a,o.download="arcade-galaxy-save.json",o.click(),URL.revokeObjectURL(a)}),(s=document.getElementById("reset"))==null||s.addEventListener("click",()=>{S(),l()}),(i=document.getElementById("import-btn"))==null||i.addEventListener("click",()=>{var a;const e=((a=document.getElementById("import"))==null?void 0:a.value)||"",n=y(e);n.success?l():alert(n.error||"Import impossible")}),(m=document.getElementById("cloud-login"))==null||m.addEventListener("click",async()=>{var a,o;const e=((a=document.getElementById("cloud-email"))==null?void 0:a.value)||"",n=((o=document.getElementById("cloud-password"))==null?void 0:o.value)||"";await u("login",{email:e,password:n}),l()}),(p=document.getElementById("cloud-register"))==null||p.addEventListener("click",async()=>{var a,o;const e=((a=document.getElementById("cloud-email"))==null?void 0:a.value)||"",n=((o=document.getElementById("cloud-password"))==null?void 0:o.value)||"";await u("register",{email:e,password:n}),l()}),(v=document.getElementById("cloud-logout"))==null||v.addEventListener("click",async()=>{await u("logout"),l()}),(g=document.getElementById("cloud-save"))==null||g.addEventListener("click",async()=>{const e=E();await P(e.save)&&alert("Sauvegarde envoyée dans le cloud.")}),(b=document.getElementById("cloud-load"))==null||b.addEventListener("click",async()=>{const e=await x();e!=null&&e.state?(y(JSON.stringify(e.state)),alert("Sauvegarde cloud importée."),l()):e!=null&&e.error&&alert(e.error)})}l();
