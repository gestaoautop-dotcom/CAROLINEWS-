/* English source, Portuguese alternative, and a remembered per-browser preference. */
(function () {
  const pairs = window.CWSCopy || [];
  const normalize = function (value) { return value.replace(/\s+/g, ' ').trim(); };
  const portuguese = new Map(pairs.map(function (pair) { return [pair[1], pair[0]]; }));
  const key = 'cws-language';
  const supported = function (value) { return value === 'en' || value === 'pt'; };
  let preference = 'auto';
  try { const saved = localStorage.getItem(key); if (supported(saved)) preference = saved; } catch (_) { /* Private browsing may block storage. */ }
  function deviceLanguage() {
    const languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (const item of languages) {
      const code = item.toLowerCase().split('-')[0];
      if (supported(code)) return code;
    }
    return 'en';
  }
  let language = preference === 'auto' ? deviceLanguage() : preference;
  const t = function (english) { return language === 'pt' ? portuguese.get(english) || english : english; };
  const dynamic = '#typed-text,#work-status,#demo-module-status,#demo-selected-modules,[data-language-ignore]';
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!node.parentElement || node.parentElement.closest('script,style,' + dynamic)) continue;
    const original = node.nodeValue;
    const value = normalize(original);
    if (portuguese.has(value)) texts.push({ node: node, original: original, value: value });
  }
  const attributes = [];
  document.querySelectorAll('[aria-label],[alt],[title],meta[name="description"]').forEach(function (element) {
    ['aria-label', 'alt', 'title', 'content'].forEach(function (name) {
      const value = element.getAttribute(name);
      if (value && portuguese.has(value)) attributes.push({ element: element, name: name, value: value });
    });
  });
  const originalTitle = document.title;
  const select = document.getElementById('site-language');
  window.CWSLanguage = {
    get current() { return language; },
    t: t,
    projects: function (count) { return language === 'pt' ? count + (count === 1 ? ' projeto exibido.' : ' projetos exibidos.') : count + (count === 1 ? ' project shown.' : ' projects shown.'); },
    modules: function (count) { return language === 'pt' ? count + (count === 1 ? ' módulo selecionado.' : ' módulos selecionados.') : count + (count === 1 ? ' module selected.' : ' modules selected.'); }
  };
  function apply() {
    language = preference === 'auto' ? deviceLanguage() : preference;
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    document.title = t(originalTitle);
    texts.forEach(function (item) {
      const leading = item.original.match(/^\s*/)[0];
      const trailing = item.original.match(/\s*$/)[0];
      item.node.nodeValue = language === 'en' ? item.original : leading + t(item.value) + trailing;
    });
    attributes.forEach(function (item) { item.element.setAttribute(item.name, t(item.value)); });
    if (select) select.value = preference;
    document.dispatchEvent(new CustomEvent('cws:languagechange', { detail: { language: language } }));
  }
  if (select) select.addEventListener('change', function () {
    preference = supported(select.value) ? select.value : 'auto';
    try { if (preference === 'auto') localStorage.removeItem(key); else localStorage.setItem(key, preference); } catch (_) { /* Keep the selection for this visit. */ }
    apply();
  });
  window.addEventListener('languagechange', function () { if (preference === 'auto') apply(); });
  window.addEventListener('storage', function (event) {
    if (event.key === key) { preference = supported(event.newValue) ? event.newValue : 'auto'; apply(); }
  });
  apply();
})();
