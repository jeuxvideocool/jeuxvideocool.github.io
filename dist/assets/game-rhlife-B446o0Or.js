import{m as D,e as w,f as A,l as g,w as I,s as H}from"./index-Dht2C2Xm.js";/* empty css                    */const O=[{id:"satisfaction",label:"Satisfaction affichee",visible:!0,initial:54,polarity:"positive"},{id:"performance",label:"Performance business",visible:!0,initial:56,polarity:"positive"},{id:"legal",label:"Conformite legale",visible:!0,initial:62,polarity:"positive"},{id:"pressure",label:"Pression hierarchique",visible:!0,initial:48,polarity:"negative"},{id:"reputation",label:"Reputation RH",visible:!0,initial:50,polarity:"positive"},{id:"burnout",label:"Epuisement reel",visible:!1,initial:35,polarity:"negative"},{id:"cynicism",label:"Cynisme collectif",visible:!1,initial:38,polarity:"negative"},{id:"socialRisk",label:"Risque social latent",visible:!1,initial:30,polarity:"negative"}],G=[{id:"intro-barometre",title:"Semaine 1 - Barometre qui gratte",difficulty:1,context:{mail:"Objet: Barometre Q2 - merci d'eviter les verbatims bruts.",meeting:"Reunion hebdo RH: on communique sur l'energie, pas sur les irritants.",rumor:"Rumeur: les resultats seront filtres avant diffusion.",incident:"Incident discret: un tableau d'arrets a tourne sur Teams.",urgentRequest:"Demande urgente: COMEX veut une note positive avant demain 9h."},problem:"Le barometre remonte un malaise net. Le terrain veut de la transparence. Le management veut un message propre.",choices:[{id:"intro-optimize",label:"Publier une synthese optimisee avec actions rapides.",immediateEffects:{satisfaction:4,performance:2,legal:-2,pressure:-3,reputation:1,burnout:1,cynicism:4,socialRisk:3},deferredConsequences:[{delay:2,summary:"Fuite des verbatims bruts. Indignation en interne.",event:"Un cadre partage le fichier original a un collectif.",effects:{satisfaction:-6,reputation:-4,socialRisk:8,legal:-3}}],feedback:"Synthese alignee. Message recu. On respire.",futureEvent:"Risque de fuite si un verbatim circule.",endingImpact:"Renforce une trajectoire performante mais impopulaire."},{id:"intro-listen",label:"Organiser des ateliers d'ecoute limites et anonymes.",immediateEffects:{satisfaction:6,performance:-2,legal:1,pressure:3,reputation:3,burnout:-2,cynicism:-2,socialRisk:-1},deferredConsequences:[{delay:2,summary:"Attentes non financees. La parole tourne court.",event:"Les groupes disent avoir servi de vitrine.",effects:{cynicism:6,satisfaction:-3,pressure:2}}],feedback:"Signal humain envoye. Agenda alourdi.",futureEvent:"Risque d'effet boomerang si rien ne suit.",endingImpact:"Favorise une fin humaine mais politisee."},{id:"intro-legal",label:"Remonter l'alerte au juridique et geler la comm.",immediateEffects:{satisfaction:-3,performance:-1,legal:5,pressure:5,reputation:1,burnout:1,cynicism:1,socialRisk:2},deferredConsequences:[{delay:1,summary:"Le juridique demande des traces et des preuves.",event:"Audit interne surprise.",effects:{pressure:3,performance:-2,legal:2,burnout:2}}],feedback:"Couverture legale solide. Ambiance raidie.",futureEvent:"Audit interne si les signaux se confirment.",endingImpact:"Rend plausible une fin sacrifiee par le systeme."}]},{id:"mobilite-agile",title:"Semaine 3 - Mobilite agile",difficulty:2,context:{mail:"Objet: Projet Mobilite Agile - rationaliser les effectifs.",meeting:"Comite managers: on requalifie les postes, pas besoin de filer la parano.",rumor:"Rumeur: une liste de 40 noms circule.",incident:"Incident discret: un manager annonce un changement de poste sans RH.",urgentRequest:"Demande urgente: CFO veut un plan low noise d'ici vendredi."},problem:"Le plan de mobilite reduit les couts mais fracture les equipes. Tu dois cadrer la methode.",choices:[{id:"mobilite-force",label:"Valider la mobilite forcee avec un discours d'opportunite.",immediateEffects:{satisfaction:-5,performance:6,legal:-3,pressure:-2,reputation:-3,burnout:4,cynicism:5,socialRisk:5},deferredConsequences:[{delay:1,summary:"Plainte collective et intervention des representants.",event:"Saisine de l'inspection du travail.",effects:{legal:-6,socialRisk:7,reputation:-2}}],feedback:"Plan accelere. Tension assumee.",futureEvent:"Risque de contentieux si un dossier sort.",endingImpact:"Renforce la trajectoire DRH performante mais detestee."},{id:"mobilite-pilote",label:"Negocier un pilote transparent avec volontariat limite.",immediateEffects:{satisfaction:3,performance:-2,legal:2,pressure:2,reputation:2,burnout:1,cynicism:-1,socialRisk:-1},deferredConsequences:[{delay:2,summary:"Le pilote ralentit les economies mais apaise.",event:"Le Comex valide une phase 2 plus douce.",effects:{performance:4,satisfaction:2,pressure:-2}}],feedback:"Tu gagnes du temps, pas du credit.",futureEvent:"Phase 2 conditionnee aux resultats.",endingImpact:"Favorise une fin humaine mais marginalisee."},{id:"mobilite-stop",label:"Bloquer le projet et demander un arbitrage officiel.",immediateEffects:{satisfaction:1,performance:-4,legal:3,pressure:5,reputation:2,burnout:-2,cynicism:-1,socialRisk:-2},deferredConsequences:[{delay:1,summary:"Le sponsor cherche un contournement.",event:"Un cabinet externe arrive avec un plan sec.",effects:{pressure:4,performance:-2,cynicism:2}}],feedback:"Position principielle. Alliances fragiles.",futureEvent:"Cabinet externe si l'arbitrage patine.",endingImpact:"Rend plausible une fin sacrifiee ou isolee."}]},{id:"calibration",title:"Semaine 6 - Calibration des performances",difficulty:3,context:{mail:"Objet: Ajustement bonus - marge Q3.",meeting:"Reunion managers: on doit sortir 10% en plan de perf.",rumor:"Rumeur: une liste des trop chers circule.",incident:"Incident discret: un employe craque en open space.",urgentRequest:"Demande urgente: liste PIP pour demain 18h."},problem:"Le tri demande du management parait 'inevitable'. Chaque scenario casse quelque chose.",choices:[{id:"calibration-forced",label:"Appliquer le forced ranking et livrer la liste.",immediateEffects:{satisfaction:-6,performance:5,legal:-2,pressure:-3,reputation:-4,burnout:4,cynicism:6,socialRisk:6},deferredConsequences:[{delay:1,summary:"Depart massif et murmures de greve.",event:"Des leaders informels parlent d'arret.",effects:{socialRisk:7,reputation:-5,satisfaction:-3}}],feedback:"Liste livree. Silence dans les couloirs.",futureEvent:"Risque d'arret collectif si la liste fuit.",endingImpact:"Pousse vers DRH performant mais deteste."},{id:"calibration-support",label:"Proposer un plan d'accompagnement avec objectifs realistes.",immediateEffects:{satisfaction:-2,performance:2,legal:1,pressure:2,reputation:2,burnout:1,cynicism:-1,socialRisk:-1},deferredConsequences:[{delay:2,summary:"Les equipes remercient mais demandent des moyens.",event:"La charge de travail devient le sujet #1.",effects:{burnout:4,satisfaction:3,pressure:1}}],feedback:"Tu gagnes du lien, pas des lignes de budget.",futureEvent:"La charge revient en boomerang.",endingImpact:"Renforce une fin humaine mais marginalisee."},{id:"calibration-refuse",label:"Refuser la liste, demander mediation collective.",immediateEffects:{satisfaction:3,performance:-3,legal:3,pressure:5,reputation:3,burnout:-1,cynicism:-2,socialRisk:-2},deferredConsequences:[{delay:1,summary:"Le Comex te passe en risque politique.",event:"On te retire un dossier strategique.",effects:{pressure:4,reputation:-2,performance:-1}}],feedback:"Posture claire. Couloir politique ferme.",futureEvent:"Retrait de dossier si la tension monte.",endingImpact:"Rend plausible une fin sacrifiee."}]},{id:"crise-publique",title:"Semaine 9 - Exposition publique",difficulty:4,context:{mail:"Objet: Article presse en preparation.",meeting:"Comite de crise: on aligne la narration, pas les details.",rumor:"Rumeur: les syndicats preparent un appel public.",incident:"Incident discret: un post LinkedIn anonyme cite la boite.",urgentRequest:"Demande urgente: preparer un memo et un nom de porte-parole."},problem:"L'exterieur regarde enfin. La RH devient visible. Le systeme veut un fusible.",choices:[{id:"crise-fusible",label:"Cadrer la com' et designer un manager fusible.",immediateEffects:{satisfaction:-4,performance:2,legal:-3,pressure:-2,reputation:4,burnout:3,cynicism:5,socialRisk:6},deferredConsequences:[{delay:1,summary:"Le fusible parle. La version se fissure.",event:"Un avocat publie des mails internes.",effects:{legal:-5,reputation:-4,socialRisk:4}}],feedback:"Sortie de crise rapide. Detonateur en reserve.",futureEvent:"Risque de contre-recits publics.",endingImpact:"Pousse vers une fin sacrifiee ou cynique."},{id:"crise-cooperate",label:"Cooperer avec l'inspection et partager les donnees brutes.",immediateEffects:{satisfaction:1,performance:-2,legal:5,pressure:4,reputation:1,burnout:2,cynicism:-1,socialRisk:-2},deferredConsequences:[{delay:1,summary:"Le rapport officialise les tensions mais ouvre un plan.",event:"Le Comex impose une tutelle RH.",effects:{pressure:-3,socialRisk:-3,reputation:2}}],feedback:"Conformite sauvee. Autorite entamee.",futureEvent:"Tutelle si l'inspection conclut a un risque.",endingImpact:"Peut mener a une fin humaine mais marginalisee."},{id:"crise-wellbeing",label:"Lancer un plan bien-etre express et storytelling interne.",immediateEffects:{satisfaction:3,performance:-1,legal:-1,pressure:1,reputation:2,burnout:1,cynicism:2,socialRisk:2},deferredConsequences:[{delay:1,summary:"Le decalage entre discours et realite explose.",event:"Un hashtag moqueur devient viral.",effects:{cynicism:8,satisfaction:-4,socialRisk:5,reputation:-3}}],feedback:"Surface propre. Fond inquiet.",futureEvent:"Risque de backlash public si la campagne tourne mal.",endingImpact:"Renforce une fin cynique ou broyee."}]}],N=[{id:"burnout",title:"RH broyee",description:"Tu tiens la barque a mains nues. Le systeme te remplace sans bruit.",min:{burnout:80,pressure:70}},{id:"scapegoat",title:"RH sacrifiee",description:"Le dossier devait tomber. Tu etais la variable d'ajustement.",min:{pressure:75,socialRisk:60}},{id:"cynic",title:"RH devenu cynique",description:"Tu parles Excel. Tu penses Excel. Tu ne ressens plus grand-chose.",min:{cynicism:70,reputation:40}},{id:"drh-hated",title:"DRH performant mais deteste",description:"Objectifs atteints. Regards froids. Dossiers propres. Couloirs vides.",min:{performance:70},max:{satisfaction:40,reputation:45}},{id:"human-marginalized",title:"RH humaine mais marginalisee",description:"Tu as protege des gens. Le pouvoir t'a contourne.",min:{satisfaction:65},max:{performance:55}},{id:"exit-system",title:"RH qui quitte le systeme",description:"Tu pars avant de devenir un rouage. Le systeme continue sans toi.",min:{burnout:70,reputation:45}},{id:"limbo",title:"RH en sursis",description:"Tu restes. Rien n'est resolu. La prochaine crise est deja planifiee."}],B={gauges:O,scenarios:G,endings:N},p="rhlife",n=D(p),y=w(),u=n&&y.find(e=>e.id===n.themeId)||y[0];A();const x=B,m=x.gauges,f=x.scenarios,R=x.endings,F=new Map(m.map(e=>[e.id,e])),v=(n==null?void 0:n.difficultyParams.startingGauge)??50,_=(n==null?void 0:n.difficultyParams.minGauge)??0,U=(n==null?void 0:n.difficultyParams.maxGauge)??100;if(u){const e=document.documentElement.style;e.setProperty("--color-primary",u.colors.primary),e.setProperty("--color-secondary",u.colors.secondary),e.setProperty("--color-accent",u.colors.accent),e.setProperty("--color-text",u.colors.text),e.setProperty("--color-muted",u.colors.muted),e.setProperty("--color-bg",u.colors.background||"#0b101a"),e.setProperty("--color-surface",u.colors.surface||"rgba(255, 255, 255, 0.06)"),document.body.style.background=u.gradient||document.body.style.background}const k=document.getElementById("game-canvas"),L=document.getElementById("ui"),b=document.createElement("div");b.className="rh-shell";L.appendChild(b);const d=document.createElement("div");d.className="launch-overlay";d.style.display="none";L.appendChild(d);function j(){k.width=window.innerWidth*devicePixelRatio,k.height=window.innerHeight*devicePixelRatio}j();window.addEventListener("resize",j);const s={index:0,gauges:S(),pending:[],deferredNow:[],activeResult:null,runStarted:0};function S(){const e=m.map(i=>[i.id,i.initial??v]);return Object.fromEntries(e)}function z(e){return Math.min(U,Math.max(_,Math.round(e)))}function $(e){Object.entries(e).forEach(([i,t])=>{const a=s.gauges[i]??v;s.gauges[i]=z(a+t)})}function J(e,i){e.deferredConsequences.forEach(t=>{s.pending.push({applyAt:s.index+t.delay,summary:t.summary,event:t.event,effects:t.effects,source:{scenarioId:i,choiceId:e.id}})})}function Q(e){const i=s.pending.filter(t=>t.applyAt===e);return s.pending=s.pending.filter(t=>t.applyAt!==e),i.forEach(t=>$(t.effects)),i}function V(){const e=s.pending.filter(i=>i.applyAt>=f.length);return s.pending=[],e.forEach(i=>$(i.effects)),e}function W(){const e=(s.gauges.satisfaction||0)+(s.gauges.performance||0)+(s.gauges.legal||0)+(s.gauges.reputation||0),i=(s.gauges.pressure||0)+(s.gauges.burnout||0)+(s.gauges.cynicism||0)+(s.gauges.socialRisk||0),t=Math.round((e+(400-i))/8);return Math.max(0,Math.min(100,t))}function K(){return R.find(i=>{if(i.min){for(const[t,a]of Object.entries(i.min))if((s.gauges[t]??v)<a)return!1}if(i.max){for(const[t,a]of Object.entries(i.max))if((s.gauges[t]??v)>a)return!1}return!0})||R[R.length-1]}function P(){if(!n){E("Config a completer","Cree configs/games/rhlife.config.json",!1);return}d.style.display="none",s.index=0,s.gauges=S(),s.pending=[],s.deferredNow=[],s.activeResult=null,s.runStarted=Date.now(),g({type:"SESSION_START",gameId:p}),q()}function M(e){if(s.activeResult)return;const i=f[s.index],t=i==null?void 0:i.choices[e];t&&($(t.immediateEffects),J(t,i.id),s.activeResult={scenarioId:i.id,choice:t,immediateEffects:t.immediateEffects},g({type:"CHOICE_MADE",gameId:p,payload:{scenarioId:i.id,choiceId:t.id}}),q())}function T(){if(!s.activeResult)return;g({type:"SCENARIO_COMPLETE",gameId:p,payload:{scenarioId:s.activeResult.scenarioId}}),s.activeResult=null;const e=s.index+1;if(e>=f.length){X();return}s.index=e,s.deferredNow=Q(s.index),q()}function X(){const e=V(),i=K(),t=W();g({type:"ENDING_REACHED",gameId:p,payload:{endingId:i.id,score:t}}),g({type:"SESSION_WIN",gameId:p,payload:{endingId:i.id,score:t}}),H(p,(n==null?void 0:n.saveSchemaVersion)??1,a=>{const r=a.state.runs||0;a.state.runs=r+1,a.state.lastEndingId=i.id,a.state.lastScore=t,(!a.bestScore||t>a.bestScore)&&(a.bestScore=t,a.state.bestScore=t)}),ee(i,t,e)}function q(){const e=f[s.index];if(!e)return;const i=m.filter(o=>o.visible),t=m.filter(o=>!o.visible),a=Y(s.deferredNow),r=s.activeResult?Z(s.activeResult):"",c=s.activeResult?"":`
      <div class="rh-choices">
        ${e.choices.map((o,l)=>`<button class="rh-choice" data-choice-index="${l}"><span>${l+1}</span>${o.label}</button>`).join("")}
      </div>
    `;b.innerHTML=`
    <div class="rh-header">
      <div class="rh-title">${(n==null?void 0:n.uiText.title)||"RHLife"}</div>
      <div class="rh-meta">
        <span>Scenario ${s.index+1}/${f.length}</span>
        <span>Difficulte ${e.difficulty}</span>
      </div>
      <div class="rh-tags">
        <span class="rh-tag">${e.title}</span>
      </div>
    </div>
    <div class="rh-grid">
      <section class="rh-panel">
        <h2>Jauges visibles</h2>
        ${i.map(C).join("")}
        <h2>Indicateurs internes</h2>
        ${t.map(C).join("")}
      </section>
      <section class="rh-panel">
        ${a}
        <h2>Contexte narratif</h2>
        <div class="rh-context">
          ${h("Mail",e.context.mail)}
          ${h("Reunion",e.context.meeting)}
          ${h("Rumeur",e.context.rumor)}
          ${h("Incident",e.context.incident)}
          ${h("Urgent",e.context.urgentRequest)}
        </div>
        <h2>Situation problematique</h2>
        <div class="rh-problem">${e.problem}</div>
        ${r}
        ${c}
      </section>
    </div>
  `}function C(e){const i=s.gauges[e.id]??v,t=Math.min(100,Math.max(0,i));return`
    <div class="rh-gauge ${e.polarity==="negative"?"is-negative":"is-positive"}">
      <div class="rh-gauge-head">
        <span>${e.label}</span>
        <strong>${i}</strong>
      </div>
      <div class="rh-gauge-bar"><span style="width: ${t}%"></span></div>
    </div>
  `}function h(e,i){return`
    <div class="rh-context-item">
      <span>${e}</span>
      <div>${i}</div>
    </div>
  `}function Y(e){return e.length?`
    <div class="rh-deferred">
      <h4>Consequences differees</h4>
      ${e.map(i=>`<p>${i.summary} (${i.event})</p>`).join("")}
    </div>
  `:""}function Z(e){const i=Object.entries(e.immediateEffects).map(([a,r])=>{const c=F.get(a);if(!c)return"";const o=r>0?"+":"",l=r>=0?"pos":"neg";return`
        <div class="rh-effect">
          <strong>${c.label}</strong>
          <span class="${l}">${o}${r}</span>
        </div>
      `}).join(""),t=e.choice.deferredConsequences.length?e.choice.deferredConsequences.map(a=>`<div class="rh-effect"><strong>Dans ${a.delay} scenario(s)</strong><span>${a.summary}</span></div>`).join(""):'<div class="rh-effect"><span>Aucun signal differe identifie.</span></div>';return`
    <div class="rh-result">
      <div class="rh-result-title">Decision actee</div>
      <p class="rh-result-choice">${e.choice.label}</p>
      <div class="rh-result-block">
        <h4>Feedback corporate</h4>
        <p>${e.choice.feedback}</p>
      </div>
      <div class="rh-result-block">
        <h4>Effets immediats</h4>
        <div class="rh-effects">${i}</div>
      </div>
      <div class="rh-result-block">
        <h4>Consequences differees possibles</h4>
        <div class="rh-effects">${t}</div>
      </div>
      <div class="rh-result-meta">
        <div>
          <span>Evenement futur declenchable</span>
          <p>${e.choice.futureEvent}</p>
        </div>
        <div>
          <span>Impact potentiel sur la fin du jeu</span>
          <p>${e.choice.endingImpact}</p>
        </div>
      </div>
      <button class="rh-btn" data-action="continue">Continuer</button>
    </div>
  `}function E(e,i,t=!0){d.style.display="grid";const a=(n==null?void 0:n.uiText.shortDescription)||"",r=i||(n==null?void 0:n.uiText.help)||"",c=((n==null?void 0:n.uiText.controls)||[]).map(l=>`<span class="launch-chip">${l}</span>`).join("");d.innerHTML=`
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${(n==null?void 0:n.uiText.title)||"RHLife"}</span>
        </div>
        <h2 class="launch-title">${e}</h2>
        ${a?`<p class="launch-subtitle">${a}</p>`:""}
      </div>
      <div class="launch-grid">
        <section class="launch-section">
          <h3 class="launch-section-title">Briefing</h3>
          <p class="launch-text">${r}</p>
          <p class="launch-note">Chaque choix deplace des jauges visibles et internes. Rien n'est neutre.</p>
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Indicateurs</h3>
          <div class="launch-metrics">
            ${m.map(l=>`<div class="launch-metric"><span>${l.label}</span><strong>${s.gauges[l.id]}</strong></div>`).join("")}
          </div>
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Controles</h3>
          <div class="launch-chips">
            ${c||'<span class="launch-chip muted">Controles a definir</span>'}
          </div>
        </section>
      </div>
      <div class="launch-actions">
        ${t?'<button class="launch-btn primary" id="launch-start">Lancer</button>':""}
        <a class="launch-btn ghost" href="${I("/")}">Hub</a>
      </div>
    </div>
  `;const o=document.getElementById("launch-start");o==null||o.addEventListener("click",P)}function ee(e,i,t){var r;d.style.display="grid";const a=t.length?t.map(c=>`<p class="launch-note">${c.summary} (${c.event})</p>`).join(""):'<p class="launch-note">Aucune onde de choc supplementaire detectee.</p>';d.innerHTML=`
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Fin atteinte</span>
          <span class="launch-badge ghost">${e.title}</span>
        </div>
        <h2 class="launch-title">${e.title}</h2>
        <p class="launch-subtitle">${e.description}</p>
      </div>
      <div class="launch-grid">
        <section class="launch-section">
          <h3 class="launch-section-title">Bilan</h3>
          <p class="launch-text">Score de carriere: ${i}</p>
          ${a}
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Jauges finales</h3>
          <div class="launch-metrics">
            ${m.map(c=>`<div class="launch-metric"><span>${c.label}</span><strong>${s.gauges[c.id]}</strong></div>`).join("")}
          </div>
        </section>
      </div>
      <div class="launch-actions">
        <button class="launch-btn primary" id="launch-retry">Rejouer</button>
        <a class="launch-btn ghost" href="${I("/")}">Hub</a>
      </div>
    </div>
  `,(r=document.getElementById("launch-retry"))==null||r.addEventListener("click",P)}function ie(e){if(d.style.display!=="none")return;const i=(n==null?void 0:n.input.keys)||{};if(s.activeResult){(e.code===i.next||e.code==="Enter")&&T();return}const t=f[s.index];if(!t)return;const r=[i.choice1,i.choice2,i.choice3,i.choice4].findIndex(c=>c&&e.code===c);r>=0&&r<t.choices.length&&M(r)}b.addEventListener("click",e=>{const i=e.target;if(!i)return;const t=i.closest("[data-choice-index]");if(t){const r=Number(t.dataset.choiceIndex);M(r);return}const a=i.closest("[data-action]");(a==null?void 0:a.dataset.action)==="continue"&&T()});window.addEventListener("keydown",ie);n?E(n.uiText.title,n.uiText.help,!0):E("Config manquante","Ajoute configs/games/rhlife.config.json",!1);
