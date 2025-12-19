import{a as E,g as S,w as h}from"./loaders-Bj0CnEmo.js";import{g as $,u as k,d as I,e as P,b as B,i as y}from"./index-D5lPzJ7_.js";import{g as L,c as p,a as w,l as x}from"./cloud-BzCb0WPS.js";const j=document.getElementById("app");function A(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function f(e){if(!e)return"0m";const a=Math.floor(e/1e3),o=Math.floor(a/3600),l=Math.floor(a%3600/60),t=a%60;return o?`${o}h ${l}m`:l?`${l}m ${t}s`:`${t}s`}function d(){const e=$(),a=E().achievements,o=new Set(e.save.achievementsUnlocked),l=S(),t=L(),v=Object.entries(e.save.games);j.innerHTML=`
    <div class="shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Profil joueur</p>
          <h1>${e.save.playerProfile.avatar} ${e.save.playerProfile.name}</h1>
          <p class="muted">Niveau ${e.save.globalLevel} · ${e.save.globalXP} XP · ${o.size}/${a.length} succès</p>
        </div>
        <div class="actions">
          <a class="btn ghost" href="${h("/apps/home/")}">Accueil</a>
          <a class="btn primary" href="${h("/")}">Hub de jeux</a>
        </div>
      </header>

      <section class="panel">
        <h2>Identité</h2>
        <div class="form">
          <label>Pseudo <input id="name" value="${e.save.playerProfile.name}" maxlength="18" /></label>
          <label>Avatar (emoji) <input id="avatar" value="${e.save.playerProfile.avatar}" maxlength="4" /></label>
          <button class="btn primary" id="save-profile">Enregistrer</button>
        </div>
      </section>

      <section class="panel">
        <h2>Progression</h2>
        <div class="stats">
          <div><span class="label">XP manquants</span><strong>${e.nextLevelXP-e.save.globalXP}</strong></div>
          <div><span class="label">Jeux joués</span><strong>${Object.keys(e.save.games).length}/${l.games.length}</strong></div>
          <div><span class="label">Succès</span><strong>${o.size}/${a.length}</strong></div>
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
            <strong>${Object.keys(e.save.games).length}/${l.games.length}</strong>
          </div>
          <div>
            <span class="label">Sessions</span>
            <strong>${e.save.globalStats.totalSessions}</strong>
          </div>
        </div>
        <div class="save-list">
          ${v.length?v.map(([i,u])=>`
              <div class="save-row">
                <div>
                  <strong>${i}</strong>
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
          ${t!=null&&t.user?`<div class="status ok">Connecté : ${t.user.email||"compte sans email"}</div>
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
                 <div class="status ${t!=null&&t.error?"error":"info"}">${(t==null?void 0:t.message)??"Non connecté"}</div>`}
        </div>
      </section>

      <section class="panel">
        <h2>Succès</h2>
        <div class="ach-list">
          ${a.map(i=>`
                <article class="ach ${o.has(i.id)?"ok":""}">
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
  `,O()}function O(){var o,l,t,v,i,u,m,g,b;const e=document.getElementById("name"),a=document.getElementById("avatar");(o=document.getElementById("save-profile"))==null||o.addEventListener("click",()=>{k(s=>{s.playerProfile.name=((e==null?void 0:e.value)||"Joueur").slice(0,18),s.playerProfile.avatar=((a==null?void 0:a.value)||"🎮").slice(0,4)}),I({type:"PROFILE_UPDATED"}),d()}),(l=document.getElementById("export"))==null||l.addEventListener("click",()=>{const s=P(),c=new Blob([s],{type:"application/json"}),n=URL.createObjectURL(c),r=document.createElement("a");r.href=n,r.download="arcade-galaxy-save.json",r.click(),URL.revokeObjectURL(n)}),(t=document.getElementById("reset"))==null||t.addEventListener("click",()=>{B(),d()}),(v=document.getElementById("import-btn"))==null||v.addEventListener("click",()=>{var n;const s=((n=document.getElementById("import"))==null?void 0:n.value)||"",c=y(s);c.success?d():alert(c.error||"Import impossible")}),(i=document.getElementById("cloud-login"))==null||i.addEventListener("click",async()=>{var n,r;const s=((n=document.getElementById("cloud-email"))==null?void 0:n.value)||"",c=((r=document.getElementById("cloud-password"))==null?void 0:r.value)||"";await p("login",{email:s,password:c}),d()}),(u=document.getElementById("cloud-register"))==null||u.addEventListener("click",async()=>{var n,r;const s=((n=document.getElementById("cloud-email"))==null?void 0:n.value)||"",c=((r=document.getElementById("cloud-password"))==null?void 0:r.value)||"";await p("register",{email:s,password:c}),d()}),(m=document.getElementById("cloud-logout"))==null||m.addEventListener("click",async()=>{await p("logout"),d()}),(g=document.getElementById("cloud-save"))==null||g.addEventListener("click",async()=>{const s=$();await w(s.save)&&alert("Sauvegarde envoyée dans le cloud.")}),(b=document.getElementById("cloud-load"))==null||b.addEventListener("click",async()=>{const s=await x();s!=null&&s.state?(y(JSON.stringify(s.state)),alert("Sauvegarde cloud importée."),d()):s!=null&&s.error&&alert(s.error)})}d();
