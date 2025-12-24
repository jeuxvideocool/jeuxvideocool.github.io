import{l as G,e as B,f as F,w as O,m as p,n as v,p as D,q as H,s as _}from"./index-CK9lGSzJ.js";/* empty css                    */import{c as q,a as N}from"./input-C49DsMBr.js";import{c as U}from"./loop-24SuRqx9.js";const u="dodge",t=G(u),E=B(),f=E.find(a=>a.id===(t==null?void 0:t.themeId))||E[0];F();if(f){const a=document.documentElement.style;a.setProperty("--color-primary",f.colors.primary),a.setProperty("--color-secondary",f.colors.secondary),a.setProperty("--color-accent",f.colors.accent),a.setProperty("--color-text",f.colors.text),a.setProperty("--color-muted",f.colors.muted),document.body.style.background=f.gradient||document.body.style.background}const m=document.getElementById("game-canvas"),b=document.getElementById("ui"),r=m.getContext("2d"),w=q(),h=document.createElement("div");h.className="launch-overlay";h.style.display="none";b.appendChild(h);const c={up:(t==null?void 0:t.input.keys.up)||"ArrowUp",down:(t==null?void 0:t.input.keys.down)||"ArrowDown",left:(t==null?void 0:t.input.keys.left)||"ArrowLeft",right:(t==null?void 0:t.input.keys.right)||"ArrowRight",dash:(t==null?void 0:t.input.keys.dash)||"Space"},I=N({gameId:u,container:document.body,input:w,touch:{mapping:{up:c.up,down:c.down,left:c.left,right:c.right,actionA:c.dash,actionALabel:"Dash"},showPad:!1,gestureEnabled:!0},motion:{input:w,axis:{x:{negative:c.left,positive:c.right},y:{negative:c.up,positive:c.down}},actions:[{code:c.dash,trigger:"shake"}]},hints:{touch:"Tactile : glisse pour bouger, bouton Dash.",motion:"Gyro : incline pour bouger, secoue pour dash."}}),k=new Image;k.src=new URL("data:image/svg+xml,%3csvg%20width='96'%20height='72'%20viewBox='0%200%2096%2072'%20xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient%20id='ship'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20stop-color='%23ff7b5f'/%3e%3cstop%20offset='100%25'%20stop-color='%23ffd166'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath%20d='M10%2036%20L36%2012%20L80%2036%20L36%2060%20Z'%20fill='url(%23ship)'%20stroke='%230b1020'%20stroke-width='4'%20stroke-linejoin='round'/%3e%3crect%20x='32'%20y='24'%20width='12'%20height='24'%20rx='6'%20fill='%230bd0ff'%20opacity='0.9'/%3e%3crect%20x='48'%20y='28'%20width='10'%20height='16'%20rx='5'%20fill='%230b1020'%20opacity='0.5'/%3e%3cpath%20d='M10%2036%20L0%2030%20L0%2042%20Z'%20fill='%23ff7b5f'%20opacity='0.7'/%3e%3c/svg%3e",import.meta.url).href;const $=new Image;$.src=new URL("data:image/svg+xml,%3csvg%20width='72'%20height='72'%20viewBox='0%200%2072%2072'%20xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient%20id='rock'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20stop-color='%231c2a4d'/%3e%3cstop%20offset='100%25'%20stop-color='%230b1020'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath%20d='M14%2018%20L36%206%20L58%2018%20L64%2036%20L52%2062%20L28%2066%20L10%2046%20Z'%20fill='url(%23rock)'%20stroke='%237af0ff'%20stroke-width='3'%20stroke-linejoin='round'/%3e%3ccircle%20cx='28'%20cy='30'%20r='4'%20fill='%237af0ff'%20opacity='0.6'/%3e%3ccircle%20cx='46'%20cy='44'%20r='5'%20fill='%23ff7b5f'%20opacity='0.7'/%3e%3c/svg%3e",import.meta.url).href;const P=new Image;P.src=new URL("data:image/svg+xml,%3csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient%20id='core'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20stop-color='%237af0ff'/%3e%3cstop%20offset='100%25'%20stop-color='%2364f4ac'/%3e%3c/linearGradient%3e%3c/defs%3e%3ccircle%20cx='30'%20cy='30'%20r='24'%20fill='url(%23core)'%20opacity='0.9'/%3e%3ccircle%20cx='30'%20cy='30'%20r='14'%20fill='%230b1020'%20opacity='0.4'/%3e%3cpath%20d='M30%2010%20L34%2026%20H46%20L36%2034%20L40%2050%20L30%2040%20L20%2050%20L24%2034%20L14%2026%20H26%20Z'%20fill='%23ffd166'%20opacity='0.9'/%3e%3c/svg%3e",import.meta.url).href;const e={running:!1,width:0,height:0,player:{x:0,y:0,r:14,dash:0,dashCooldown:0},invulnerable:0,dashIFrames:0,time:0,mode:"timed",runDuration:(t==null?void 0:t.difficultyParams.winTimeSeconds)??60,spawnTimer:0,powerupTimer:0,obstacles:[],powerups:[],stars:[]};function M(){const a=m.getBoundingClientRect(),i=devicePixelRatio||1;m.width=a.width*i,m.height=a.height*i,m.style.width="100%",m.style.height="100%",e.width=a.width,e.height=a.height,R()}M();window.addEventListener("resize",M);const A=U({update:a=>W(a),render:Z,fps:60});function j(){if(!t){T("Config introuvable","Ajoute configs/games/dodge.config.json",!1);return}I.show();const a=document.getElementById("run-duration");if(a&&e.mode==="timed"){const i=Math.max(10,Math.min(999,Number(a.value)||e.runDuration));e.runDuration=i}e.running=!0,e.player.x=e.width*.15,e.player.y=e.height/2,e.player.dash=0,e.player.dashCooldown=0,e.time=0,e.invulnerable=0,e.spawnTimer=0,e.powerupTimer=0,e.obstacles=[],e.powerups=[],R(),h.style.display="none",v({type:"SESSION_START",gameId:u}),A.start()}function C(a){e.running=!1,A.stop(),I.hide();const i=Math.floor(e.time);v({type:a?"SESSION_WIN":"SESSION_FAIL",gameId:u,payload:{score:i}}),_(u,(t==null?void 0:t.saveSchemaVersion)??1,s=>{const l=s.state.bestTime||0;i>l&&(s.state.bestTime=i,s.bestScore=i)}),T(`${a?"Victoire !":"Touché !"} (${i}s)`,(t==null?void 0:t.uiText.help)||"Rejoue pour pousser ton record.")}function T(a,i,n=!0){I.hide(),h.style.display="grid";const d=(t==null?void 0:t.uiText.shortDescription)||"",s=i||(t==null?void 0:t.uiText.help)||"",l=((t==null?void 0:t.uiText.controls)||[]).map(y=>`<span class="launch-chip">${y}</span>`).join(""),x=`
    <div class="launch-rows">
      <div class="launch-row">
        <span class="launch-row-label">Mode</span>
        <div class="launch-row-value launch-options">
          <label class="launch-option mode-option ${e.mode==="timed"?"is-active":""}">
            <input type="radio" name="mode" value="timed" ${e.mode==="timed"?"checked":""}/>
            <span class="launch-option-title">Chrono</span>
            <span class="launch-option-meta">${e.runDuration}s</span>
          </label>
          <label class="launch-option mode-option ${e.mode==="endless"?"is-active":""}">
            <input type="radio" name="mode" value="endless" ${e.mode==="endless"?"checked":""}/>
            <span class="launch-option-title">Infini</span>
            <span class="launch-option-meta">Sans limite</span>
          </label>
        </div>
      </div>
      <div class="launch-row timed-only" style="display:${e.mode==="timed"?"grid":"none"};">
        <span class="launch-row-label">Durée</span>
        <div class="launch-row-value">
          <label class="launch-input">
            <input id="run-duration" type="number" min="10" max="999" value="${e.runDuration}" />
            <span>sec</span>
          </label>
        </div>
      </div>
    </div>
  `;h.innerHTML=`
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${(t==null?void 0:t.uiText.title)||"Dodge Rush"}</span>
        </div>
        <h2 class="launch-title">${a}</h2>
        ${d?`<p class="launch-subtitle">${d}</p>`:""}
      </div>
      <div class="launch-grid">
        <section class="launch-section">
          <h3 class="launch-section-title">Briefing</h3>
          <p class="launch-text">${s}</p>
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Paramètres</h3>
          ${x}
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Contrôles</h3>
          <div class="launch-chips">
            ${l||'<span class="launch-chip muted">Contrôles à définir</span>'}
          </div>
        </section>
      </div>
      <div class="launch-actions">
        ${n?'<button class="launch-btn primary" id="launch-start">Lancer</button>':""}
        <a class="launch-btn ghost" href="${O("/")}">Hub</a>
      </div>
    </div>
  `,I.attachOverlay(h);const o=document.getElementById("launch-start");o==null||o.addEventListener("click",j),K()}T((t==null?void 0:t.uiText.title)||"Dodge Rush",(t==null?void 0:t.uiText.help)||"");function W(a){if(!e.running||!t)return;e.time+=a,e.spawnTimer+=a*1e3,e.powerupTimer+=a*1e3;const i=t.difficultyParams.obstacleSpeed,n=(w.isDown(c.right)?1:0)+(w.isDown(c.left)?-1:0),d=(w.isDown(c.down)?1:0)+(w.isDown(c.up)?-1:0),s=c.dash,l=e.player.dashCooldown<=0;w.isDown(s)&&l&&(e.player.dash=.45,e.player.dashCooldown=2.5,e.dashIFrames=.35,v({type:"DASH_USED",gameId:u}));const x=e.player.dash>0?2.4:1;e.player.x+=n*t.difficultyParams.playerSpeed*x*(a*60),e.player.y+=d*t.difficultyParams.playerSpeed*x*(a*60),e.player.x=D(e.player.x,e.player.r,e.width-e.player.r),e.player.y=D(e.player.y,e.player.r,e.height-e.player.r),e.player.dash=Math.max(0,e.player.dash-a),e.player.dashCooldown=Math.max(0,e.player.dashCooldown-a),e.invulnerable=Math.max(0,e.invulnerable-a),e.dashIFrames=Math.max(0,e.dashIFrames-a),e.spawnTimer>=t.difficultyParams.spawnIntervalMs&&(e.spawnTimer=0,e.obstacles.push({x:e.width+p(10,60),y:p(40,e.height-40),size:p(12,22),speed:i*p(.9,1.2)})),e.powerupTimer>=1600&&(e.powerupTimer=0,H(t.difficultyParams.powerupChance)&&e.powerups.push({x:p(e.width*.4,e.width*.95),y:p(50,e.height-50),size:10,duration:2.5})),e.obstacles=e.obstacles.filter(o=>{if(o.x-=(o.speed+e.time*.02)*(a*60),o.x+o.size<0)return v({type:"OBSTACLE_DODGED",gameId:u}),!1;const y=o.x-e.player.x,g=o.y-e.player.y,S=Math.sqrt(y*y+g*g),z=e.invulnerable>0||e.player.dash>0||e.dashIFrames>0;return S<o.size+e.player.r?z?(v({type:"OBSTACLE_DODGED",gameId:u}),!1):(C(!1),!1):!0}),e.powerups=e.powerups.filter(o=>{o.x-=i*.5*(a*60);const y=o.x-e.player.x,g=o.y-e.player.y;return Math.sqrt(y*y+g*g)<o.size+e.player.r?(v({type:"POWERUP_COLLECTED",gameId:u}),e.invulnerable=Math.max(e.invulnerable,o.duration),e.dashIFrames=Math.max(e.dashIFrames,.35),e.player.dashCooldown=Math.max(0,e.player.dashCooldown-1),!1):o.x+o.size>0}),e.mode==="timed"&&e.time>=e.runDuration&&C(!0)}function Z(){const a=Math.round(m.clientWidth),i=Math.round(m.clientHeight);(a!==Math.round(e.width)||i!==Math.round(e.height))&&M(),r.save(),r.scale(devicePixelRatio,devicePixelRatio),r.clearRect(0,0,e.width,e.height),r.fillStyle="rgba(255,255,255,0.08)",e.stars.forEach(s=>{r.globalAlpha=s.alpha,r.fillRect(s.x,s.y,s.size,s.size),r.globalAlpha=1,s.x-=s.speed,s.x<-s.size&&(s.x=e.width+p(0,40),s.y=p(0,e.height))});const n=e.player.r*3,d=e.player.r*2.4;if(L(k,e.player.x-n/2,e.player.y-d/2,n,d),e.invulnerable>0||e.dashIFrames>0){const s=e.invulnerable>0?"rgba(122, 240, 255, 0.7)":"rgba(255, 255, 255, 0.5)";r.strokeStyle=s,r.lineWidth=3,r.beginPath(),r.arc(e.player.x,e.player.y,e.player.r*1.4,0,Math.PI*2),r.stroke()}e.obstacles.forEach(s=>{const l=s.size*2.2;L($,s.x-l/2,s.y-l/2,l,l)}),e.powerups.forEach(s=>{const l=s.size*2.2;L(P,s.x-l/2,s.y-l/2,l,l)}),r.restore(),V()}function V(){b.innerHTML="",b.appendChild(h);const a=document.createElement("div");a.className="hud",a.innerHTML=`
    <div class="pill">Temps ${e.time.toFixed(1)}s</div>
    <div class="pill">Dash ${Math.max(0,e.player.dashCooldown).toFixed(1)}s</div>
    <div class="pill">Invuln ${e.invulnerable.toFixed(1)}s</div>
    <div class="pill">${e.mode==="endless"?"Mode infini":`Run ${e.runDuration}s`}</div>
  `,b.appendChild(a)}function L(a,i,n,d,s){a.complete?r.drawImage(a,i,n,d,s):(r.fillStyle="#fff",r.fillRect(i,n,d,s))}function R(){const a=Math.floor(e.width*e.height/12e3);e.stars=Array.from({length:a},()=>({x:p(0,e.width),y:p(0,e.height),size:p(1,3),speed:p(.6,1.6),alpha:p(.3,.8)}))}function K(){const a=h.querySelectorAll('input[name="mode"]'),i=()=>{const n=h.querySelector(".timed-only");n&&(n.style.display=e.mode==="timed"?"grid":"none"),h.querySelectorAll(".mode-option").forEach(d=>{const s=d.querySelector("input");d.classList.toggle("is-active",!!(s!=null&&s.checked))})};a.forEach(n=>n.addEventListener("change",()=>{e.mode=n.value||"timed",i()})),i()}
