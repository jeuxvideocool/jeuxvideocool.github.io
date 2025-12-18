function A(){const n=new Set,o=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"]),i=e=>{o.has(e.code)&&e.preventDefault(),n.add(e.code)},t=e=>{o.has(e.code)&&e.preventDefault(),n.delete(e.code)};return window.addEventListener("keydown",i),window.addEventListener("keyup",t),{isDown:e=>n.has(e),dispose(){window.removeEventListener("keydown",i),window.removeEventListener("keyup",t),n.clear()}}}function M(){const n=A(),o=new Set,i=(e,d)=>{e&&(d?o.add(e):o.delete(e))};return{isDown:e=>n.isDown(e)||o.has(e),bindButton:(e,d)=>{const m=r=>{r.preventDefault(),i(d,!0)},s=r=>{r.preventDefault(),i(d,!1)};return e.addEventListener("pointerdown",m,{passive:!1}),e.addEventListener("pointerup",s,{passive:!1}),e.addEventListener("pointercancel",s,{passive:!1}),e.addEventListener("pointerleave",s,{passive:!1}),()=>{e.removeEventListener("pointerdown",m),e.removeEventListener("pointerup",s),e.removeEventListener("pointercancel",s),e.removeEventListener("pointerleave",s),i(d,!1)}},press:e=>i(e,!0),release:e=>i(e,!1),dispose:()=>{n.dispose(),o.clear()}}}let D=!1;function S(){if(D)return;D=!0;const n=document.createElement("style");n.textContent=`
    .mobile-controls {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 30;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 12px;
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
    }
    .mobile-pad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 8px;
      width: 200px;
      max-width: 42vw;
      justify-self: start;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      padding: 10px;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .mobile-actions {
      display: flex;
      gap: 12px;
      justify-self: end;
    }
    .mobile-btn {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.18);
      background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
      color: #f7fbff;
      font-weight: 800;
      font-size: 16px;
      box-shadow: 0 10px 28px rgba(0,0,0,0.28);
      cursor: pointer;
      touch-action: none;
    }
    .mobile-btn:active {
      transform: scale(0.96);
      background: linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06));
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
      left: 0;
      bottom: 0;
      width: 55vw;
      height: 60vh;
      pointer-events: all;
      touch-action: none;
      z-index: 29;
    }
    @media (min-width: 1025px) {
      .mobile-gesture {
        display: none;
      }
    }
  `,document.head.appendChild(n)}function h(n,o,i){const t=document.createElement("button");return t.type="button",t.className="mobile-btn",t.textContent=n,o?i.bindButton(t,o):t.disabled=!0,t}function N(n,o,i){const t={x:0,y:0};let e=!1,d={x:0,y:0};const m=10,s=()=>{["up","down","left","right"].forEach(a=>{const l=o[a];l&&i.release(l)})},r=(a,l)=>{s();const v=Math.abs(a),b=Math.abs(l);v<m&&b<m||(v>b?(a>0&&o.right&&i.press(o.right),a<0&&o.left&&i.press(o.left)):(l>0&&o.down&&i.press(o.down),l<0&&o.up&&i.press(o.up)))},w=a=>{a.preventDefault(),e=!0,d={x:a.clientX,y:a.clientY}},x=a=>{e&&(a.preventDefault(),e&&(t.x=a.clientX-d.x,t.y=a.clientY-d.y,r(t.x,t.y)))},p=()=>{e=!1,t.x=0,t.y=0,s()};return n.addEventListener("pointerdown",w,{passive:!1}),n.addEventListener("pointermove",x,{passive:!1}),n.addEventListener("pointerup",p,{passive:!1}),n.addEventListener("pointercancel",p,{passive:!1}),n.addEventListener("pointerleave",p,{passive:!1}),()=>{n.removeEventListener("pointerdown",w),n.removeEventListener("pointermove",x),n.removeEventListener("pointerup",p),n.removeEventListener("pointercancel",p),n.removeEventListener("pointerleave",p),s()}}function P(n){const{container:o,input:i,mapping:t,showOnDesktop:e=!1,autoShow:d=!0,showFullscreenToggle:m=!0}=n;if(!o)return{dispose:()=>{}};S();const s=document.createElement("div");s.className=`mobile-controls ${e?"":"hidden-desktop"}`.trim(),d||s.classList.add("mc-hidden");const r=document.createElement("div");r.className="mobile-pad";const w=h("↑",t.up,i),x=h("↓",t.down,i),p=h("←",t.left,i),a=h("→",t.right,i);r.appendChild(document.createElement("div")),r.appendChild(w),r.appendChild(document.createElement("div")),r.appendChild(p),r.appendChild(document.createElement("div")),r.appendChild(a),r.appendChild(document.createElement("div")),r.appendChild(x),r.appendChild(document.createElement("div"));const l=document.createElement("div");l.className="mobile-actions";const v=t.actionA?h(t.actionALabel||"A",t.actionA,i):null,b=t.actionB?h(t.actionBLabel||"B",t.actionB,i):null;v&&l.appendChild(v),b&&l.appendChild(b);const y=!!(t.up||t.down||t.left||t.right),C=!!(v||b),B=y;y&&s.appendChild(r),C&&s.appendChild(l);const f=m?document.createElement("button"):null;if(f){f.type="button",f.className="mobile-fs-btn",f.textContent="⤢",f.title="Plein écran",f.addEventListener("click",()=>{var E,k;document.fullscreenElement?document.exitFullscreen().catch(()=>{}):(k=(E=document.documentElement)==null?void 0:E.requestFullscreen)==null||k.call(E).catch(()=>{})});const u=document.createElement("div");u.style.pointerEvents="all",u.style.alignSelf="start",u.style.justifySelf="end",u.appendChild(f),s.appendChild(u)}let g,c;B&&(c=document.createElement("div"),c.className="mobile-gesture",o.appendChild(c),g=N(c,t,i)),(y||C||f)&&o.appendChild(s);const L=u=>{s.classList.toggle("mc-hidden",!u),c&&(c.style.display=u?"block":"none")};return L(d),{show(){L(!0)},hide(){L(!1)},dispose(){s.remove(),c!=null&&c.parentElement&&c.remove(),g==null||g()}}}export{P as a,M as c};
