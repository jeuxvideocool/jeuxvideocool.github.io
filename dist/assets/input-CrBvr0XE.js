function j(){const n=new Set,o=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"]),i=e=>{o.has(e.code)&&e.preventDefault(),n.add(e.code)},t=e=>{o.has(e.code)&&e.preventDefault(),n.delete(e.code)};return window.addEventListener("keydown",i),window.addEventListener("keyup",t),{isDown:e=>n.has(e),dispose(){window.removeEventListener("keydown",i),window.removeEventListener("keyup",t),n.clear()}}}function Y(){const n=j(),o=new Set,i=(e,r)=>{e&&(r?o.add(e):o.delete(e))};return{isDown:e=>n.isDown(e)||o.has(e),bindButton:(e,r)=>{const b=v=>{v.preventDefault(),i(r,!0)},d=v=>{v.preventDefault(),i(r,!1)};return e.addEventListener("pointerdown",b,{passive:!1}),e.addEventListener("pointerup",d,{passive:!1}),e.addEventListener("pointercancel",d,{passive:!1}),e.addEventListener("pointerleave",d,{passive:!1}),()=>{e.removeEventListener("pointerdown",b),e.removeEventListener("pointerup",d),e.removeEventListener("pointercancel",d),e.removeEventListener("pointerleave",d),i(r,!1)}},press:e=>i(e,!0),release:e=>i(e,!1),dispose:()=>{n.dispose(),o.clear()}}}let S=!1;function N(){if(S)return;S=!0;const n=document.createElement("style");n.textContent=`
    .mobile-controls {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 30;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: end;
      justify-items: stretch;
      gap: 12px;
      padding: 14px;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      transition: opacity 0.25s ease, transform 0.25s ease;
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
    .mobile-pad, .mobile-actions {
      pointer-events: all;
      align-self: end;
      margin-bottom: env(safe-area-inset-bottom, 0px);
    }
    .mobile-pad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 6px;
      width: min(168px, 42vw);
      max-width: 36vw;
      justify-self: start;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      padding: 10px;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .mobile-actions {
      display: flex;
      gap: 10px;
      justify-self: end;
    }
    .mobile-btn {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.18);
      background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
      color: #f7fbff;
      font-weight: 800;
      font-size: 15px;
      box-shadow: 0 10px 22px rgba(0,0,0,0.26);
      cursor: pointer;
      touch-action: none;
    }
    .mobile-btn:active {
      transform: scale(0.96);
      background: linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06));
    }
    @media (max-height: 720px) {
      .mobile-btn {
        width: 46px;
        height: 46px;
        font-size: 14px;
      }
      .mobile-pad {
        width: min(150px, 40vw);
        padding: 8px;
      }
    }
    .mobile-fs-btn {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.08);
      color: #f7fbff;
      font-weight: 800;
      font-size: 18px;
      box-shadow: 0 8px 18px rgba(0,0,0,0.26);
      cursor: pointer;
      touch-action: manipulation;
    }
    .mobile-fs-btn:active {
      transform: scale(0.95);
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
  `,document.head.appendChild(n)}function w(n,o,i){const t=document.createElement("button");return t.type="button",t.className="mobile-btn",t.textContent=n,o?i.bindButton(t,o):t.disabled=!0,t}function M(n,o,i){const t={x:0,y:0};let e=!1,r={x:0,y:0};const b=10,d=()=>{["up","down","left","right"].forEach(s=>{const u=o[s];u&&i.release(u)})},v=(s,u)=>{d();const x=Math.abs(s),h=Math.abs(u);x<b&&h<b||(x>h?(s>0&&o.right&&i.press(o.right),s<0&&o.left&&i.press(o.left)):(u>0&&o.down&&i.press(o.down),u<0&&o.up&&i.press(o.up)))},c=s=>{s.preventDefault(),e=!0,r={x:s.clientX,y:s.clientY}},a=s=>{e&&(s.preventDefault(),e&&(t.x=s.clientX-r.x,t.y=s.clientY-r.y,v(t.x,t.y)))},f=()=>{e=!1,t.x=0,t.y=0,d()};return n.addEventListener("pointerdown",c,{passive:!1}),n.addEventListener("pointermove",a,{passive:!1}),n.addEventListener("pointerup",f,{passive:!1}),n.addEventListener("pointercancel",f,{passive:!1}),n.addEventListener("pointerleave",f,{passive:!1}),()=>{n.removeEventListener("pointerdown",c),n.removeEventListener("pointermove",a),n.removeEventListener("pointerup",f),n.removeEventListener("pointercancel",f),n.removeEventListener("pointerleave",f),d()}}function F(n){const{container:o,input:i,mapping:t,showOnDesktop:e=!1,autoShow:r=!1,showFullscreenToggle:b=!0,showPad:d=!1,gestureEnabled:v=!0}=n;if(!o)return{dispose:()=>{}};N();const c=document.createElement("div");c.className=`mobile-controls ${e?"":"hidden-desktop"}`.trim(),r||c.classList.add("mc-hidden");const a=document.createElement("div");a.className="mobile-pad";const f=w("↑",t.up,i),s=w("↓",t.down,i),u=w("←",t.left,i),x=w("→",t.right,i);a.appendChild(document.createElement("div")),a.appendChild(f),a.appendChild(document.createElement("div")),a.appendChild(u),a.appendChild(document.createElement("div")),a.appendChild(x),a.appendChild(document.createElement("div")),a.appendChild(s),a.appendChild(document.createElement("div"));const h=document.createElement("div");h.className="mobile-actions";const y=t.actionA?w(t.actionALabel||"A",t.actionA,i):null,L=t.actionB?w(t.actionBLabel||"B",t.actionB,i):null;y&&h.appendChild(y),L&&h.appendChild(L);const k=!!(t.up||t.down||t.left||t.right),D=k&&d,B=!!(y||L);D&&c.appendChild(a),B&&c.appendChild(h);const m=b?document.createElement("button"):null;if(m){m.type="button",m.className="mobile-fs-btn",m.textContent="⤢",m.title="Plein écran",m.addEventListener("click",()=>{var E,A;document.fullscreenElement?document.exitFullscreen().catch(()=>{}):(A=(E=document.documentElement)==null?void 0:E.requestFullscreen)==null||A.call(E).catch(()=>{})});const p=document.createElement("div");p.style.pointerEvents="all",p.style.alignSelf="start",p.style.justifySelf="end",p.appendChild(m),c.appendChild(p)}let g,l;k&&v&&(l=document.createElement("div"),l.className="mobile-gesture",l.style.background="transparent",o.appendChild(l),g=M(l,t,i)),(D||B||m)&&o.appendChild(c);const C=p=>{c.classList.toggle("mc-hidden",!p),l&&(l.style.display=p?"block":"none",l.style.pointerEvents=p?"all":"none")};return C(r),{show(){C(!0)},hide(){C(!1)},dispose(){c.remove(),l!=null&&l.parentElement&&l.remove(),g==null||g()}}}export{F as a,Y as c};
