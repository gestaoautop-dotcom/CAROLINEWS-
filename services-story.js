/* The story follows scrolling on desktop and an explicit step selector on mobile. */
(function () {
  const story = document.getElementById('business-story');
  if (!story) return;
  const chapters = Array.from(story.querySelectorAll('[data-story-step]'));
  const panels = Array.from(story.querySelectorAll('[data-story-panel]'));
  const controls = story.querySelector('.story-controls');
  const buttons = Array.from(story.querySelectorAll('[data-story-go]'));
  const mobile = window.matchMedia('(max-width: 767px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let frame = 0;
  function show(index) {
    active = Math.max(0, Math.min(index, chapters.length - 1));
    panels.forEach(function (panel, i) { panel.hidden = i !== active; });
    chapters.forEach(function (chapter, i) { chapter.classList.toggle('is-story-active', i === active); });
    buttons.forEach(function (button, i) { button.setAttribute('aria-pressed', String(i === active)); });
    document.getElementById('story-counter').textContent = String(active + 1).padStart(2, '0') + ' — 05';
  }
  function followScroll() {
    frame = 0;
    if (mobile.matches) return;
    const target = window.innerHeight * 0.46;
    let closest = 0;
    let distance = Infinity;
    chapters.forEach(function (chapter, i) {
      const box = chapter.getBoundingClientRect();
      const current = Math.abs(box.top + box.height / 2 - target);
      if (current < distance) { distance = current; closest = i; }
    });
    if (closest !== active) show(closest);
  }
  function scheduleScroll() {
    if (!frame && !mobile.matches) frame = window.requestAnimationFrame(followScroll);
  }
  buttons.forEach(function (button, index) {
    button.addEventListener('click', function () {
      show(index);
      if (!mobile.matches) chapters[index].scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
    });
  });
  const palette = {
    forest: ['#274f40', '#dce6db', '#172b24'],
    blue: ['#244a78', '#dde6f0', '#172b42'],
    clay: ['#874936', '#f0e0d7', '#40261e']
  };
  const colorButtons = Array.from(story.querySelectorAll('[data-demo-color]'));
  colorButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const colors = palette[button.dataset.demoColor];
      story.style.setProperty('--demo-accent', colors[0]);
      story.style.setProperty('--demo-light', colors[1]);
      story.style.setProperty('--demo-ink', colors[2]);
      colorButtons.forEach(function (other) { other.setAttribute('aria-pressed', String(button === other)); });
    });
  });
  const moduleButtons = Array.from(story.querySelectorAll('[data-demo-module]'));
  function renderModules() {
    const selected = moduleButtons.filter(function (button) { return button.getAttribute('aria-pressed') === 'true'; });
    const list = document.getElementById('demo-selected-modules');
    list.replaceChildren();
    selected.forEach(function (button) {
      const row = document.createElement('span');
      row.append(document.createTextNode(button.dataset.demoModule));
      const arrow = document.createElement('b');
      arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); row.append(arrow); list.append(row);
    });
    if (!selected.length) { const row = document.createElement('span'); row.textContent = 'Escopo a definir'; list.append(row); }
    document.getElementById('demo-module-status').textContent = selected.length + (selected.length === 1 ? ' módulo selecionado.' : ' módulos selecionados.');
  }
  moduleButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const pressed = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!pressed));
      button.querySelector('span').textContent = pressed ? '+' : '✓';
      renderModules();
    });
  });
  story.classList.add('story-enhanced');
  controls.hidden = false;
  show(0);
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  mobile.addEventListener('change', function () { show(active); scheduleScroll(); });
  followScroll();
})();
