const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const pairs = require('../translations.js');
const source = fs.readFileSync(require('node:path').join(__dirname, '../language.js'), 'utf8');
function visit(languages, saved, blocked = false) {
  const events = {}, docEvents = {}, selectEvents = {}, records = new Map();
  if (saved) records.set('cws-language', saved);
  const text = { nodeValue: 'About me', parentElement: { closest: () => false } };
  let read = false;
  const select = { value: '', addEventListener: (name, fn) => { selectEvents[name] = fn; } };
  const nav = { languages, language: languages[0] };
  const document = {
    title: 'My process | CWS', body: {}, documentElement: {},
    createTreeWalker: () => ({ nextNode: () => read ? null : (read = true, text) }),
    querySelectorAll: () => [], getElementById: () => select,
    dispatchEvent: event => { if (docEvents[event.type]) docEvents[event.type](event); }
  };
  const window = { CWSCopy: pairs, addEventListener: (name, fn) => { events[name] = fn; } };
  const storage = { getItem: k => { if (blocked) throw Error('Unavailable'); return records.get(k) || null; }, setItem: (k, v) => { if (blocked) throw Error('Unavailable'); records.set(k, v); }, removeItem: k => { if (blocked) throw Error('Unavailable'); records.delete(k); } };
  vm.runInNewContext(source, { window, document, navigator: nav, localStorage: storage, NodeFilter: { SHOW_TEXT: 4 }, CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } } });
  return { window, document, text, nav, records, events, choose(value) { select.value = value; selectEvents.change(); }, select };
}
let page = visit(['pt-BR', 'en-US']);
assert.equal(page.document.documentElement.lang, 'pt-BR'); assert.equal(page.text.nodeValue, 'Sobre mim');
page.choose('en'); assert.equal(page.text.nodeValue, 'About me'); assert.equal(page.records.get('cws-language'), 'en');
assert.equal(visit(['pt-BR'], page.records.get('cws-language')).document.documentElement.lang, 'en');
page.choose('auto'); assert.equal(page.text.nodeValue, 'Sobre mim'); assert.equal(page.records.has('cws-language'), false);
page.nav.languages = ['en-GB']; page.events.languagechange(); assert.equal(page.text.nodeValue, 'About me');
assert.equal(visit(['fr-FR']).document.documentElement.lang, 'en');
assert.equal(visit(['fr-FR', 'pt-PT']).document.documentElement.lang, 'pt-BR');
assert.equal(visit(['en-US'], 'invalid').document.documentElement.lang, 'en');
page = visit(['pt-BR'], undefined, true); page.choose('en'); assert.equal(page.document.documentElement.lang, 'en');
page = visit(['en-US']); page.events.storage({ key: 'cws-language', newValue: 'pt' }); assert.equal(page.text.nodeValue, 'Sobre mim');
assert.equal(page.window.CWSLanguage.modules(1), '1 módulo selecionado.');
page.choose('en'); assert.equal(page.window.CWSLanguage.projects(2), '2 projects shown.');
console.log('Passed: automatic detection, English fallback, manual selection, persistence, device changes, cross-tab changes, blocked storage and dynamic messages.');
