function g(){const n=new Set,o=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"]),i=e=>{o.has(e.code)&&e.preventDefault(),n.add(e.code)},t=e=>{o.has(e.code)&&e.preventDefault(),n.delete(e.code)};return window.addEventListener("keydown",i),window.addEventListener("keyup",t),{isDown:e=>n.has(e),dispose(){window.removeEventListener("keydown",i),window.removeEventListener("keyup",t),n.clear()}}}function C(){const n=g(),o=new Set,i=(e,a)=>{e&&(a?o.add(e):o.delete(e))};return{isDown:e=>n.isDown(e)||o.has(e),bindButton:(e,a)=>{const s=f=>{f.preventDefault(),i(a,!0)},d=f=>{f.preventDefault(),i(a,!1)};return e.addEventListener("pointerdown",s,{passive:!1}),e.addEventListener("pointerup",d,{passive:!1}),e.addEventListener("pointercancel",d,{passive:!1}),e.addEventListener("pointerleave",d,{passive:!1}),()=>{e.removeEventListener("pointerdown",s),e.removeEventListener("pointerup",d),e.removeEventListener("pointercancel",d),e.removeEventListener("pointerleave",d),i(a,!1)}},press:e=>i(e,!0),release:e=>i(e,!1),dispose:()=>{n.dispose(),o.clear()}}}let E=!1;function y(){if(E)return;E=!0;const n=document.createElement("style");n.textContent=`
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
  `,document.head.appendChild(n)}function v(n,o,i){const t=document.createElement("button");return t.type="button",t.className="mobile-btn",t.textContent=n,o?i.bindButton(t,o):t.disabled=!0,t}function L(n,o,i){const t={x:0,y:0};let e=!1,a={x:0,y:0};const s=10,d=()=>{["up","down","left","right"].forEach(r=>{const p=o[r];p&&i.release(p)})},f=(r,p)=>{d();const u=Math.abs(r),m=Math.abs(p);u<s&&m<s||(u>m?(r>0&&o.right&&i.press(o.right),r<0&&o.left&&i.press(o.left)):(p>0&&o.down&&i.press(o.down),p<0&&o.up&&i.press(o.up)))},b=r=>{r.preventDefault(),e=!0,a={x:r.clientX,y:r.clientY}},h=r=>{e&&(r.preventDefault(),e&&(t.x=r.clientX-a.x,t.y=r.clientY-a.y,f(t.x,t.y)))},l=()=>{e=!1,t.x=0,t.y=0,d()};return n.addEventListener("pointerdown",b,{passive:!1}),n.addEventListener("pointermove",h,{passive:!1}),n.addEventListener("pointerup",l,{passive:!1}),n.addEventListener("pointercancel",l,{passive:!1}),n.addEventListener("pointerleave",l,{passive:!1}),()=>{n.removeEventListener("pointerdown",b),n.removeEventListener("pointermove",h),n.removeEventListener("pointerup",l),n.removeEventListener("pointercancel",l),n.removeEventListener("pointerleave",l),d()}}function D(n){const{container:o,input:i,mapping:t,showOnDesktop:e=!1}=n;if(!o)return{dispose:()=>{}};y();const a=document.createElement("div");a.className=`mobile-controls ${e?"":"hidden-desktop"}`.trim();const s=document.createElement("div");s.className="mobile-pad";const d=v("↑",t.up,i),f=v("↓",t.down,i),b=v("←",t.left,i),h=v("→",t.right,i);s.appendChild(document.createElement("div")),s.appendChild(d),s.appendChild(document.createElement("div")),s.appendChild(b),s.appendChild(document.createElement("div")),s.appendChild(h),s.appendChild(document.createElement("div")),s.appendChild(f),s.appendChild(document.createElement("div"));const l=document.createElement("div");l.className="mobile-actions";const r=t.actionA?v(t.actionALabel||"A",t.actionA,i):null,p=t.actionB?v(t.actionBLabel||"B",t.actionB,i):null;r&&l.appendChild(r),p&&l.appendChild(p);const u=!!(t.up||t.down||t.left||t.right),m=!!(r||p),x=u;u&&a.appendChild(s),m&&a.appendChild(l);let w,c;return x&&(c=document.createElement("div"),c.className="mobile-gesture",o.appendChild(c),w=L(c,t,i)),(u||m)&&o.appendChild(a),{dispose(){a.remove(),c!=null&&c.parentElement&&c.remove(),w==null||w()}}}export{D as a,C as c};
