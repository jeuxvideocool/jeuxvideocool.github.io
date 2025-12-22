import{n as R,e as A,f as O,w as G,l as u,p as M,q as H,v as _}from"./index-C4KyqBCx.js";import{c as N,a as U}from"./input-BbQ5CX8d.js";import{c as F}from"./loop-24SuRqx9.js";const d="drive",t=R(d),b=A(),r=t&&b.find(a=>a.id===t.themeId)||b[0];O();if(r){const a=document.documentElement.style;a.setProperty("--color-primary",r.colors.primary),a.setProperty("--color-secondary",r.colors.secondary),a.setProperty("--color-accent",r.colors.accent),a.setProperty("--color-text",r.colors.text),a.setProperty("--color-muted",r.colors.muted),document.body.style.background=r.gradient||document.body.style.background}const f=document.getElementById("game-canvas"),w=document.getElementById("ui"),c=f.getContext("2d"),y=N(),h=document.createElement("div");h.className="launch-overlay";h.style.display="none";w.appendChild(h);const o={left:(t==null?void 0:t.input.keys.left)||"ArrowLeft",right:(t==null?void 0:t.input.keys.right)||"ArrowRight",boost:(t==null?void 0:t.input.keys.boost)||"ArrowUp"},v=U({gameId:d,container:document.body,input:y,touch:{mapping:{left:o.left,right:o.right,up:o.boost,actionA:o.boost,actionALabel:"Boost"},showPad:!0,gestureEnabled:!1},motion:{input:y,axis:{x:{negative:o.left,positive:o.right}},actions:[{code:o.boost,trigger:"tiltForward",mode:"hold",threshold:16}]},hints:{touch:"Flèches pour changer de voie, bouton Boost.",motion:"Incliner pour changer de voie, pencher vers l'avant pour booster."}}),W=new Image;W.src=new URL("data:image/svg+xml,%3csvg%20width='64'%20height='128'%20viewBox='0%200%2064%20128'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='64'%20height='128'%20rx='10'%20fill='%23ff6b6b'/%3e%3crect%20x='10'%20y='10'%20width='44'%20height='108'%20rx='8'%20fill='%231b233a'/%3e%3crect%20x='14'%20y='16'%20width='36'%20height='30'%20rx='6'%20fill='%230bd0ff'%20opacity='0.8'/%3e%3crect%20x='14'%20y='82'%20width='36'%20height='30'%20rx='6'%20fill='%230bd0ff'%20opacity='0.8'/%3e%3crect%20x='6'%20y='32'%20width='8'%20height='20'%20rx='3'%20fill='%23ffd166'/%3e%3crect%20x='50'%20y='32'%20width='8'%20height='20'%20rx='3'%20fill='%23ffd166'/%3e%3crect%20x='6'%20y='76'%20width='8'%20height='20'%20rx='3'%20fill='%23ffd166'/%3e%3crect%20x='50'%20y='76'%20width='8'%20height='20'%20rx='3'%20fill='%23ffd166'/%3e%3c/svg%3e",import.meta.url).href;const S=new Image;S.src=new URL("data:image/svg+xml,%3csvg%20width='64'%20height='128'%20viewBox='0%200%2064%20128'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='64'%20height='128'%20rx='10'%20fill='%230bd0ff'/%3e%3crect%20x='10'%20y='10'%20width='44'%20height='108'%20rx='8'%20fill='%23111624'/%3e%3crect%20x='14'%20y='18'%20width='36'%20height='28'%20rx='6'%20fill='%237af0ff'%20opacity='0.6'/%3e%3crect%20x='14'%20y='82'%20width='36'%20height='28'%20rx='6'%20fill='%237af0ff'%20opacity='0.6'/%3e%3crect%20x='6'%20y='36'%20width='8'%20height='18'%20rx='3'%20fill='%2364f4ac'/%3e%3crect%20x='50'%20y='36'%20width='8'%20height='18'%20rx='3'%20fill='%2364f4ac'/%3e%3crect%20x='6'%20y='78'%20width='8'%20height='18'%20rx='3'%20fill='%2364f4ac'/%3e%3crect%20x='50'%20y='78'%20width='8'%20height='18'%20rx='3'%20fill='%2364f4ac'/%3e%3c/svg%3e",import.meta.url).href;const D=new Image;D.src=new URL("data:image/svg+xml,%3csvg%20width='64'%20height='64'%20viewBox='0%200%2064%2064'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='8'%20y='8'%20width='48'%20height='48'%20rx='12'%20fill='%2364f4ac'%20opacity='0.85'/%3e%3crect%20x='16'%20y='16'%20width='32'%20height='32'%20rx='8'%20fill='%230bd0ff'%20opacity='0.8'/%3e%3cpath%20d='M32%2014%20L36%2032%20L28%2032%20Z'%20fill='%23ffd166'/%3e%3crect%20x='30'%20y='32'%20width='4'%20height='18'%20rx='2'%20fill='%23ffd166'/%3e%3c/svg%3e",import.meta.url).href;const m=(t==null?void 0:t.difficultyParams.laneCount)??3,g=Array.from({length:m},(a,i)=>i),e={running:!1,width:0,height:0,roadWidth:0,laneWidth:0,player:{lane:1,y:.78,boost:0,cooldown:0},traffic:[],pickups:[],distance:0,speed:120,trafficTimer:0,pickupTimer:0};function L(){f.width=window.innerWidth*devicePixelRatio,f.height=window.innerHeight*devicePixelRatio,e.width=f.width/devicePixelRatio,e.height=f.height/devicePixelRatio,e.roadWidth=Math.min(520,e.width*.65),e.laneWidth=e.roadWidth/m}L();window.addEventListener("resize",L);const C=F({update:a=>Q(a),render:ee,fps:60});function V(){e.player.lane=Math.floor(m/2),e.player.boost=0,e.player.cooldown=0,e.distance=0,e.traffic=[],e.pickups=[],e.speed=(t==null?void 0:t.difficultyParams.trafficSpeed)??200,e.trafficTimer=0,e.pickupTimer=0}function Y(){if(!t){k("Config à compléter","Crée configs/games/drive.config.json",!1);return}v.show(),V(),e.running=!0,h.style.display="none",u({type:"SESSION_START",gameId:d}),C.start()}function j(a){e.running=!1,C.stop(),v.hide(),u({type:"SESSION_FAIL",gameId:d,payload:{score:Math.floor(e.distance)}}),t&&_(d,t.saveSchemaVersion,s=>{const n=s.state.bestDistance||0;e.distance>n&&(s.state.bestDistance=Math.floor(e.distance),s.bestScore=Math.floor(e.distance))}),k("Crash !",(t==null?void 0:t.uiText.help)||"")}function z(){const a=g[M(0,g.length-1)],i=(t==null?void 0:t.difficultyParams.trafficSpeed)??220,s=(t==null?void 0:t.difficultyParams.trafficSpeedVariance)??40,n=i+M(-s,s);e.traffic.push({lane:a,y:-.3,speed:n})}function X(){const a=g[M(0,g.length-1)];e.pickups.push({lane:a,y:-.3})}function P(a){e.player.lane=H(e.player.lane+a,0,m-1)}function q(a){if(e.player.cooldown=Math.max(0,e.player.cooldown-a*1e3),e.player.boost=Math.max(0,e.player.boost-a*1e3),e.player.boost>0)return;y.isDown(o.boost)&&e.player.cooldown<=0&&(e.player.boost=(t==null?void 0:t.difficultyParams.boostDurationMs)??2600,e.player.cooldown=(t==null?void 0:t.difficultyParams.boostCooldownMs)??4200,u({type:"BOOST_USED",gameId:d}))}function Z(){y.isDown(o.left)&&P(-1),y.isDown(o.right)&&P(1)}function J(a){e.traffic=e.traffic.map(i=>({...i,y:i.y+i.speed/e.height*a})).filter(i=>i.y<1.4),e.pickups=e.pickups.map(i=>({...i,y:i.y+e.speed/e.height*a})).filter(i=>i.y<1.4)}function K(){const a=e.height*e.player.y,i=e.laneWidth*.35;for(const s of e.traffic){if(s.lane!==e.player.lane)continue;const n=s.y*e.height;if(Math.abs(n-a)<i*1.1)if(e.player.boost>0)u({type:"OBSTACLE_DODGED",gameId:d}),e.traffic=e.traffic.filter(l=>l!==s);else{j();return}}for(const s of e.pickups){if(s.lane!==e.player.lane)continue;const n=s.y*e.height;Math.abs(n-a)<i&&(u({type:"ITEM_COLLECTED",gameId:d}),e.player.boost=((t==null?void 0:t.difficultyParams.boostDurationMs)??2600)/2,e.pickups=e.pickups.filter(l=>l!==s))}}function Q(a){!e.running||!t||(e.distance+=e.speed/10*a,e.speed+=a*2,e.trafficTimer+=a*1e3,e.pickupTimer+=a*1e3,Z(),q(a),J(a),e.trafficTimer>=((t==null?void 0:t.difficultyParams.trafficSpawnMs)??950)&&(e.trafficTimer=0,z()),e.pickupTimer>=((t==null?void 0:t.difficultyParams.pickupSpawnMs)??1800)&&(e.pickupTimer=0,X()),K())}function ee(){c.save(),c.scale(devicePixelRatio,devicePixelRatio),c.clearRect(0,0,e.width,e.height);const a=e.width/2-e.roadWidth/2;c.fillStyle="rgba(255,255,255,0.04)",c.fillRect(a,0,e.roadWidth,e.height),c.strokeStyle="rgba(255,255,255,0.1)";for(let n=1;n<m;n++){const l=a+n*e.laneWidth;c.setLineDash([12,12]),c.beginPath(),c.moveTo(l,0),c.lineTo(l,e.height),c.stroke()}c.setLineDash([]);const i=a+e.player.lane*e.laneWidth+e.laneWidth/2-e.laneWidth*.25,s=e.height*e.player.y-e.laneWidth*.5;T(W,i,s,e.laneWidth*.5,e.laneWidth*.9),e.traffic.forEach(n=>{const l=a+n.lane*e.laneWidth+e.laneWidth/2-e.laneWidth*.25,p=n.y*e.height-e.laneWidth*.5;T(S,l,p,e.laneWidth*.5,e.laneWidth*.9)}),e.pickups.forEach(n=>{const l=a+n.lane*e.laneWidth+e.laneWidth/2-e.laneWidth*.25,p=n.y*e.height-e.laneWidth*.25;T(D,l,p,e.laneWidth*.5,e.laneWidth*.5)}),c.restore(),te()}function T(a,i,s,n,l){a.complete?c.drawImage(a,i,s,n,l):(c.fillStyle=r.colors.primary,c.fillRect(i,s,n,l))}function te(){w.innerHTML="",w.appendChild(h);const a=document.createElement("div");a.className="hud";const i=Math.max(0,Math.floor(e.player.boost/100)/10),s=Math.max(0,Math.floor(e.player.cooldown/100)/10);a.innerHTML=`
    <div class="pill">Distance ${Math.floor(e.distance)} m</div>
    <div class="pill">Boost ${i?i+"s":"prêt"} · CD ${s?s+"s":"0s"}</div>
    <div class="pill">Trafic ${e.traffic.length}</div>
  `,w.appendChild(a)}function k(a,i,s=!0){v.hide(),h.style.display="grid";const n=(t==null?void 0:t.uiText.shortDescription)||"",l=i||(t==null?void 0:t.uiText.help)||"",p=((t==null?void 0:t.uiText.controls)||[]).map($=>`<span class="launch-chip">${$}</span>`).join(""),E=(t==null?void 0:t.difficultyParams.laneCount)??3,I=Math.round(((t==null?void 0:t.difficultyParams.boostDurationMs)??3e3)/1e3),B=`
    <div class="launch-rows">
      <div class="launch-row">
        <span class="launch-row-label">Mode</span>
        <div class="launch-row-value">
          <span class="launch-chip">Sans fin</span>
        </div>
      </div>
      <div class="launch-row">
        <span class="launch-row-label">Voies</span>
        <div class="launch-row-value">
          <span class="launch-chip">${E}</span>
        </div>
      </div>
      <div class="launch-row">
        <span class="launch-row-label">Boost</span>
        <div class="launch-row-value">
          <span class="launch-chip">${I}s</span>
        </div>
      </div>
    </div>
  `;h.innerHTML=`
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${(t==null?void 0:t.uiText.title)||"Neon Drive"}</span>
        </div>
        <h2 class="launch-title">${a}</h2>
        ${n?`<p class="launch-subtitle">${n}</p>`:""}
      </div>
      <div class="launch-grid">
        <section class="launch-section">
          <h3 class="launch-section-title">Briefing</h3>
          <p class="launch-text">${l}</p>
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Paramètres</h3>
          ${B}
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Contrôles</h3>
          <div class="launch-chips">
            ${p||'<span class="launch-chip muted">Contrôles à définir</span>'}
          </div>
        </section>
      </div>
      <div class="launch-actions">
        ${s?'<button class="launch-btn primary" id="launch-start">Lancer</button>':""}
        <a class="launch-btn ghost" href="${G("/")}">Hub</a>
      </div>
    </div>
  `,v.attachOverlay(h);const x=document.getElementById("launch-start");x==null||x.addEventListener("click",Y)}k((t==null?void 0:t.uiText.title)||"Neon Drive",(t==null?void 0:t.uiText.help)||"Évite les voitures et ramasse les boosts.");
