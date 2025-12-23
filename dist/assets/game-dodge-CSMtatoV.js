import{m as G,e as F,f as B,w as O,n as d,l as w,p as D,q as H,s as _}from"./index-B0OSZgpc.js";/* empty css                    */import{c as q,a as N}from"./input-DH7tWOuN.js";import{c as U}from"./loop-24SuRqx9.js";const h="dodge",t=G(h),M=F(),m=M.find(a=>a.id===(t==null?void 0:t.themeId))||M[0];B();if(m){const a=document.documentElement.style;a.setProperty("--color-primary",m.colors.primary),a.setProperty("--color-secondary",m.colors.secondary),a.setProperty("--color-accent",m.colors.accent),a.setProperty("--color-text",m.colors.text),a.setProperty("--color-muted",m.colors.muted),document.body.style.background=m.gradient||document.body.style.background}const y=document.getElementById("game-canvas"),b=document.getElementById("ui"),r=y.getContext("2d"),f=q(),p=document.createElement("div");p.className="launch-overlay";p.style.display="none";b.appendChild(p);const l={up:(t==null?void 0:t.input.keys.up)||"ArrowUp",down:(t==null?void 0:t.input.keys.down)||"ArrowDown",left:(t==null?void 0:t.input.keys.left)||"ArrowLeft",right:(t==null?void 0:t.input.keys.right)||"ArrowRight",dash:(t==null?void 0:t.input.keys.dash)||"Space"},I=N({gameId:h,container:document.body,input:f,touch:{mapping:{up:l.up,down:l.down,left:l.left,right:l.right,actionA:l.dash,actionALabel:"Dash"},showPad:!0,gestureEnabled:!1},motion:{input:f,axis:{x:{negative:l.left,positive:l.right},y:{negative:l.up,positive:l.down}},actions:[{code:l.dash,trigger:"shake"}]},hints:{touch:"Flèches pour bouger, bouton Dash.",motion:"Incliner pour bouger, secouer pour dash."}}),P=new Image;P.src=new URL("data:image/svg+xml,%3csvg%20width='96'%20height='72'%20viewBox='0%200%2096%2072'%20xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient%20id='ship'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20stop-color='%23ff7b5f'/%3e%3cstop%20offset='100%25'%20stop-color='%23ffd166'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath%20d='M10%2036%20L36%2012%20L80%2036%20L36%2060%20Z'%20fill='url(%23ship)'%20stroke='%230b1020'%20stroke-width='4'%20stroke-linejoin='round'/%3e%3crect%20x='32'%20y='24'%20width='12'%20height='24'%20rx='6'%20fill='%230bd0ff'%20opacity='0.9'/%3e%3crect%20x='48'%20y='28'%20width='10'%20height='16'%20rx='5'%20fill='%230b1020'%20opacity='0.5'/%3e%3cpath%20d='M10%2036%20L0%2030%20L0%2042%20Z'%20fill='%23ff7b5f'%20opacity='0.7'/%3e%3c/svg%3e",import.meta.url).href;const C=new Image;C.src=new URL("data:image/svg+xml,%3csvg%20width='72'%20height='72'%20viewBox='0%200%2072%2072'%20xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient%20id='rock'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20stop-color='%231c2a4d'/%3e%3cstop%20offset='100%25'%20stop-color='%230b1020'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath%20d='M14%2018%20L36%206%20L58%2018%20L64%2036%20L52%2062%20L28%2066%20L10%2046%20Z'%20fill='url(%23rock)'%20stroke='%237af0ff'%20stroke-width='3'%20stroke-linejoin='round'/%3e%3ccircle%20cx='28'%20cy='30'%20r='4'%20fill='%237af0ff'%20opacity='0.6'/%3e%3ccircle%20cx='46'%20cy='44'%20r='5'%20fill='%23ff7b5f'%20opacity='0.7'/%3e%3c/svg%3e",import.meta.url).href;const k=new Image;k.src=new URL("data:image/svg+xml,%3csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient%20id='core'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20stop-color='%237af0ff'/%3e%3cstop%20offset='100%25'%20stop-color='%2364f4ac'/%3e%3c/linearGradient%3e%3c/defs%3e%3ccircle%20cx='30'%20cy='30'%20r='24'%20fill='url(%23core)'%20opacity='0.9'/%3e%3ccircle%20cx='30'%20cy='30'%20r='14'%20fill='%230b1020'%20opacity='0.4'/%3e%3cpath%20d='M30%2010%20L34%2026%20H46%20L36%2034%20L40%2050%20L30%2040%20L20%2050%20L24%2034%20L14%2026%20H26%20Z'%20fill='%23ffd166'%20opacity='0.9'/%3e%3c/svg%3e",import.meta.url).href;const e={running:!1,width:0,height:0,player:{x:0,y:0,r:14,dash:0,dashCooldown:0},invulnerable:0,dashIFrames:0,time:0,mode:"timed",runDuration:(t==null?void 0:t.difficultyParams.winTimeSeconds)??60,spawnTimer:0,powerupTimer:0,obstacles:[],powerups:[],stars:[]};function $(){y.width=window.innerWidth*devicePixelRatio,y.height=window.innerHeight*devicePixelRatio,y.style.width="100%",y.style.height="100%",e.width=y.width/devicePixelRatio,e.height=y.height/devicePixelRatio,A()}$();window.addEventListener("resize",$);const R=U({update:a=>W(a),render:Z,fps:60});function j(){if(!t){S("Config introuvable","Ajoute configs/games/dodge.config.json",!1);return}I.show();const a=document.getElementById("run-duration");if(a&&e.mode==="timed"){const i=Math.max(10,Math.min(999,Number(a.value)||e.runDuration));e.runDuration=i}e.running=!0,e.player.x=e.width*.15,e.player.y=e.height/2,e.player.dash=0,e.player.dashCooldown=0,e.time=0,e.invulnerable=0,e.spawnTimer=0,e.powerupTimer=0,e.obstacles=[],e.powerups=[],A(),p.style.display="none",w({type:"SESSION_START",gameId:h}),R.start()}function E(a){e.running=!1,R.stop(),I.hide();const i=Math.floor(e.time);w({type:a?"SESSION_WIN":"SESSION_FAIL",gameId:h,payload:{score:i}}),_(h,(t==null?void 0:t.saveSchemaVersion)??1,c=>{const v=c.state.bestTime||0;i>v&&(c.state.bestTime=i,c.bestScore=i)}),S(`${a?"Victoire !":"Touché !"} (${i}s)`,(t==null?void 0:t.uiText.help)||"Rejoue pour pousser ton record.")}function S(a,i,s=!0){I.hide(),p.style.display="grid";const o=(t==null?void 0:t.uiText.shortDescription)||"",c=i||(t==null?void 0:t.uiText.help)||"",v=((t==null?void 0:t.uiText.controls)||[]).map(u=>`<span class="launch-chip">${u}</span>`).join(""),g=`
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
  `;p.innerHTML=`
    <div class="launch-card">
      <div class="launch-head">
        <div class="launch-brand">
          <span class="launch-badge">Arcade Galaxy</span>
          <span class="launch-badge ghost">${(t==null?void 0:t.uiText.title)||"Dodge Rush"}</span>
        </div>
        <h2 class="launch-title">${a}</h2>
        ${o?`<p class="launch-subtitle">${o}</p>`:""}
      </div>
      <div class="launch-grid">
        <section class="launch-section">
          <h3 class="launch-section-title">Briefing</h3>
          <p class="launch-text">${c}</p>
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Paramètres</h3>
          ${g}
        </section>
        <section class="launch-section">
          <h3 class="launch-section-title">Contrôles</h3>
          <div class="launch-chips">
            ${v||'<span class="launch-chip muted">Contrôles à définir</span>'}
          </div>
        </section>
      </div>
      <div class="launch-actions">
        ${s?'<button class="launch-btn primary" id="launch-start">Lancer</button>':""}
        <a class="launch-btn ghost" href="${O("/")}">Hub</a>
      </div>
    </div>
  `,I.attachOverlay(p);const n=document.getElementById("launch-start");n==null||n.addEventListener("click",j),K()}S((t==null?void 0:t.uiText.title)||"Dodge Rush",(t==null?void 0:t.uiText.help)||"");function W(a){if(!e.running||!t)return;e.time+=a,e.spawnTimer+=a*1e3,e.powerupTimer+=a*1e3;const i=t.difficultyParams.obstacleSpeed,s=(f.isDown(l.right)?1:0)+(f.isDown(l.left)?-1:0),o=(f.isDown(l.down)?1:0)+(f.isDown(l.up)?-1:0),c=l.dash,v=e.player.dashCooldown<=0;f.isDown(c)&&v&&(e.player.dash=.45,e.player.dashCooldown=2.5,e.dashIFrames=.35,w({type:"DASH_USED",gameId:h}));const g=e.player.dash>0?2.4:1;e.player.x+=s*t.difficultyParams.playerSpeed*g*(a*60),e.player.y+=o*t.difficultyParams.playerSpeed*g*(a*60),e.player.x=D(e.player.x,e.player.r,e.width-e.player.r),e.player.y=D(e.player.y,e.player.r,e.height-e.player.r),e.player.dash=Math.max(0,e.player.dash-a),e.player.dashCooldown=Math.max(0,e.player.dashCooldown-a),e.invulnerable=Math.max(0,e.invulnerable-a),e.dashIFrames=Math.max(0,e.dashIFrames-a),e.spawnTimer>=t.difficultyParams.spawnIntervalMs&&(e.spawnTimer=0,e.obstacles.push({x:e.width+d(10,60),y:d(40,e.height-40),size:d(12,22),speed:i*d(.9,1.2)})),e.powerupTimer>=1600&&(e.powerupTimer=0,H(t.difficultyParams.powerupChance)&&e.powerups.push({x:d(e.width*.4,e.width*.95),y:d(50,e.height-50),size:10,duration:2.5})),e.obstacles=e.obstacles.filter(n=>{if(n.x-=(n.speed+e.time*.02)*(a*60),n.x+n.size<0)return w({type:"OBSTACLE_DODGED",gameId:h}),!1;const u=n.x-e.player.x,x=n.y-e.player.y,T=Math.sqrt(u*u+x*x),z=e.invulnerable>0||e.player.dash>0||e.dashIFrames>0;return T<n.size+e.player.r?z?(w({type:"OBSTACLE_DODGED",gameId:h}),!1):(E(!1),!1):!0}),e.powerups=e.powerups.filter(n=>{n.x-=i*.5*(a*60);const u=n.x-e.player.x,x=n.y-e.player.y;return Math.sqrt(u*u+x*x)<n.size+e.player.r?(w({type:"POWERUP_COLLECTED",gameId:h}),e.invulnerable=Math.max(e.invulnerable,n.duration),e.dashIFrames=Math.max(e.dashIFrames,.35),e.player.dashCooldown=Math.max(0,e.player.dashCooldown-1),!1):n.x+n.size>0}),e.mode==="timed"&&e.time>=e.runDuration&&E(!0)}function Z(){r.save(),r.scale(devicePixelRatio,devicePixelRatio),r.clearRect(0,0,e.width,e.height),r.fillStyle="rgba(255,255,255,0.08)",e.stars.forEach(s=>{r.globalAlpha=s.alpha,r.fillRect(s.x,s.y,s.size,s.size),r.globalAlpha=1,s.x-=s.speed,s.x<-s.size&&(s.x=e.width+d(0,40),s.y=d(0,e.height))});const a=e.player.r*3,i=e.player.r*2.4;if(L(P,e.player.x-a/2,e.player.y-i/2,a,i),e.invulnerable>0||e.dashIFrames>0){const s=e.invulnerable>0?"rgba(122, 240, 255, 0.7)":"rgba(255, 255, 255, 0.5)";r.strokeStyle=s,r.lineWidth=3,r.beginPath(),r.arc(e.player.x,e.player.y,e.player.r*1.4,0,Math.PI*2),r.stroke()}e.obstacles.forEach(s=>{const o=s.size*2.2;L(C,s.x-o/2,s.y-o/2,o,o)}),e.powerups.forEach(s=>{const o=s.size*2.2;L(k,s.x-o/2,s.y-o/2,o,o)}),r.restore(),V()}function V(){b.innerHTML="",b.appendChild(p);const a=document.createElement("div");a.className="hud",a.innerHTML=`
    <div class="pill">Temps ${e.time.toFixed(1)}s</div>
    <div class="pill">Dash ${Math.max(0,e.player.dashCooldown).toFixed(1)}s</div>
    <div class="pill">Invuln ${e.invulnerable.toFixed(1)}s</div>
    <div class="pill">${e.mode==="endless"?"Mode infini":`Run ${e.runDuration}s`}</div>
  `,b.appendChild(a)}function L(a,i,s,o,c){a.complete?r.drawImage(a,i,s,o,c):(r.fillStyle="#fff",r.fillRect(i,s,o,c))}function A(){const a=Math.floor(e.width*e.height/12e3);e.stars=Array.from({length:a},()=>({x:d(0,e.width),y:d(0,e.height),size:d(1,3),speed:d(.6,1.6),alpha:d(.3,.8)}))}function K(){const a=p.querySelectorAll('input[name="mode"]'),i=()=>{const s=p.querySelector(".timed-only");s&&(s.style.display=e.mode==="timed"?"grid":"none"),p.querySelectorAll(".mode-option").forEach(o=>{const c=o.querySelector("input");o.classList.toggle("is-active",!!(c!=null&&c.checked))})};a.forEach(s=>s.addEventListener("change",()=>{e.mode=s.value||"timed",i()})),i()}
