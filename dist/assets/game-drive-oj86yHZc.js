import{m as R,e as A,f as G,w as H,k as u,n as T,p as O,t as _}from"./index-Cmf_HX6D.js";import{c as N,a as U}from"./input-BfI4bNy9.js";import{c as V}from"./loop-24SuRqx9.js";const h="drive",t=R(h),g=A(),o=t&&g.find(a=>a.id===t.themeId)||g[0];G();if(o){const a=document.documentElement.style;a.setProperty("--color-primary",o.colors.primary),a.setProperty("--color-secondary",o.colors.secondary),a.setProperty("--color-accent",o.colors.accent),a.setProperty("--color-text",o.colors.text),a.setProperty("--color-muted",o.colors.muted),document.body.style.background=o.gradient||document.body.style.background}const f=document.getElementById("game-canvas"),m=document.getElementById("ui"),l=f.getContext("2d"),w=N(),d=document.createElement("div");d.className="launch-overlay";d.style.display="none";m.appendChild(d);const r={left:(t==null?void 0:t.input.keys.left)||"ArrowLeft",right:(t==null?void 0:t.input.keys.right)||"ArrowRight",boost:(t==null?void 0:t.input.keys.boost)||"ArrowUp"},M=U({container:document.body,input:w,mapping:{left:r.left,right:r.right,up:r.boost,actionA:r.boost,actionALabel:"Boost"},autoShow:!1,showPad:!1}),S=new Image;S.src=new URL("data:image/svg+xml,%3csvg%20width='64'%20height='128'%20viewBox='0%200%2064%20128'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='64'%20height='128'%20rx='10'%20fill='%23ff6b6b'/%3e%3crect%20x='10'%20y='10'%20width='44'%20height='108'%20rx='8'%20fill='%231b233a'/%3e%3crect%20x='14'%20y='16'%20width='36'%20height='30'%20rx='6'%20fill='%230bd0ff'%20opacity='0.8'/%3e%3crect%20x='14'%20y='82'%20width='36'%20height='30'%20rx='6'%20fill='%230bd0ff'%20opacity='0.8'/%3e%3crect%20x='6'%20y='32'%20width='8'%20height='20'%20rx='3'%20fill='%23ffd166'/%3e%3crect%20x='50'%20y='32'%20width='8'%20height='20'%20rx='3'%20fill='%23ffd166'/%3e%3crect%20x='6'%20y='76'%20width='8'%20height='20'%20rx='3'%20fill='%23ffd166'/%3e%3crect%20x='50'%20y='76'%20width='8'%20height='20'%20rx='3'%20fill='%23ffd166'/%3e%3c/svg%3e",import.meta.url).href;const W=new Image;W.src=new URL("data:image/svg+xml,%3csvg%20width='64'%20height='128'%20viewBox='0%200%2064%20128'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='64'%20height='128'%20rx='10'%20fill='%230bd0ff'/%3e%3crect%20x='10'%20y='10'%20width='44'%20height='108'%20rx='8'%20fill='%23111624'/%3e%3crect%20x='14'%20y='18'%20width='36'%20height='28'%20rx='6'%20fill='%237af0ff'%20opacity='0.6'/%3e%3crect%20x='14'%20y='82'%20width='36'%20height='28'%20rx='6'%20fill='%237af0ff'%20opacity='0.6'/%3e%3crect%20x='6'%20y='36'%20width='8'%20height='18'%20rx='3'%20fill='%2364f4ac'/%3e%3crect%20x='50'%20y='36'%20width='8'%20height='18'%20rx='3'%20fill='%2364f4ac'/%3e%3crect%20x='6'%20y='78'%20width='8'%20height='18'%20rx='3'%20fill='%2364f4ac'/%3e%3crect%20x='50'%20y='78'%20width='8'%20height='18'%20rx='3'%20fill='%2364f4ac'/%3e%3c/svg%3e",import.meta.url).href;const D=new Image;D.src=new URL("data:image/svg+xml,%3csvg%20width='64'%20height='64'%20viewBox='0%200%2064%2064'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='8'%20y='8'%20width='48'%20height='48'%20rx='12'%20fill='%2364f4ac'%20opacity='0.85'/%3e%3crect%20x='16'%20y='16'%20width='32'%20height='32'%20rx='8'%20fill='%230bd0ff'%20opacity='0.8'/%3e%3cpath%20d='M32%2014%20L36%2032%20L28%2032%20Z'%20fill='%23ffd166'/%3e%3crect%20x='30'%20y='32'%20width='4'%20height='18'%20rx='2'%20fill='%23ffd166'/%3e%3c/svg%3e",import.meta.url).href;const y=(t==null?void 0:t.difficultyParams.laneCount)??3,v=Array.from({length:y},(a,i)=>i),e={running:!1,width:0,height:0,roadWidth:0,laneWidth:0,player:{lane:1,y:.78,boost:0,cooldown:0},traffic:[],pickups:[],distance:0,speed:120,trafficTimer:0,pickupTimer:0};function L(){f.width=window.innerWidth*devicePixelRatio,f.height=window.innerHeight*devicePixelRatio,e.width=f.width/devicePixelRatio,e.height=f.height/devicePixelRatio,e.roadWidth=Math.min(520,e.width*.65),e.laneWidth=e.roadWidth/y}L();window.addEventListener("resize",L);const C=V({update:a=>Q(a),render:ee,fps:60});function Y(){e.player.lane=Math.floor(y/2),e.player.boost=0,e.player.cooldown=0,e.distance=0,e.traffic=[],e.pickups=[],e.speed=(t==null?void 0:t.difficultyParams.trafficSpeed)??200,e.trafficTimer=0,e.pickupTimer=0}function j(){if(!t){k("Config à compléter","Crée configs/games/drive.config.json",!1);return}M.show(),Y(),e.running=!0,d.style.display="none",u({type:"SESSION_START",gameId:h}),C.start()}function z(a){e.running=!1,C.stop(),M.hide(),u({type:"SESSION_FAIL",gameId:h,payload:{score:Math.floor(e.distance)}}),t&&_(h,t.saveSchemaVersion,s=>{const n=s.state.bestDistance||0;e.distance>n&&(s.state.bestDistance=Math.floor(e.distance),s.bestScore=Math.floor(e.distance))}),k("Crash !",(t==null?void 0:t.uiText.help)||"")}function X(){const a=v[T(0,v.length-1)],i=(t==null?void 0:t.difficultyParams.trafficSpeed)??220,s=(t==null?void 0:t.difficultyParams.trafficSpeedVariance)??40,n=i+T(-s,s);e.traffic.push({lane:a,y:-.3,speed:n})}function F(){const a=v[T(0,v.length-1)];e.pickups.push({lane:a,y:-.3})}function P(a){e.player.lane=O(e.player.lane+a,0,y-1)}function Z(a){if(e.player.cooldown=Math.max(0,e.player.cooldown-a*1e3),e.player.boost=Math.max(0,e.player.boost-a*1e3),e.player.boost>0)return;w.isDown(r.boost)&&e.player.cooldown<=0&&(e.player.boost=(t==null?void 0:t.difficultyParams.boostDurationMs)??2600,e.player.cooldown=(t==null?void 0:t.difficultyParams.boostCooldownMs)??4200,u({type:"BOOST_USED",gameId:h}))}function q(){w.isDown(r.left)&&P(-1),w.isDown(r.right)&&P(1)}function J(a){e.traffic=e.traffic.map(i=>({...i,y:i.y+i.speed/e.height*a})).filter(i=>i.y<1.4),e.pickups=e.pickups.map(i=>({...i,y:i.y+e.speed/e.height*a})).filter(i=>i.y<1.4)}function K(){const a=e.height*e.player.y,i=e.laneWidth*.35;for(const s of e.traffic){if(s.lane!==e.player.lane)continue;const n=s.y*e.height;if(Math.abs(n-a)<i*1.1)if(e.player.boost>0)u({type:"OBSTACLE_DODGED",gameId:h}),e.traffic=e.traffic.filter(c=>c!==s);else{z();return}}for(const s of e.pickups){if(s.lane!==e.player.lane)continue;const n=s.y*e.height;Math.abs(n-a)<i&&(u({type:"ITEM_COLLECTED",gameId:h}),e.player.boost=((t==null?void 0:t.difficultyParams.boostDurationMs)??2600)/2,e.pickups=e.pickups.filter(c=>c!==s))}}function Q(a){!e.running||!t||(e.distance+=e.speed/10*a,e.speed+=a*2,e.trafficTimer+=a*1e3,e.pickupTimer+=a*1e3,q(),Z(a),J(a),e.trafficTimer>=((t==null?void 0:t.difficultyParams.trafficSpawnMs)??950)&&(e.trafficTimer=0,X()),e.pickupTimer>=((t==null?void 0:t.difficultyParams.pickupSpawnMs)??1800)&&(e.pickupTimer=0,F()),K())}function ee(){l.save(),l.scale(devicePixelRatio,devicePixelRatio),l.clearRect(0,0,e.width,e.height);const a=e.width/2-e.roadWidth/2;l.fillStyle="rgba(255,255,255,0.04)",l.fillRect(a,0,e.roadWidth,e.height),l.strokeStyle="rgba(255,255,255,0.1)";for(let n=1;n<y;n++){const c=a+n*e.laneWidth;l.setLineDash([12,12]),l.beginPath(),l.moveTo(c,0),l.lineTo(c,e.height),l.stroke()}l.setLineDash([]);const i=a+e.player.lane*e.laneWidth+e.laneWidth/2-e.laneWidth*.25,s=e.height*e.player.y-e.laneWidth*.5;b(S,i,s,e.laneWidth*.5,e.laneWidth*.9),e.traffic.forEach(n=>{const c=a+n.lane*e.laneWidth+e.laneWidth/2-e.laneWidth*.25,p=n.y*e.height-e.laneWidth*.5;b(W,c,p,e.laneWidth*.5,e.laneWidth*.9)}),e.pickups.forEach(n=>{const c=a+n.lane*e.laneWidth+e.laneWidth/2-e.laneWidth*.25,p=n.y*e.height-e.laneWidth*.25;b(D,c,p,e.laneWidth*.5,e.laneWidth*.5)}),l.restore(),te()}function b(a,i,s,n,c){a.complete?l.drawImage(a,i,s,n,c):(l.fillStyle=o.colors.primary,l.fillRect(i,s,n,c))}function te(){m.innerHTML="",m.appendChild(d);const a=document.createElement("div");a.className="hud";const i=Math.max(0,Math.floor(e.player.boost/100)/10),s=Math.max(0,Math.floor(e.player.cooldown/100)/10);a.innerHTML=`
    <div class="pill">Distance ${Math.floor(e.distance)} m</div>
    <div class="pill">Boost ${i?i+"s":"prêt"} · CD ${s?s+"s":"0s"}</div>
    <div class="pill">Trafic ${e.traffic.length}</div>
  `,m.appendChild(a)}function k(a,i,s=!0){M.hide(),d.style.display="grid";const n=(t==null?void 0:t.uiText.shortDescription)||"",c=i||(t==null?void 0:t.uiText.help)||"",p=((t==null?void 0:t.uiText.controls)||[]).map($=>`<span class="launch-chip">${$}</span>`).join(""),E=(t==null?void 0:t.difficultyParams.laneCount)??3,I=Math.round(((t==null?void 0:t.difficultyParams.boostDurationMs)??3e3)/1e3),B=`
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
  `;d.innerHTML=`
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
          <p class="launch-text">${c}</p>
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
        <a class="launch-btn ghost" href="${H("/")}">Hub</a>
      </div>
    </div>
  `;const x=document.getElementById("launch-start");x==null||x.addEventListener("click",j)}k((t==null?void 0:t.uiText.title)||"Neon Drive",(t==null?void 0:t.uiText.help)||"Évite les voitures et ramasse les boosts.");
