import{w as l,g as v}from"./index-Dht2C2Xm.js";import{subscribe as g,getAuthState as b,connectCloud as r,saveCloud as h}from"./cloud-ByLG0KQ1.js";const f=document.getElementById("app");let e=b();g(t=>{e=t,m()});function u(t,a="info"){const s=document.createElement("div");s.className=`toast ${a}`,s.textContent=t,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("visible")),setTimeout(()=>{s.classList.remove("visible"),setTimeout(()=>s.remove(),240)},2400)}function p(t){var o;if(!t)return"connecté";const a=(o=t.user_metadata)==null?void 0:o.identifier,s=t.email;return a||(s!=null&&s.endsWith("@user.local")?s.replace("@user.local",""):s||"connecté")}function m(){const t=l("/apps/profil/"),a=l("/"),s=e.user?`Connecté : ${p(e.user)}`:e.ready?"Connexion requise":"Supabase non configuré (.env)";f.innerHTML=`
    <div class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Arcade Galaxy</p>
          <h1>Compte cloud obligatoire</h1>
          <p class="muted">Connecte-toi ou crée un compte (identifiant + mot de passe) pour accéder au hub et aux jeux. Les saves sont synchronisées via Supabase.</p>
          <div class="chips">
            <span class="chip ${e.user?"success":"warning"}">${s}</span>
          </div>
        </div>
        <div class="hero-card">
          <div class="avatar">🎮</div>
          <p class="muted small">Connexion requise pour poursuivre.</p>
          <div class="hero-actions">
            <a class="btn ghost" href="${t}">Profil</a>
            <a class="btn ghost" href="${a}">Hub</a>
          </div>
        </div>
      </header>

      <main class="grid single">
        <section class="card cloud">
          <div class="section-head">
            <div>
              <p class="eyebrow">Connexion</p>
              <h2>Compte Supabase</h2>
              <p class="muted small">Identifiant + mot de passe requis pour continuer.</p>
            </div>
            <span class="pill accent">Cloud</span>
          </div>

          ${e.ready?e.user?`<div class="status ok">Connecté : ${p(e.user)}</div>
                   <p class="muted small">La synchro s'enclenche automatiquement dès qu'une sauvegarde change.</p>
                   <div class="actions wrap">
                     <button class="btn primary" id="cloud-sync" ${e.loading?"disabled":""}>Forcer une sync</button>
                     <a class="btn ghost" href="${a}">Aller au hub</a>
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
            <h3>Compte requis</h3>
            <p class="muted">Connexion obligatoire : toutes les saves passent par le cloud Supabase pour rester synchronisées.</p>
          </div>
          <div class="bullets">
            <div class="bullet">🚀 Synchro auto dès qu'une save change.</div>
            <div class="bullet">🔒 Identifiant + mot de passe (pas d'email requis).</div>
            <div class="bullet">📤 Export/Import possibles depuis la page Profil.</div>
          </div>
        </div>
      </section>
    </div>
  `,y()}function y(){const t=document.getElementById("cloud-login"),a=document.getElementById("cloud-register"),s=document.getElementById("cloud-logout"),o=document.getElementById("cloud-sync");t==null||t.addEventListener("click",async()=>{var c,d;const i=((c=document.getElementById("cloud-identifier"))==null?void 0:c.value)||"",n=((d=document.getElementById("cloud-password"))==null?void 0:d.value)||"";await r("login",{identifier:i,password:n})}),a==null||a.addEventListener("click",async()=>{var c,d;const i=((c=document.getElementById("cloud-identifier"))==null?void 0:c.value)||"",n=((d=document.getElementById("cloud-password"))==null?void 0:d.value)||"";await r("register",{identifier:i,password:n})}),s==null||s.addEventListener("click",async()=>{await r("logout"),u("Déconnecté du cloud","info")}),o==null||o.addEventListener("click",async()=>{const i=v(),n=await h(i.save);u(n?"Sauvegarde envoyée":e.error||"Erreur cloud",n?"success":"error")})}m();
