import{w as m}from"./loaders-Bj0CnEmo.js";import{g as h,u as y}from"./index-D5lPzJ7_.js";import{s as f,g as E,c as p,a as $}from"./cloud-Vs8Bl6sx.js";const w=document.getElementById("app");let e=E();f(a=>{e=a,b()});function v(a,t="info"){const s=document.createElement("div");s.className=`toast ${t}`,s.textContent=a,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("visible")),setTimeout(()=>{s.classList.remove("visible"),setTimeout(()=>s.remove(),240)},2400)}function g(a){var n;if(!a)return"connecté";const t=(n=a.user_metadata)==null?void 0:n.identifier,s=a.email;return t||(s!=null&&s.endsWith("@user.local")?s.replace("@user.local",""):s||"connecté")}function b(){const a=h(),t=a.save.playerProfile.name||"Joueur",s=a.save.playerProfile.avatar||"🎮",n=m("/apps/profil/"),l=m("/"),d=e.user?`Connecté : ${g(e.user)}`:e.ready?"Mode invité (local)":"Supabase non configuré (.env)";w.innerHTML=`
    <div class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Arcade Galaxy</p>
          <h1>Invité ou compte cloud</h1>
          <p class="muted">Choisis : jouer en invité (aucune donnée externe) ou créer un compte pour synchroniser tes saves via Supabase.</p>
          <div class="chips">
            <span class="chip">Pseudo actuel : ${t}</span>
            <span class="chip ghost">Avatar : ${s}</span>
            <span class="chip ${e.user?"success":e.ready?"ghost":"warning"}">${d}</span>
          </div>
        </div>
        <div class="hero-card">
          <div class="avatar">${s}</div>
          <p class="muted small">Ton profil reste partagé entre hub et jeux.</p>
          <div class="hero-actions">
            <a class="btn ghost" href="${l}">Hub</a>
            <a class="btn ghost" href="${n}">Profil</a>
          </div>
        </div>
      </header>

      <main class="grid">
        <section class="card guest">
          <div class="section-head">
            <div>
              <p class="eyebrow">Mode invité</p>
              <h2>Sans compte</h2>
              <p class="muted small">Sauvegarde locale uniquement. Aucune connexion Supabase.</p>
            </div>
            <span class="pill">Local</span>
          </div>
          <div class="form">
            <label>Pseudo <input id="guest-name" type="text" value="${t}" maxlength="18" /></label>
            <label>Avatar (emoji) <input id="guest-avatar" type="text" value="${s}" maxlength="4" /></label>
            <button class="btn primary" id="guest-continue">Continuer en invité</button>
          </div>
          <p class="muted small">Ton pseudo/avatar sont stockés dans le navigateur. La synchro cloud reste désactivée.</p>
        </section>

        <section class="card cloud">
          <div class="section-head">
            <div>
              <p class="eyebrow">Compte cloud</p>
              <h2>Supabase</h2>
              <p class="muted small">Identifiant + mot de passe pour synchroniser ta sauvegarde entre appareils.</p>
            </div>
            <span class="pill accent">Cloud</span>
          </div>

          ${e.ready?e.user?`<div class="status ok">Connecté en cloud : ${g(e.user)}</div>
                   <p class="muted small">La synchro s'enclenche automatiquement dès qu'une save locale change.</p>
                   <div class="actions wrap">
                     <button class="btn primary" id="cloud-sync" ${e.loading?"disabled":""}>Forcer une sync</button>
                     <a class="btn ghost" href="${l}">Aller au hub</a>
                     <button class="btn ghost danger" id="cloud-logout" ${e.loading?"disabled":""}>Déconnexion</button>
                   </div>
                   ${e.message?`<p class="status info">${e.message}</p>`:`<p class="status info">Dernière sync : ${e.lastSyncedAt?new Date(e.lastSyncedAt).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}</p>`}
                   ${e.error?`<p class="status error">${e.error}</p>`:""}`:`<div class="form">
                     <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
                     <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                     <div class="actions wrap">
                       <button class="btn primary" id="cloud-login" ${e.loading?"disabled":""}>Connexion</button>
                       <button class="btn ghost" id="cloud-register" ${e.loading?"disabled":""}>Créer un compte</button>
                     </div>
                   </div>
                   ${e.error?`<p class="status error">${e.error}</p>`:`<p class="status info">Compte utilisé uniquement pour la sauvegarde cloud (pas d'email requis).</p>`}`:'<div class="status error">Configure VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer la connexion.</div>'}
        </section>
      </main>

      <section class="card info">
        <div class="info-grid">
          <div>
            <p class="eyebrow">Clair et simple</p>
            <h3>Deux options</h3>
            <p class="muted">1) Invité : données 100% locales. 2) Cloud : identifiant/mot de passe Supabase pour retrouver ta progression partout.</p>
          </div>
          <div class="bullets">
            <div class="bullet">🚀 Synchro auto quand la save change (si connecté).</div>
            <div class="bullet">🔒 Pas d'email obligatoire, identifiant seul suffit.</div>
            <div class="bullet">📤 Export/Import possibles depuis la page Profil.</div>
          </div>
        </div>
      </section>
    </div>
  `,S()}function S(){const a=document.getElementById("guest-continue"),t=document.getElementById("guest-name"),s=document.getElementById("guest-avatar");a==null||a.addEventListener("click",()=>{const c=((t==null?void 0:t.value)||"Joueur").trim().slice(0,18),o=((s==null?void 0:s.value)||"🎮").trim().slice(0,4);y(i=>{i.playerProfile.name=c||"Joueur",i.playerProfile.avatar=o||"🎮"}),v("Mode invité prêt"),window.location.href=m("/")});const n=document.getElementById("cloud-login"),l=document.getElementById("cloud-register"),d=document.getElementById("cloud-logout"),u=document.getElementById("cloud-sync");n==null||n.addEventListener("click",async()=>{var i,r;const c=((i=document.getElementById("cloud-identifier"))==null?void 0:i.value)||"",o=((r=document.getElementById("cloud-password"))==null?void 0:r.value)||"";await p("login",{identifier:c,password:o})}),l==null||l.addEventListener("click",async()=>{var i,r;const c=((i=document.getElementById("cloud-identifier"))==null?void 0:i.value)||"",o=((r=document.getElementById("cloud-password"))==null?void 0:r.value)||"";await p("register",{identifier:c,password:o})}),d==null||d.addEventListener("click",async()=>{await p("logout"),v("Déconnecté du cloud","info")}),u==null||u.addEventListener("click",async()=>{const c=h(),o=await $(c.save);v(o?"Sauvegarde envoyée":e.error||"Erreur cloud",o?"success":"error")})}b();
