export type KeyboardInput = {
  isDown: (code: string) => boolean;
  dispose: () => void;
};

export function createKeyboardInput(): KeyboardInput {
  const pressed = new Set<string>();
  const preventCodes = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);
  const onDown = (e: KeyboardEvent) => {
    if (preventCodes.has(e.code)) {
      e.preventDefault();
    }
    pressed.add(e.code);
  };
  const onUp = (e: KeyboardEvent) => {
    if (preventCodes.has(e.code)) {
      e.preventDefault();
    }
    pressed.delete(e.code);
  };
  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);
  return {
    isDown: (code: string) => pressed.has(code),
    dispose() {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      pressed.clear();
    },
  };
}

export type PointerInput = {
  position: { x: number; y: number };
  isDown: boolean;
  dispose: () => void;
};

export function createPointerInput(target: HTMLElement): PointerInput {
  const position = { x: 0, y: 0 };
  let isDown = false;

  const setFromEvent = (event: PointerEvent) => {
    const rect = target.getBoundingClientRect();
    position.x = event.clientX - rect.left;
    position.y = event.clientY - rect.top;
  };

  const onMove = (event: PointerEvent) => setFromEvent(event);
  const onDown = (event: PointerEvent) => {
    isDown = true;
    setFromEvent(event);
  };
  const onUp = () => {
    isDown = false;
  };

  target.addEventListener("pointermove", onMove);
  target.addEventListener("pointerdown", onDown);
  target.addEventListener("pointerup", onUp);
  target.addEventListener("pointerleave", onUp);

  return {
    get position() {
      return position;
    },
    get isDown() {
      return isDown;
    },
    dispose() {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerdown", onDown);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointerleave", onUp);
    },
  };
}

export type HybridInput = {
  isDown: (code: string) => boolean;
  bindButton: (el: HTMLElement, code: string) => () => void;
  press: (code: string) => void;
  release: (code: string) => void;
  dispose: () => void;
};

export function createHybridInput(): HybridInput {
  const keyboard = createKeyboardInput();
  const touchPressed = new Set<string>();

  const setPressed = (code: string, pressed: boolean) => {
    if (!code) return;
    if (pressed) touchPressed.add(code);
    else touchPressed.delete(code);
  };

  const bindButton = (el: HTMLElement, code: string) => {
    const down = (e: PointerEvent) => {
      e.preventDefault();
      setPressed(code, true);
    };
    const up = (e: PointerEvent) => {
      e.preventDefault();
      setPressed(code, false);
    };
    el.addEventListener("pointerdown", down, { passive: false });
    el.addEventListener("pointerup", up, { passive: false });
    el.addEventListener("pointercancel", up, { passive: false });
    el.addEventListener("pointerleave", up, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", up);
      setPressed(code, false);
    };
  };

  return {
    isDown: (code: string) => keyboard.isDown(code) || touchPressed.has(code),
    bindButton,
    press: (code: string) => setPressed(code, true),
    release: (code: string) => setPressed(code, false),
    dispose: () => {
      keyboard.dispose();
      touchPressed.clear();
    },
  };
}

type MobileMapping = {
  up?: string;
  down?: string;
  left?: string;
  right?: string;
  actionA?: string;
  actionALabel?: string;
  actionB?: string;
  actionBLabel?: string;
};

type MobileControlsOptions = {
  container: HTMLElement;
  input: HybridInput;
  mapping: MobileMapping;
  showOnDesktop?: boolean;
  autoShow?: boolean;
  showFullscreenToggle?: boolean;
  showPad?: boolean;
};

let mobileStylesInjected = false;
function injectMobileStyles() {
  if (mobileStylesInjected) return;
  mobileStylesInjected = true;
  const style = document.createElement("style");
  style.textContent = `
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
  `;
  document.head.appendChild(style);
}

function createBtn(label: string, code: string | undefined, input: HybridInput) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mobile-btn";
  btn.textContent = label;
  if (code) {
    input.bindButton(btn, code);
  } else {
    btn.disabled = true;
  }
  return btn;
}

function bindGestureZone(
  zone: HTMLElement,
  mapping: { up?: string; down?: string; left?: string; right?: string },
  input: HybridInput,
) {
  const dir = { x: 0, y: 0 };
  let active = false;
  let start = { x: 0, y: 0 };
  const threshold = 10;

  const release = () => {
    ["up", "down", "left", "right"].forEach((key) => {
      const code = (mapping as any)[key];
      if (code) input.release(code);
    });
  };

  const apply = (dx: number, dy: number) => {
    release();
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX < threshold && absY < threshold) return;
    if (absX > absY) {
      if (dx > 0 && mapping.right) input.press(mapping.right);
      if (dx < 0 && mapping.left) input.press(mapping.left);
    } else {
      if (dy > 0 && mapping.down) input.press(mapping.down);
      if (dy < 0 && mapping.up) input.press(mapping.up);
    }
  };

  const onDown = (e: PointerEvent) => {
    e.preventDefault();
    active = true;
    start = { x: e.clientX, y: e.clientY };
  };
  const onMove = (e: PointerEvent) => {
    if (!active) return;
    e.preventDefault();
    if (!active) return;
    dir.x = e.clientX - start.x;
    dir.y = e.clientY - start.y;
    apply(dir.x, dir.y);
  };
  const onUp = () => {
    active = false;
    dir.x = 0;
    dir.y = 0;
    release();
  };

  zone.addEventListener("pointerdown", onDown, { passive: false });
  zone.addEventListener("pointermove", onMove, { passive: false });
  zone.addEventListener("pointerup", onUp, { passive: false });
  zone.addEventListener("pointercancel", onUp, { passive: false });
  zone.addEventListener("pointerleave", onUp, { passive: false });

  return () => {
    zone.removeEventListener("pointerdown", onDown);
    zone.removeEventListener("pointermove", onMove);
    zone.removeEventListener("pointerup", onUp);
    zone.removeEventListener("pointercancel", onUp);
    zone.removeEventListener("pointerleave", onUp);
    release();
  };
}

export function createMobileControls(options: MobileControlsOptions) {
  const {
    container,
    input,
    mapping,
    showOnDesktop = false,
    autoShow = true,
    showFullscreenToggle = true,
    showPad = false,
  } = options;
  if (!container) return { dispose: () => {} };
  injectMobileStyles();

  const root = document.createElement("div");
  root.className = `mobile-controls ${showOnDesktop ? "" : "hidden-desktop"}`.trim();
  if (!autoShow) {
    root.classList.add("mc-hidden");
  }
  root.style.display = autoShow ? "grid" : "none";

  const pad = document.createElement("div");
  pad.className = "mobile-pad";

  const up = createBtn("↑", mapping.up, input);
  const down = createBtn("↓", mapping.down, input);
  const left = createBtn("←", mapping.left, input);
  const right = createBtn("→", mapping.right, input);

  pad.appendChild(document.createElement("div"));
  pad.appendChild(up);
  pad.appendChild(document.createElement("div"));
  pad.appendChild(left);
  pad.appendChild(document.createElement("div"));
  pad.appendChild(right);
  pad.appendChild(document.createElement("div"));
  pad.appendChild(down);
  pad.appendChild(document.createElement("div"));

  const actions = document.createElement("div");
  actions.className = "mobile-actions";
  const actionA = mapping.actionA
    ? createBtn(mapping.actionALabel || "A", mapping.actionA, input)
    : null;
  const actionB = mapping.actionB
    ? createBtn(mapping.actionBLabel || "B", mapping.actionB, input)
    : null;
  if (actionA) actions.appendChild(actionA);
  if (actionB) actions.appendChild(actionB);

  const hasDirections = Boolean(mapping.up || mapping.down || mapping.left || mapping.right);
  const hasPad = hasDirections && showPad;
  const hasActions = Boolean(actionA || actionB);

  if (hasPad) root.appendChild(pad);
  if (hasActions) root.appendChild(actions);

  const fsBtn = showFullscreenToggle ? document.createElement("button") : null;
  if (fsBtn) {
    fsBtn.type = "button";
    fsBtn.className = "mobile-fs-btn";
    fsBtn.textContent = "⤢";
    fsBtn.title = "Plein écran";
    fsBtn.addEventListener("click", () => {
      const el = document.fullscreenElement;
      if (el) {
        document.exitFullscreen().catch(() => {});
      } else {
        (document.documentElement as any)?.requestFullscreen?.().catch(() => {});
      }
    });
    const fsWrap = document.createElement("div");
    fsWrap.style.pointerEvents = "all";
    fsWrap.style.alignSelf = "start";
    fsWrap.style.justifySelf = "end";
    fsWrap.appendChild(fsBtn);
    root.appendChild(fsWrap);
  }

  let gestureCleanup: (() => void) | undefined;
  let gestureEl: HTMLDivElement | undefined;
  if (hasDirections) {
    gestureEl = document.createElement("div");
    gestureEl.className = "mobile-gesture";
    gestureEl.style.background = "transparent";
    container.appendChild(gestureEl);
    gestureCleanup = bindGestureZone(gestureEl, mapping, input);
  }

  if (hasPad || hasActions || fsBtn) {
    container.appendChild(root);
  }

  const updateVisibility = (visible: boolean) => {
    root.classList.toggle("mc-hidden", !visible);
    root.style.display = visible ? "grid" : "none";
    if (gestureEl) {
      gestureEl.style.display = visible ? "block" : "none";
      gestureEl.style.pointerEvents = visible ? "all" : "none";
    }
  };

  updateVisibility(autoShow);

  return {
    show() {
      updateVisibility(true);
    },
    hide() {
      updateVisibility(false);
    },
    dispose() {
      root.remove();
      if (gestureEl?.parentElement) {
        gestureEl.remove();
      }
      gestureCleanup?.();
    },
  };
}
