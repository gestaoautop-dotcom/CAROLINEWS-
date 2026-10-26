/* Run after changing translations to keep the HTML's no-JavaScript default in English. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pairs = require(path.join(root, 'translations.js'));
const english = new Map(pairs);
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function translate(value) {
  const plain = decode(value).replace(/\s+/g, ' ').trim();
  if (!english.has(plain)) return value;
  return value.match(/^\s*/)[0] + escape(english.get(plain)) + value.match(/\s*$/)[0];
}
for (const file of ['index.html', 'services.html']) {
  const full = path.join(root, file);
  let html = fs.readFileSync(full, 'utf8');
  html = html.replace('<title>Mudra | Portfolio</title>', '<title>Caroline W. S. | Marca, Sites e Sistemas</title>');
  html = html.split(/(<!--[\s\S]*?-->|<[^>]+>)/g).map(part => {
    if (part.startsWith('<!--')) return part;
    if (part.startsWith('<')) return part.replace(/(aria-label|alt|content|data-demo-module)="([^"]*)"/g, (all, name, value) => name + '="' + translate(value).replace(/"/g, '&quot;') + '"');
    return translate(part);
  }).join('');
  html = html.replace('<html lang="pt-BR">', '<html lang="en">');
  fs.writeFileSync(full, html);
}
