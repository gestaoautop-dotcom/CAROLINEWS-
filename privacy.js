(function () {
  'use strict';
  const key = 'cws-privacy-choice';
  let previousFocus = null;

  function readChoice() { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function saveChoice(value) {
    try { localStorage.setItem(key, value); } catch (_) {}
    window.dispatchEvent(new CustomEvent('cws:privacychange', { detail: { choice: value } }));
  }
  function closePanel() {
    const panel = document.getElementById('cws-privacy-panel');
    if (!panel) return;
    panel.remove();
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    previousFocus = null;
  }

  function openPreferences() {
    if (document.getElementById('cws-privacy-panel')) return;
    previousFocus = document.activeElement;
    if (!document.getElementById('cws-privacy-styles')) {
      const style = document.createElement('style');
      style.id = 'cws-privacy-styles';
      style.textContent = `
        .cws-privacy-panel{position:fixed;z-index:2147483647;bottom:18px;left:18px;right:18px;max-width:390px;margin:0 auto;padding:18px 20px 18px;box-sizing:border-box;background:#faf8f3;color:#192821;border:1px solid #e9e5db;border-radius:12px;box-shadow:0 12px 35px rgba(0,0,0,.22);font:400 13px/1.6 Montserrat,system-ui,sans-serif;overflow:hidden}
        .cws-privacy-top{display:grid;grid-template-columns:minmax(0,1fr) 94px;gap:8px;align-items:center;min-height:94px}
        .cws-privacy-eyebrow{margin:0 0 5px;color:#7b806e;font-size:9px;letter-spacing:.16em;text-transform:uppercase;font-weight:700}
        .cws-privacy-panel h2{font:600 18px/1.25 Montserrat,system-ui,sans-serif;letter-spacing:-.04em;margin:0 0 6px;color:#17281f}
        .cws-privacy-copy{margin:0 0 5px;color:#526059;font-size:11px;line-height:1.55}
        .cws-privacy-panel a{color:#446751;text-decoration:underline;text-underline-offset:3px;font-size:11px}
        .cws-cookie-scene{height:92px;position:relative;align-self:end;pointer-events:none;transform-origin:80% 95%;animation:cws-hand-in 550ms cubic-bezier(.18,.85,.3,1) both}
        .cws-cookie-scene svg{display:block;width:108px;height:100px;max-width:none;position:absolute;bottom:-3px;left:-5px;overflow:visible;filter:drop-shadow(0 7px 7px rgba(87,58,32,.14))}
        .cws-privacy-actions{display:grid;grid-template-columns:1.15fr 1fr;gap:8px;margin-top:11px;animation:cws-actions-in .32s ease .25s both}
        .cws-privacy-panel button{font:600 12px/1.35 Montserrat,system-ui,sans-serif;cursor:pointer;min-height:40px;border-radius:6px;transition:background-color .2s,transform .2s}
        .cws-privacy-accept{background:#28513e;color:white;border:1px solid #28513e}
        .cws-privacy-accept:hover{background:#356a51;transform:translateY(-1px)}
        .cws-privacy-essential{background:transparent;color:#294639;border:1px solid #aabaae}
        .cws-privacy-essential:hover{background:#eff4ee}
        .cws-privacy-x{position:absolute;right:12px;top:10px;width:32px;min-height:32px!important;border:0;background:none;color:#42554a;font-size:22px!important;z-index:1}
        .cws-privacy-panel :focus-visible{outline:3px solid #4e8768;outline-offset:3px}
        @keyframes cws-hand-in{from{opacity:0;transform:translate(36px,35px) rotate(8deg)}65%{opacity:1}to{opacity:1;transform:translate(0,0) rotate(0)}}
        @keyframes cws-actions-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:450px){.cws-privacy-panel{left:10px;right:10px;bottom:10px;padding:17px 15px}.cws-privacy-top{grid-template-columns:minmax(0,1fr) 72px;min-height:85px}.cws-cookie-scene{height:78px}.cws-cookie-scene svg{width:88px;height:82px;left:-9px}.cws-privacy-panel h2{font-size:17px}.cws-privacy-copy{font-size:11px}.cws-privacy-actions{grid-template-columns:1fr 1fr}}
        @media(prefers-reduced-motion:reduce){.cws-cookie-scene,.cws-privacy-actions{animation:none!important}.cws-privacy-panel button{transition:none!important}.cws-privacy-accept:hover{transform:none}}
      `;
      document.head.appendChild(style);
    }
    const panel = document.createElement('section');
    panel.id = 'cws-privacy-panel';
    panel.className = 'cws-privacy-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'cws-privacy-title');
    panel.setAttribute('aria-describedby', 'cws-privacy-description');
    panel.innerHTML = `
      <button class="cws-privacy-x" type="button" data-choice="close" aria-label="Close privacy notice">×</button>
      <div class="cws-privacy-top">
        <div class="cws-privacy-message">
          <p class="cws-privacy-eyebrow">PRIVACY</p>
          <h2 id="cws-privacy-title">Your privacy matters.</h2>
          <p class="cws-privacy-copy" id="cws-privacy-description">Essential preferences only. Optional cookies are off.</p>
          <a href="/privacy.html">Privacy policy</a>
        </div>
        <div class="cws-cookie-scene" aria-hidden="true">
          <svg viewBox="0 0 170 158" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="cws-biscuit" cx=".35" cy=".24" r=".8"><stop stop-color="#f6c87c"/><stop offset=".57" stop-color="#d89148"/><stop offset="1" stop-color="#93502d"/></radialGradient>
              <linearGradient id="cws-hand" x1="0" y1="0" x2="1" y2=".9"><stop stop-color="#f9d4b0"/><stop offset=".45" stop-color="#dfaa87"/><stop offset="1" stop-color="#b97960"/></linearGradient>
              <linearGradient id="cws-finger" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffdcbc"/><stop offset=".6" stop-color="#dda184"/><stop offset="1" stop-color="#ba7c67"/></linearGradient>
            </defs>
            <!-- The hand enters with the whole scene; all artwork remains decorative. -->
            <path d="M88 144c14-22 22-37 32-48 8-9 16-14 22-10 6 5 3 12-3 19-5 5-12 13-12 13 9-8 18-18 25-15 7 4 3 12-5 21l-12 15 31 21-8 16-70-11z" fill="url(#cws-hand)" stroke="#bd8268" stroke-width="1"/>
            <path d="M112 117c7-12 23-26 30-26 6 1 4 7-1 12l-24 27z" fill="url(#cws-finger)" stroke="#cf9777" stroke-width="1"/>
            <path d="M99 116c14 1 24 7 33 17 6 7 3 14-4 15-7 1-16-7-24-8l-27 9-16-21z" fill="url(#cws-hand)" stroke="#b97960" stroke-width="1.2"/>
            <path d="M69 151c14-12 28-17 45-12 12 3 21 12 31 15l19 8" fill="none" stroke="#f5c8a6" stroke-width="5" stroke-linecap="round" opacity=".7"/>
            <!-- Cookie has shaded volume and textured chocolate chips. -->
            <path d="M43 68c-4-9 2-17 10-18 3-9 13-14 21-10 10-7 22-1 25 8 11-3 21 4 22 14 10 9 8 22-2 30-1 13-13 21-25 19-8 7-20 6-27 0-12 4-25-3-27-16-9-7-8-20 3-27z" fill="url(#cws-biscuit)" stroke="#ab6a37" stroke-width="2"/>
            <path d="M48 78c7-7 20-5 27-13m11 31c8-2 15-10 22-12m-44 20 8-5" stroke="#ffdc9e" stroke-width="4" stroke-linecap="round" opacity=".6"/>
            <g fill="#66391f"><path d="m57 61 10-5 7 7-5 10-12-2z"/><path d="m89 52 11 0 3 10-10 4-6-7z"/><path d="m111 80 8 2-2 10-9-2z"/><path d="m68 92 12-3 4 9-12 4z"/><path d="m91 76 6-6 7 4-3 9z"/></g>
            <g fill="#88491f" opacity=".72"><circle cx="49" cy="84" r="3"/><circle cx="82" cy="47" r="2.6"/><circle cx="111" cy="67" r="3"/><circle cx="96" cy="99" r="2.5"/><circle cx="58" cy="102" r="2.5"/></g>
            <g fill="#f9f9f6" stroke="#b9a59a" stroke-width="1.7"><ellipse cx="70" cy="68" rx="12.2" ry="13.4"/><ellipse cx="99" cy="67" rx="12.2" ry="13.4"/></g>
            <g fill="#25221e"><circle cx="74" cy="70" r="6.5"/><circle cx="102" cy="69" r="6.5"/></g>
            <g fill="white"><circle cx="72" cy="66" r="2.3"/><circle cx="100" cy="65" r="2.3"/></g>
            <path d="M78 88q8 8 17-1" fill="none" stroke="#5b3327" stroke-width="2" stroke-linecap="round"/>
            <path d="m40 49-7-7m86 0 7-7m3 43 8 1" stroke="#af7e50" stroke-width="2.3" stroke-linecap="round" opacity=".8"/>
          </svg>
        </div>
      </div>
      <div class="cws-privacy-actions">
        <button class="cws-privacy-accept" type="button" data-choice="all">Accept all</button>
        <button class="cws-privacy-essential" type="button" data-choice="essential">Essential only</button>
      </div>`;
    panel.querySelectorAll('[data-choice]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.dataset.choice !== 'close') saveChoice(button.dataset.choice);
        closePanel();
      });
    });
    panel.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { event.preventDefault(); closePanel(); }
      if (event.key !== 'Tab') return;
      const focusables = Array.from(panel.querySelectorAll('a,button'));
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.body.appendChild(panel);
    panel.querySelector('.cws-privacy-accept').focus();
  }
  document.addEventListener('click', function (event) {
    if (event.target.closest('#cws-privacy-settings')) openPreferences();
  });
  function init() { if (!readChoice()) openPreferences(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();