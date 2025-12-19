import{w as s}from"./loaders-Bj0CnEmo.js";import{g as n,c as o,A as c}from"./index-D5lPzJ7_.js";const d=document.getElementById("app"),p=n(),e=p.save;if(!o(e))window.location.replace(s("/"));else{const i=["31 000 XP = 31 bougies, donc on souffle tout en une seule respiration.","Un buff +31 en bonne humeur appliqué automatiquement pendant 24h.","Droit officiel de chambrer le reste de l'équipe sur leurs petits niveaux."],a=["On ne vieillit pas, on up un skill tree secret.","Les 31 ans, c'est juste la saison 31 de la série « Alex est trop stylée ».","Le gâteau est littéralement un drop légendaire, ne le laisse pas filer."],l=s("/"),t=s("/apps/profil/");d.innerHTML=`
    <div class="wrap">
      <header class="hero-card">
        <div class="halo"></div>
        <div class="hero-copy">
          <span class="pill">Succès secret · ${c.minXP} XP</span>
          <h1>${e.playerProfile.avatar} Joyeux 31, Alex !</h1>
          <p>
            ${a[Math.floor(Math.random()*a.length)]}
            Merci d'être la joueuse qui transforme chaque partie en souvenir doré.
          </p>
          <div class="cta-row">
            <a class="btn primary" href="${l}">Retour au hub</a>
            <a class="btn ghost" href="${t}">Voir ton profil</a>
          </div>
        </div>
        <div class="card-badge">
          <p class="label">XP actuel</p>
          <strong>${e.globalXP.toLocaleString("fr-FR")} XP</strong>
          <p class="muted">Pseudo validé : ${e.playerProfile.name}</p>
        </div>
      </header>

      <section class="grid">
        <article class="card">
          <div class="pill ghost">Bonus d'anniversaire</div>
          <ul class="perks">
            ${i.map(r=>`<li><span>🎁</span>${r}</li>`).join("")}
          </ul>
        </article>

        <article class="card vibes">
          <div class="pill ghost">Message intergalactique</div>
          <p class="vibe">
            Dans ce hub, ${e.playerProfile.name} est officiellement la boss ultime des 31. Continue de spammer tes éclats de rire,
            ça fait crit sur tout le monde.
          </p>
          <div class="callout">PS : si quelqu'un demande, c'est un Easter egg codé rien que pour toi.</div>
        </article>

        <article class="card mini">
          <div class="pill ghost">À garder</div>
          <div class="mini-list">
            <div><span class="tag">⚡️</span>Un vœu prioritaire dans le hub</div>
            <div><span class="tag">🎉</span>Un high-five cosmique réservé</div>
            <div><span class="tag">🧁</span>Le dernier bout de gâteau t'appartient</div>
          </div>
        </article>
      </section>
    </div>
  `}
