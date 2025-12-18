function S(){const n=new Set,o=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"]),s=e=>{o.has(e.code)&&e.preventDefault(),n.add(e.code)},t=e=>{o.has(e.code)&&e.preventDefault(),n.delete(e.code)};return window.addEventListener("keydown",s),window.addEventListener("keyup",t),{isDown:e=>n.has(e),dispose(){window.removeEventListener("keydown",s),window.removeEventListener("keyup",t),n.clear()}}}function P(){const n=S(),o=new Set,s=(e,d)=>{e&&(d?o.add(e):o.delete(e))};return{isDown:e=>n.isDown(e)||o.has(e),bindButton:(e,d)=>{const v=i=>{i.preventDefault(),s(d,!0)},l=i=>{i.preventDefault(),s(d,!1)};return e.addEventListener("pointerdown",v,{passive:!1}),e.addEventListener("pointerup",l,{passive:!1}),e.addEventListener("pointercancel",l,{passive:!1}),e.addEventListener("pointerleave",l,{passive:!1}),()=>{e.removeEventListener("pointerdown",v),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l),e.removeEventListener("pointerleave",l),s(d,!1)}},press:e=>s(e,!0),release:e=>s(e,!1),dispose:()=>{n.dispose(),o.clear()}}}let A=!1;function N(){if(A)return;A=!0;const n=document.createElement("style");n.textContent=`
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
      gap: 6px;
      width: 168px;
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
  `,document.head.appendChild(n)}function w(n,o,s){const t=document.createElement("button");return t.type="button",t.className="mobile-btn",t.textContent=n,o?s.bindButton(t,o):t.disabled=!0,t}function j(n,o,s){const t={x:0,y:0};let e=!1,d={x:0,y:0};const v=10,l=()=>{["up","down","left","right"].forEach(r=>{const u=o[r];u&&s.release(u)})},i=(r,u)=>{l();const b=Math.abs(r),h=Math.abs(u);b<v&&h<v||(b>h?(r>0&&o.right&&s.press(o.right),r<0&&o.left&&s.press(o.left)):(u>0&&o.down&&s.press(o.down),u<0&&o.up&&s.press(o.up)))},a=r=>{r.preventDefault(),e=!0,d={x:r.clientX,y:r.clientY}},g=r=>{e&&(r.preventDefault(),e&&(t.x=r.clientX-d.x,t.y=r.clientY-d.y,i(t.x,t.y)))},f=()=>{e=!1,t.x=0,t.y=0,l()};return n.addEventListener("pointerdown",a,{passive:!1}),n.addEventListener("pointermove",g,{passive:!1}),n.addEventListener("pointerup",f,{passive:!1}),n.addEventListener("pointercancel",f,{passive:!1}),n.addEventListener("pointerleave",f,{passive:!1}),()=>{n.removeEventListener("pointerdown",a),n.removeEventListener("pointermove",g),n.removeEventListener("pointerup",f),n.removeEventListener("pointercancel",f),n.removeEventListener("pointerleave",f),l()}}function Y(n){const{container:o,input:s,mapping:t,showOnDesktop:e=!1,autoShow:d=!0,showFullscreenToggle:v=!0,showPad:l=!1}=n;if(!o)return{dispose:()=>{}};N();const i=document.createElement("div");i.className=`mobile-controls ${e?"":"hidden-desktop"}`.trim(),d||i.classList.add("mc-hidden"),i.style.display=d?"grid":"none";const a=document.createElement("div");a.className="mobile-pad";const g=w("↑",t.up,s),f=w("↓",t.down,s),r=w("←",t.left,s),u=w("→",t.right,s);a.appendChild(document.createElement("div")),a.appendChild(g),a.appendChild(document.createElement("div")),a.appendChild(r),a.appendChild(document.createElement("div")),a.appendChild(u),a.appendChild(document.createElement("div")),a.appendChild(f),a.appendChild(document.createElement("div"));const b=document.createElement("div");b.className="mobile-actions";const h=t.actionA?w(t.actionALabel||"A",t.actionA,s):null,E=t.actionB?w(t.actionBLabel||"B",t.actionB,s):null;h&&b.appendChild(h),E&&b.appendChild(E);const C=!!(t.up||t.down||t.left||t.right),k=C&&l,D=!!(h||E);k&&i.appendChild(a),D&&i.appendChild(b);const m=v?document.createElement("button"):null;if(m){m.type="button",m.className="mobile-fs-btn",m.textContent="⤢",m.title="Plein écran",m.addEventListener("click",()=>{var y,B;document.fullscreenElement?document.exitFullscreen().catch(()=>{}):(B=(y=document.documentElement)==null?void 0:y.requestFullscreen)==null||B.call(y).catch(()=>{})});const p=document.createElement("div");p.style.pointerEvents="all",p.style.alignSelf="start",p.style.justifySelf="end",p.appendChild(m),i.appendChild(p)}let x,c;C&&(c=document.createElement("div"),c.className="mobile-gesture",c.style.background="transparent",o.appendChild(c),x=j(c,t,s)),(k||D||m)&&o.appendChild(i);const L=p=>{i.classList.toggle("mc-hidden",!p),i.style.display=p?"grid":"none",c&&(c.style.display=p?"block":"none",c.style.pointerEvents=p?"all":"none")};return L(d),{show(){L(!0)},hide(){L(!1)},dispose(){i.remove(),c!=null&&c.parentElement&&c.remove(),x==null||x()}}}export{Y as a,P as c};
