/* A mechanical claw turns a selected business challenge into a relevant solution. */
(function () {
  const section = document.getElementById('solutions');
  if (!section) return;
  const scene = section.querySelector('.claw-scene');
  const rig = section.querySelector('.claw-rig');
  const anchor = section.querySelector('.claw-grip-anchor');
  const buttons = Array.from(section.querySelectorAll('[data-claw-pain]'));
  const pauseButton = section.querySelector('.claw-pause');
  const answer = section.querySelector('.claw-answer');
  const live = section.querySelector('.claw-live');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const entries = {
    tools: ['Scattered tools', 'One connected workflow.', 'A custom system that brings the information, people and tasks your business needs into one flow.', 'metodo-necessidades'],
    position: ['Unclear positioning', 'A reason to choose your brand.', 'Clear positioning, a distinctive identity and a message that helps the right customers understand your value.', 'metodo-posicionamento'],
    manual: ['Manual work', 'Give repetitive work a better route.', 'Purposeful automations and custom workflows built around the tasks your team repeats every day.', 'metodo-necessidades'],
    leads: ['Lost leads', 'A clearer path from interest to contact.', 'A website with clear messaging, useful calls to action and an inquiry flow designed around your customers.', 'metodo-posicionamento'],
    website: ['Outdated website', 'A website for the business you are now.', 'A custom digital experience that reflects your identity, communicates your offer and works across screens.', 'metodo-branding'],
    rework: ['Constant rework', 'Shared direction. Fewer loose ends.', 'Brand guidelines, organized information and connected processes that help your team work with a consistent direction.', 'metodo-integracao']
  };
  let chosen = 'tools';
  let paused = false;
  let manual = false;
  let visible = false;
  let next = 0;
  let timer;
  let controller;
  const t = function (value) { return window.CWSLanguage ? window.CWSLanguage.t(value) : value; };
  function render(announce) {
    const entry = entries[chosen];
    answer.querySelector('.claw-answer-label').textContent = t(entry[0]);
    answer.querySelector('h3').textContent = t(entry[1]);
    answer.querySelector('.claw-answer-copy').textContent = t(entry[2]);
    const link = answer.querySelector('a');
    link.href = 'services.html#' + entry[3];
    link.replaceChildren(document.createTextNode(t('Explore the solution') + ' '));
    const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); link.append(arrow);
    buttons.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.clawPain === chosen)); });
    if (announce) live.textContent = t(entry[0]) + ': ' + t(entry[1]);
    pauseButton.textContent = t(reduced.matches ? 'Reduced motion' : paused || manual ? 'Resume animation' : 'Pause animation');
    pauseButton.disabled = reduced.matches;
    pauseButton.setAttribute('aria-pressed', String(paused || manual || reduced.matches));
  }
  function reset() {
    rig.classList.remove('is-gripping'); rig.style.setProperty('--rig-x', '0px'); rig.style.setProperty('--rig-y', '0px');
    rig.querySelectorAll('.claw-caught').forEach(function (item) { item.remove(); });
    buttons.forEach(function (button) { button.classList.remove('is-caught'); });
  }
  function cancel() { clearTimeout(timer); if (controller) controller.abort(); controller = null; reset(); }
  function wait(ms, signal) {
    return new Promise(function (resolve, reject) {
      if (signal.aborted) { reject(new Error('cancelled')); return; }
      const onAbort = function () { clearTimeout(timeout); reject(new Error('cancelled')); };
      const timeout = setTimeout(function () { signal.removeEventListener('abort', onAbort); resolve(); }, ms);
      signal.addEventListener('abort', onAbort, { once: true });
    });
  }
  function schedule(delay) {
    clearTimeout(timer);
    if (visible && !paused && !manual && !reduced.matches && !document.hidden) timer = setTimeout(function () {
      const button = buttons[next % buttons.length]; next++; grab(button, false);
    }, delay);
  }
  async function grab(button, fromUser) {
    cancel();
    if (fromUser) manual = true;
    chosen = button.dataset.clawPain;
    if (reduced.matches) { render(fromUser); return; }
    const current = new AbortController(); controller = current;
    const signal = current.signal;
    try {
      /* Wait for the rig to return before measuring the real responsive geometry. */
      await wait(550, signal);
      const box = button.getBoundingClientRect();
      const sceneBox = scene.getBoundingClientRect();
      const anchorBox = anchor.getBoundingClientRect();
      const deltaX = box.left + box.width / 2 - (sceneBox.left + sceneBox.width / 2);
      const deltaY = box.top + box.height / 2 - anchorBox.top;
      rig.style.setProperty('--rig-x', deltaX + 'px');
      await wait(450, signal);
      rig.style.setProperty('--rig-y', deltaY + 'px');
      await wait(580, signal);
      rig.classList.add('is-gripping');
      await wait(280, signal);
      const caught = document.createElement('span'); caught.className = 'claw-caught'; caught.textContent = t(entries[chosen][0]); rig.append(caught);
      button.classList.add('is-caught');
      rig.style.setProperty('--rig-x', '0px'); rig.style.setProperty('--rig-y', '-45px');
      render(fromUser);
      await wait(1500, signal);
      reset(); controller = null; schedule(3000);
    } catch (_) { /* Leaving the viewport, changing language or choosing another word cancels safely. */ }
  }
  buttons.forEach(function (button) { button.addEventListener('click', function () { grab(button, true); }); });
  pauseButton.addEventListener('click', function () {
    const resume = paused || manual;
    cancel(); paused = !resume; manual = false; render(false); if (resume) schedule(500);
  });
  const observer = new IntersectionObserver(function (items) {
    visible = items[0].isIntersecting;
    if (visible) schedule(1200); else cancel();
  }, { threshold: 0.2 });
  observer.observe(section);
  document.addEventListener('visibilitychange', function () { if (document.hidden) cancel(); else schedule(1200); });
  document.addEventListener('cws:languagechange', function () { cancel(); render(false); schedule(1600); });
  reduced.addEventListener('change', function () { cancel(); render(false); schedule(1200); });
  render(false);
})();
