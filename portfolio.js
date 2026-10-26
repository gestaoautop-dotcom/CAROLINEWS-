/* Accessible portfolio filters; all projects stay available without JavaScript. */
(function () {
  const section = document.getElementById('portfolio');
  if (!section) return;
  const buttons = section.querySelectorAll('[data-work-filter]');
  const cards = section.querySelectorAll('[data-work-tags]');
  const status = document.getElementById('work-status');
  function updateStatus() {
    const count = Array.from(cards).filter(function (card) { return !card.hidden; }).length;
    status.textContent = window.CWSLanguage ? window.CWSLanguage.projects(count) : count + ' projects shown.';
  }
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.dataset.workFilter;
      buttons.forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
      let count = 0;
      cards.forEach(function (card) {
        const show = filter === 'all' || card.dataset.workTags.split(' ').includes(filter);
        card.hidden = !show;
        if (show) count++;
      });
      updateStatus();
    });
  });
  document.addEventListener('cws:languagechange', updateStatus);
  updateStatus();
})();
