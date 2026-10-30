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
    if (document.getElementById('cws-privacy-panel')) return;
    previousFocus = document.activeElement;
    if (!document.getElementById('cws-privacy-styles')) {
      const style = document.createElement('style');
      style.id = 'cws-privacy-styles';
      style.textContent = `
        .cws-privacy-panel{position:fixed;z-index:2147483647;bottom:18px;left:18px;right:18px;max-width:420px;margin:0 auto;padding:22px;box-sizing:border-box;background:#fff;color:#0b0f18;border:1px solid #cdd4de;border-radius:9px;box-shadow:0 16px 40px rgba(0,0,0,.22);font:400 13px/1.6 Montserrat,system-ui,sans-serif}
        .cws-privacy-eyebrow{margin:0 0 7px;color:#1c4b87;font-size:10px;letter-spacing:.14em;text-transform:uppercase;font-weight:700}
        .cws-privacy-panel h2{font:600 19px/1.3 Montserrat,system-ui,sans-serif;letter-spacing:-.03em;color:#0b0f18;margin:0 25px 8px 0}
        .cws-privacy-copy{margin:0 0 7px;color:#394250;font-size:12px;line-height:1.6}
        .cws-privacy-panel a{color:#184d9a;text-decoration:underline;text-underline-offset:3px;font-size:11px}
        .cws-privacy-actions{display:grid;grid-template-columns:1fr;gap:10px;margin-top:17px}
        .cws-privacy-panel button{font:600 12px/1.35 Montserrat,system-ui,sans-serif;cursor:pointer;min-height:46px;border-radius:4px;letter-spacing:.045em;transition:background-color .2s,border-color .2s}
        .cws-privacy-accept{background:#184d9a;color:#fff;border:1px solid #184d9a}
        .cws-privacy-accept:hover{background:#113b77;border-color:#113b77}
        .cws-privacy-essential{background:#fff;color:#0b0f18;border:1px solid #182337}
        .cws-privacy-essential:hover{background:#f3f6fa}
        .cws-privacy-x{position:absolute;right:10px;top:8px;width:34px;min-height:34px!important;border:0;background:transparent;color:#263141;font-size:22px!important;letter-spacing:normal!important;z-index:1}
        .cws-privacy-panel :focus-visible{outline:3px solid #5d8fe0;outline-offset:3px}
        @media(max-width:450px){.cws-privacy-panel{left:10px;right:10px;bottom:10px;padding:18px 16px}.cws-privacy-panel h2{font-size:18px}}
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
      <p class="cws-privacy-eyebrow">Privacy</p>
      <h2 id="cws-privacy-title">Your privacy matters.</h2>
      <p class="cws-privacy-copy" id="cws-privacy-description">We use essential preferences to keep this website working properly. Optional cookies are currently off.</p>
      <a href="/privacy.html">Privacy policy</a>
      <div class="cws-privacy-actions">
        <button class="cws-privacy-accept" type="button" data-choice="all">Accept All Cookies</button>
        <button class="cws-privacy-essential" type="button" data-choice="essential">Essential Only</button>
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
    panel.querySelector('.cws-privacy-essential').focus();
  }
  document.addEventListener('click', function (event) {
    if (event.target.closest('#cws-privacy-settings')) openPreferences();
  });
  function init() { if (!readChoice()) openPreferences(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();