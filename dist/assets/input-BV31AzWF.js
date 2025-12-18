function g(){const n=new Set,i=e=>n.add(e.code),o=e=>n.delete(e.code);return window.addEventListener("keydown",i),window.addEventListener("keyup",o),{isDown:e=>n.has(e),dispose(){window.removeEventListener("keydown",i),window.removeEventListener("keyup",o),n.clear()}}}function C(){const n=g(),i=new Set,o=(t,a)=>{t&&(a?i.add(t):i.delete(t))};return{isDown:t=>n.isDown(t)||i.has(t),bindButton:(t,a)=>{const s=f=>{f.preventDefault(),o(a,!0)},d=f=>{f.preventDefault(),o(a,!1)};return t.addEventListener("pointerdown",s,{passive:!1}),t.addEventListener("pointerup",d,{passive:!1}),t.addEventListener("pointercancel",d,{passive:!1}),t.addEventListener("pointerleave",d,{passive:!1}),()=>{t.removeEventListener("pointerdown",s),t.removeEventListener("pointerup",d),t.removeEventListener("pointercancel",d),t.removeEventListener("pointerleave",d),o(a,!1)}},press:t=>o(t,!0),release:t=>o(t,!1),dispose:()=>{n.dispose(),i.clear()}}}let E=!1;function y(){if(E)return;E=!0;const n=document.createElement("style");n.textContent=`
    .mobile-controls {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 30;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 12px;
    }
    .mobile-controls.hidden-desktop {
      display: none;
    }
    @media (max-width: 1024px) {
      .mobile-controls.hidden-desktop {
        display: grid;
      }
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
  `,document.head.appendChild(n)}function v(n,i,o){const e=document.createElement("button");return e.type="button",e.className="mobile-btn",e.textContent=n,i?o.bindButton(e,i):e.disabled=!0,e}function L(n,i,o){const e={x:0,y:0};let t=!1,a={x:0,y:0};const s=10,d=()=>{["up","down","left","right"].forEach(r=>{const p=i[r];p&&o.release(p)})},f=(r,p)=>{d();const u=Math.abs(r),m=Math.abs(p);u<s&&m<s||(u>m?(r>0&&i.right&&o.press(i.right),r<0&&i.left&&o.press(i.left)):(p>0&&i.down&&o.press(i.down),p<0&&i.up&&o.press(i.up)))},b=r=>{r.preventDefault(),t=!0,a={x:r.clientX,y:r.clientY}},h=r=>{t&&(r.preventDefault(),t&&(e.x=r.clientX-a.x,e.y=r.clientY-a.y,f(e.x,e.y)))},l=()=>{t=!1,e.x=0,e.y=0,d()};return n.addEventListener("pointerdown",b,{passive:!1}),n.addEventListener("pointermove",h,{passive:!1}),n.addEventListener("pointerup",l,{passive:!1}),n.addEventListener("pointercancel",l,{passive:!1}),n.addEventListener("pointerleave",l,{passive:!1}),()=>{n.removeEventListener("pointerdown",b),n.removeEventListener("pointermove",h),n.removeEventListener("pointerup",l),n.removeEventListener("pointercancel",l),n.removeEventListener("pointerleave",l),d()}}function k(n){const{container:i,input:o,mapping:e,showOnDesktop:t=!1}=n;if(!i)return{dispose:()=>{}};y();const a=document.createElement("div");a.className=`mobile-controls ${t?"":"hidden-desktop"}`.trim();const s=document.createElement("div");s.className="mobile-pad";const d=v("↑",e.up,o),f=v("↓",e.down,o),b=v("←",e.left,o),h=v("→",e.right,o);s.appendChild(document.createElement("div")),s.appendChild(d),s.appendChild(document.createElement("div")),s.appendChild(b),s.appendChild(document.createElement("div")),s.appendChild(h),s.appendChild(document.createElement("div")),s.appendChild(f),s.appendChild(document.createElement("div"));const l=document.createElement("div");l.className="mobile-actions";const r=e.actionA?v(e.actionALabel||"A",e.actionA,o):null,p=e.actionB?v(e.actionBLabel||"B",e.actionB,o):null;r&&l.appendChild(r),p&&l.appendChild(p);const u=!!(e.up||e.down||e.left||e.right),m=!!(r||p),x=u;u&&a.appendChild(s),m&&a.appendChild(l);let w,c;return x&&(c=document.createElement("div"),c.className="mobile-gesture",i.appendChild(c),w=L(c,e,o)),(u||m)&&i.appendChild(a),{dispose(){a.remove(),c!=null&&c.parentElement&&c.remove(),w==null||w()}}}export{k as a,C as c};
