import{g as i,w as a}from"./loaders-CNHm-dlv.js";const t=document.getElementById("app"),r=i(),c=a("/"),n=a("/apps/profil/"),l=r.games.slice().sort((s,e)=>(s.order??0)-(e.order??0)).slice(0,3);t.innerHTML=`
  <div class="shell">
    <header class="hero">
      <div class="badge">Arcade Galaxy</div>
      <h1>Mini-jeux, XP et succès <span class="gradient">en un seul hub</span></h1>
      <p>Découvre les mini-jeux, suis ta progression et débloque des succès. Zéro inscription, les données restent sur ton appareil.</p>
      <div class="actions">
        <a class="btn primary" href="${c}">Hub de jeux</a>
        <a class="btn ghost" href="${n}">Profil</a>
      </div>
    </header>
    <section class="games">
      <div class="section-head">
        <p class="eyebrow">Aperçu</p>
        <h2>Jeux en vedette</h2>
      </div>
      <div class="grid">
        ${l.map(s=>`
          <article class="card">
            <div class="pill">${s.previewEmoji||"🎮"} ${s.title}</div>
            <p class="muted">${s.description}</p>
            <div class="tags">${s.tags.map(e=>`<span class="tag">${e}</span>`).join("")}</div>
            <a class="btn ghost" href="${a(`/apps/games/${s.id}/`)}">Jouer</a>
          </article>
        `).join("")}
      </div>
    </section>
  </div>
`;
