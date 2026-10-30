(function () {
  'use strict';
  const key = 'cws-privacy-choice';
  let previousFocus = null;

  function readChoice() {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
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
    closePanel();
    previousFocus = document.activeElement;
    if (!document.getElementById('cws-privacy-styles')) {
      const style = document.createElement('style');
      style.id = 'cws-privacy-styles';
      style.textContent = `
        .cws-privacy-panel{position:fixed;z-index:2147483647;inset:auto 18px 18px;max-width:520px;margin:0 auto;padding:30px;background:#14221d;color:#f5f7f4;border:1px solid rgba(207,232,218,.23);border-radius:16px;box-shadow:0 20px 70px rgba(0,0,0,.36);font:400 14px/1.65 Montserrat,system-ui,sans-serif;letter-spacing:0}
        .cws-privacy-eyebrow{margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#9cb8a9}
        .cws-privacy-panel h2{font:600 clamp(21px,4vw,26px)/1.25 Montserrat,system-ui,sans-serif;letter-spacing:-.035em;color:#fff;margin:0 36px 12px 0}
        .cws-privacy-panel p.cws-privacy-copy{color:#c6d2ca;margin:0 0 13px}
        .cws-privacy-note{font-size:12px;color:#9fb2a7;margin:0 0 22px}
        .cws-privacy-panel a{color:#c2e7d4;text-decoration:underline;text-underline-offset:4px}
        .cws-privacy-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .cws-privacy-panel button{font:600 12px/1.35 Montserrat,system-ui,sans-serif;cursor:pointer;min-height:48px;border-radius:7px;transition:background-color .2s,border-color .2s}
        .cws-privacy-accept{grid-column:1/-1;background:#b8e5ce;color:#10281d;border:1px solid #b8e5ce;font-size:14px!important}
        .cws-privacy-accept:hover{background:#dbf5e5;border-color:#dbf5e5}
        .cws-privacy-essential{background:transparent;border:1px solid #648274;color:#e4f1ea}
        .cws-privacy-essential:hover{background:rgba(255,255,255,.08)}
        .cws-privacy-dismiss{background:transparent;border:1px solid transparent;color:#bccdc1}
        .cws-privacy-dismiss:hover{color:#fff;text-decoration:underline}
        .cws-privacy-x{position:absolute;right:16px;top:16px;width:36px;min-height:36px!important;border:0;background:transparent;color:#d9e5dd;font-size:22px!important}
        .cws-privacy-panel :focus-visible{outline:3px solid #d5f8df;outline-offset:3px}
        @media(max-width:540px){.cws-privacy-panel{inset:auto 10px 10px;padding:22px;border-radius:12px}.cws-privacy-actions{grid-template-columns:1fr}.cws-privacy-accept{grid-column:1}.cws-privacy-dismiss{min-height:36px!important}}
        @media(prefers-reduced-motion:reduce){.cws-privacy-panel button{transition:none}}
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
      <p class="cws-privacy-eyebrow">Privacy & transparency</p>
      <h2 id="cws-privacy-title">Your privacy matters.</h2>
      <p class="cws-privacy-copy" id="cws-privacy-description">We use essential browser preferences to make this website work for you. You can choose whether to allow optional cookies.</p>
      <p class="cws-privacy-note">No optional analytics or advertising cookies are currently active. <a href="/privacy.html">Privacy policy</a></p>
      <div class="cws-privacy-actions">
        <button class="cws-privacy-accept" type="button" data-choice="all">Accept all</button>
        <button class="cws-privacy-essential" type="button" data-choice="essential">Essential only</button>
        <button class="cws-privacy-dismiss" type="button" data-choice="close">Not now</button>
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