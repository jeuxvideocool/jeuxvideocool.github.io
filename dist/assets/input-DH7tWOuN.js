import{y as W}from"./index-B0OSZgpc.js";function Z(){const o=new Set,l=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"]),t=e=>{l.has(e.code)&&e.preventDefault(),o.add(e.code)},s=e=>{l.has(e.code)&&e.preventDefault(),o.delete(e.code)};return window.addEventListener("keydown",t),window.addEventListener("keyup",s),{isDown:e=>o.has(e),dispose(){window.removeEventListener("keydown",t),window.removeEventListener("keyup",s),o.clear()}}}function te(){const o=Z(),l=new Set,t=(e,a)=>{e&&(a?l.add(e):l.delete(e))};return{isDown:e=>o.isDown(e)||l.has(e),bindButton:(e,a)=>{const p=g=>{g.preventDefault(),t(a,!0)},m=g=>{g.preventDefault(),t(a,!1)};return e.addEventListener("pointerdown",p,{passive:!1}),e.addEventListener("pointerup",m,{passive:!1}),e.addEventListener("pointercancel",m,{passive:!1}),e.addEventListener("pointerleave",m,{passive:!1}),()=>{e.removeEventListener("pointerdown",p),e.removeEventListener("pointerup",m),e.removeEventListener("pointercancel",m),e.removeEventListener("pointerleave",m),t(a,!1)}},press:e=>t(e,!0),release:e=>t(e,!1),dispose:()=>{o.dispose(),l.clear()}}}let K=!1;function J(){if(K)return;K=!0;const o=document.createElement("style");o.textContent=`
    .mobile-controls {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 30;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr auto;
      grid-template-areas:
        "fs fs"
        "pad actions";
      align-content: end;
      align-items: end;
      justify-items: stretch;
      gap: 12px;
      padding: 16px;
      padding-bottom: calc(18px + env(safe-area-inset-bottom, 0px));
      transition: opacity 0.25s ease, transform 0.25s ease;
      --mc-primary: var(--color-primary, #f4c56a);
      --mc-accent: var(--color-accent, #7dd3fc);
      --mc-ink: rgba(248, 250, 255, 0.98);
      --mc-surface: rgba(10, 14, 22, 0.45);
      --mc-border: rgba(255, 255, 255, 0.14);
    }
    .mobile-controls.hidden-desktop {
      display: none;
    }
    @media (max-width: 1024px) {
      .mobile-controls.hidden-desktop {
        display: grid;
      }
    }
    .mobile-controls.mc-hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
    }
    .mobile-pad,
    .mobile-actions {
      pointer-events: all;
      align-self: end;
      margin-bottom: env(safe-area-inset-bottom, 0px);
    }
    .mobile-pad {
      grid-area: pad;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 6px;
      width: min(148px, 38vw);
      max-width: 34vw;
      justify-self: start;
      background: var(--mc-surface);
      border-radius: 18px;
      padding: 12px;
      backdrop-filter: blur(14px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35),
        inset 0 0 0 1px rgba(255, 255, 255, 0.04);
    }
    .mobile-actions {
      grid-area: actions;
      display: flex;
      gap: 12px;
      justify-self: end;
    }
    .mobile-btn {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      border: 1px solid var(--mc-border);
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.06)),
        linear-gradient(160deg, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.12));
      color: var(--mc-ink);
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28);
      cursor: pointer;
      touch-action: none;
      letter-spacing: 0.02em;
      transition: transform 0.12s ease, box-shadow 0.2s ease;
    }
    .mobile-btn.action {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, var(--mc-primary), var(--mc-accent));
      color: #0b0f17;
      font-weight: 800;
      box-shadow: 0 16px 28px rgba(0, 0, 0, 0.3);
    }
    .mobile-btn:active {
      transform: scale(0.96);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    .mobile-btn:disabled {
      opacity: 0.35;
      cursor: default;
      box-shadow: none;
      filter: saturate(0.6);
    }
    @media (max-height: 720px) {
      .mobile-btn {
        width: 40px;
        height: 40px;
        font-size: 13px;
      }
      .mobile-btn.action {
        width: 48px;
        height: 48px;
      }
      .mobile-pad {
        width: min(132px, 36vw);
        padding: 8px;
      }
    }
    .mobile-fs-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid var(--mc-border);
      background: rgba(255, 255, 255, 0.08);
      color: var(--mc-ink);
      font-weight: 800;
      font-size: 16px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.26);
      cursor: pointer;
      touch-action: manipulation;
      backdrop-filter: blur(8px);
    }
    .mobile-fs-btn:active {
      transform: scale(0.95);
    }
    .mobile-fs-wrap {
      grid-area: fs;
      pointer-events: all;
      align-self: start;
      justify-self: end;
    }
    .mobile-gesture {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      touch-action: none;
      z-index: 29;
    }
    @media (min-width: 1025px) {
      .mobile-gesture {
        display: none;
      }
    }
  `,document.head.appendChild(o)}function O(o,l,t,s="pad"){const e=document.createElement("button");return e.type="button",e.className=`mobile-btn${s==="action"?" action":""}`,e.textContent=o,e.setAttribute("aria-label",o),l?t.bindButton(e,l):e.disabled=!0,e}function Q(o,l,t){const s={x:0,y:0};let e=!1,a={x:0,y:0};const p=10,m=()=>{["up","down","left","right"].forEach(f=>{const y=l[f];y&&t.release(y)})},g=(f,y)=>{m();const S=Math.abs(f),b=Math.abs(y);S<p&&b<p||(S>b?(f>0&&l.right&&t.press(l.right),f<0&&l.left&&t.press(l.left)):(y>0&&l.down&&t.press(l.down),y<0&&l.up&&t.press(l.up)))},d=f=>{f.preventDefault(),e=!0,a={x:f.clientX,y:f.clientY}},c=f=>{e&&(f.preventDefault(),e&&(s.x=f.clientX-a.x,s.y=f.clientY-a.y,g(s.x,s.y)))},M=()=>{e=!1,s.x=0,s.y=0,m()};return o.addEventListener("pointerdown",d,{passive:!1}),o.addEventListener("pointermove",c,{passive:!1}),o.addEventListener("pointerup",M,{passive:!1}),o.addEventListener("pointercancel",M,{passive:!1}),o.addEventListener("pointerleave",M,{passive:!1}),()=>{o.removeEventListener("pointerdown",d),o.removeEventListener("pointermove",c),o.removeEventListener("pointerup",M),o.removeEventListener("pointercancel",M),o.removeEventListener("pointerleave",M),m()}}function _(o){const{container:l,input:t,mapping:s,showOnDesktop:e=!1,autoShow:a=!1,showFullscreenToggle:p=!0,showPad:m=!1,gestureEnabled:g=!0}=o;if(!l)return{dispose:()=>{}};J();const d=document.createElement("div");d.className=`mobile-controls ${e?"":"hidden-desktop"}`.trim(),a||d.classList.add("mc-hidden");const c=document.createElement("div");c.className="mobile-pad";const M=O("↑",s.up,t),f=O("↓",s.down,t),y=O("←",s.left,t),S=O("→",s.right,t);c.appendChild(document.createElement("div")),c.appendChild(M),c.appendChild(document.createElement("div")),c.appendChild(y),c.appendChild(document.createElement("div")),c.appendChild(S),c.appendChild(document.createElement("div")),c.appendChild(f),c.appendChild(document.createElement("div"));const b=document.createElement("div");b.className="mobile-actions";const x=s.actionA?O(s.actionALabel||"A",s.actionA,t,"action"):null,h=s.actionB?O(s.actionBLabel||"B",s.actionB,t,"action"):null;x&&b.appendChild(x),h&&b.appendChild(h);const L=!!(s.up||s.down||s.left||s.right),v=L&&m,k=!!(x||h);v&&d.appendChild(c),k&&d.appendChild(b);const E=p?document.createElement("button"):null;if(E){E.type="button",E.className="mobile-fs-btn",E.textContent="⤢",E.title="Plein écran",E.addEventListener("click",()=>{var F,N;document.fullscreenElement?document.exitFullscreen().catch(()=>{}):(N=(F=document.documentElement)==null?void 0:F.requestFullscreen)==null||N.call(F).catch(()=>{})});const A=document.createElement("div");A.className="mobile-fs-wrap",A.appendChild(E),d.appendChild(A)}let D,w;L&&g&&(w=document.createElement("div"),w.className="mobile-gesture",w.style.background="transparent",l.appendChild(w),D=Q(w,s,t)),(v||k||E)&&l.appendChild(d);const P=A=>{d.classList.toggle("mc-hidden",!A),w&&(w.style.display=A?"block":"none",w.style.pointerEvents=A?"all":"none")};return P(a),{show(){P(!0)},hide(){P(!1)},dispose(){d.remove(),w!=null&&w.parentElement&&w.remove(),D==null||D()}}}function z(o){var R,U,$,H;const{input:l,axis:t,actions:s=[],deadzone:e=10,maxTilt:a=35,smoothing:p=.16,invertX:m=!1,invertY:g=!1}=o,d=!!((R=t==null?void 0:t.x)!=null&&R.negative||(U=t==null?void 0:t.x)!=null&&U.positive||($=t==null?void 0:t.y)!=null&&$.negative||(H=t==null?void 0:t.y)!=null&&H.positive)||s.some(n=>n.trigger!=="shake"),c=s.some(n=>n.trigger==="shake"),M=typeof window<"u",f=M&&"DeviceOrientationEvent"in window,y=M&&"DeviceMotionEvent"in window,S=(!d||f)&&(!c||y),b=new Set,x=s.map(()=>({active:!1,lastFire:0}));let h=0,L=0;const v=n=>{n&&(l.press(n),b.add(n))},k=n=>{n&&(l.release(n),b.delete(n))},E=()=>{b.forEach(n=>l.release(n)),b.clear(),x.forEach(n=>{n.active=!1})},D=(n,r,i)=>Math.min(Math.max(n,r),i),w=n=>{var u,C;const r=n.gamma??0,i=n.beta??0;switch((((C=(u=window.screen)==null?void 0:u.orientation)==null?void 0:C.angle)??window.orientation??0)%360){case 90:return{x:i,y:-r};case-90:case 270:return{x:-i,y:r};case 180:case-180:return{x:-r,y:-i};default:return{x:r,y:i}}},P=(n,r,i)=>{if(!r&&!i)return;if(Math.abs(n)<e){k(r),k(i);return}n>0?(v(i),k(r)):(v(r),k(i))},A=(n,r,i)=>{switch(n){case"tiltLeft":return-r;case"tiltRight":return r;case"tiltForward":return i;case"tiltBack":return-i;default:return 0}},X=n=>{v(n),window.setTimeout(()=>k(n),90)},F=(n,r)=>{s.forEach((i,q)=>{if(i.trigger==="shake")return;const u=x[q],C=A(i.trigger,n,r),B=i.threshold??18,I=i.cooldownMs??240,Y=B*.6,j=performance.now();if(i.mode==="hold"){C>=B&&!u.active?(u.active=!0,v(i.code)):C<Y&&u.active&&(u.active=!1,k(i.code));return}C>=B&&!u.active&&j-u.lastFire>I?(u.active=!0,u.lastFire=j,X(i.code)):C<Y&&(u.active=!1)})},N=n=>{var u,C,B,I;if(n.gamma==null&&n.beta==null)return;const r=w(n),i=D(r.x,-a,a)*(m?-1:1),q=D(r.y,-a,a)*(g?-1:1);h+=(i-h)*p,L+=(q-L)*p,P(h,(u=t==null?void 0:t.x)==null?void 0:u.negative,(C=t==null?void 0:t.x)==null?void 0:C.positive),P(L,(B=t==null?void 0:t.y)==null?void 0:B.negative,(I=t==null?void 0:t.y)==null?void 0:I.positive),F(h,L)},G=n=>{const r=n.acceleration??n.accelerationIncludingGravity;if(!r)return;const i=Math.sqrt((r.x||0)*(r.x||0)+(r.y||0)*(r.y||0)+(r.z||0)*(r.z||0)),q=n.acceleration?i:Math.abs(i-9.81),u=performance.now();s.forEach((C,B)=>{if(C.trigger!=="shake")return;const I=C.threshold??12,Y=C.cooldownMs??520,j=x[B];q>=I&&u-j.lastFire>Y&&(j.lastFire=u,X(C.code))})},V=async()=>{if(!M)return!1;const n=[],r=window.DeviceMotionEvent,i=window.DeviceOrientationEvent;if(c&&typeof(r==null?void 0:r.requestPermission)=="function"&&n.push(r.requestPermission()),d&&typeof(i==null?void 0:i.requestPermission)=="function"&&n.push(i.requestPermission()),n.length===0)return!0;try{return(await Promise.all(n)).every(u=>u==="granted")}catch{return!1}},T={supported:S,active:!1,async start(){return S?T.active?!0:await V()?(d&&window.addEventListener("deviceorientation",N,{passive:!0}),c&&window.addEventListener("devicemotion",G,{passive:!0}),T.active=!0,!0):!1:!1},stop(){T.active&&(d&&window.removeEventListener("deviceorientation",N),c&&window.removeEventListener("devicemotion",G),T.active=!1,E(),h=0,L=0)},dispose(){T.stop()}};return T}function ne(o){if(!W())return{isMobile:!1,mode:"touch",show:()=>{},hide:()=>{},attachOverlay:()=>{},setMode:async()=>{},dispose:()=>{}};const t=`mobile-control-mode:${o.gameId}`;let s=null;try{s=localStorage.getItem(t)??null}catch{s=null}const e=z(o.motion);let a=s||o.defaultMode||"touch";a==="motion"&&!e.supported&&(a="touch");const p=_({container:o.container,input:o.input,mapping:o.touch.mapping,autoShow:!1,showOnDesktop:!1,showPad:o.touch.showPad??!0,gestureEnabled:o.touch.gestureEnabled??!1,showFullscreenToggle:o.touch.showFullscreenToggle??!0});let m=!1,g=!1,d=!1,c=null;const M=()=>{try{localStorage.setItem(t,a)}catch{}},f=()=>e.supported?g?"Autorisation refusée":e.active?"Capteurs actifs":d?"Capteurs prêts":"Autorisation requise":"Capteurs indisponibles",y=()=>{var D,w;if(!c)return;const x=c.querySelector('[data-control-mode="touch"]'),h=c.querySelector('[data-control-mode="motion"]'),L=c.querySelector('input[name="mobile-control-mode"][value="touch"]'),v=c.querySelector('input[name="mobile-control-mode"][value="motion"]'),k=c.querySelector("[data-control-hint]"),E=c.querySelector("[data-control-status]");x&&x.classList.toggle("is-active",a==="touch"),h&&(h.classList.toggle("is-active",a==="motion"),h.classList.toggle("is-disabled",!e.supported)),L&&(L.checked=a==="touch"),v&&(v.checked=a==="motion",v.disabled=!e.supported),k&&(k.textContent=a==="motion"?((D=o.hints)==null?void 0:D.motion)||"Incliner pour jouer.":((w=o.hints)==null?void 0:w.touch)||"D-pad + actions."),E&&(E.textContent=f())},S=async x=>{a!==x&&(x==="motion"?e.supported?await e.start()?(g=!1,d=!0,a="motion",m||e.stop()):(g=!0,d=!1,a="touch",e.stop()):(g=!0,a="touch"):(a="touch",e.stop()),M(),m&&a==="touch"?p.show():p.hide(),b.mode=a,y())},b={isMobile:!0,mode:a,async show(){m=!0,a==="motion"?await e.start()?(g=!1,d=!0,p.hide()):(g=!0,d=!1,a="touch",b.mode=a,p.show()):(p.show(),e.stop()),y()},hide(){m=!1,p.hide(),e.stop(),y()},attachOverlay(x){const h=x.querySelector(".launch-grid");if(!h)return;const L=h.querySelector("[data-mobile-controls]");L==null||L.remove();const v=document.createElement("section");v.className="launch-section mobile-controls-section",v.dataset.mobileControls="true",v.innerHTML=`
        <h3 class="launch-section-title">Contrôles mobiles</h3>
        <div class="launch-rows">
          <div class="launch-row">
            <span class="launch-row-label">Mode</span>
            <div class="launch-row-value launch-options">
              <label class="launch-option" data-control-mode="touch">
                <input type="radio" name="mobile-control-mode" value="touch" />
                <span class="launch-option-title">Boutons</span>
                <span class="launch-option-meta">Pad + actions</span>
              </label>
              <label class="launch-option" data-control-mode="motion">
                <input type="radio" name="mobile-control-mode" value="motion" />
                <span class="launch-option-title">Capteurs</span>
                <span class="launch-option-meta">Gyro + accel</span>
              </label>
            </div>
          </div>
          <div class="launch-row">
            <span class="launch-row-label">Aperçu</span>
            <div class="launch-row-value">
              <span class="launch-chip" data-control-hint></span>
            </div>
          </div>
          <div class="launch-row">
            <span class="launch-row-label">Statut</span>
            <div class="launch-row-value">
              <span class="launch-chip muted" data-control-status></span>
            </div>
          </div>
        </div>
      `,h.appendChild(v),c=v,v.querySelectorAll('input[name="mobile-control-mode"]').forEach(E=>{E.addEventListener("change",()=>{S(E.value)})}),y()},setMode:S,dispose(){p.dispose(),e.dispose(),c=null}};return b.mode=a,y(),b}export{ne as a,te as c};
