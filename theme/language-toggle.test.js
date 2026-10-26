const test = require('node:test');
const assert = require('node:assert/strict');
const {
  relativePath, languageOf, swapLanguage, fillLanguages, preferredLanguage, numberTree,
} = require('./language-toggle.js');

const langs = ['EN', 'NL'];

test('relativePath strips the site root', () => {
  assert.equal(relativePath('/EN/it/plan.html', '/'), 'EN/it/plan.html');
  assert.equal(relativePath('/book/EN/it/plan.html', '/book/'), 'EN/it/plan.html');
  assert.equal(relativePath('/', '/'), '');
});

test('languageOf finds the language folder or null', () => {
  assert.equal(languageOf('EN/it/plan.html', langs), 'EN');
  assert.equal(languageOf('NL/index.html', langs), 'NL');
  assert.equal(languageOf('index.html', langs), null);
  assert.equal(languageOf('404.html', langs), null);
  assert.equal(languageOf('ENGLISH/a.html', langs), null);
  assert.equal(languageOf('EN', langs), null);
});

test('swapLanguage keeps the page and sends root pages to the home page', () => {
  assert.equal(swapLanguage('EN/it/plan.html', 'NL', langs), 'NL/it/plan.html');
  assert.equal(swapLanguage('NL/glossary.html', 'EN', langs), 'EN/glossary.html');
  assert.equal(swapLanguage('404.html', 'NL', langs), 'NL/index.html');
  assert.equal(swapLanguage('index.html', 'EN', langs), 'EN/index.html');
});

test('fillLanguages gives link-less rows the language of the next row with a link', () => {
  assert.deepEqual(fillLanguages([null, undefined, 'EN', 'EN', undefined, 'NL']), [null, 'EN', 'EN', 'EN', 'NL', 'NL']);
  assert.deepEqual(fillLanguages(['EN', undefined]), ['EN', null]);
});

test('preferredLanguage: saved choice, then browser language, then first folder', () => {
  assert.equal(preferredLanguage('NL', ['en-GB'], langs), 'NL');
  assert.equal(preferredLanguage('FR', ['nl-BE', 'en'], langs), 'NL');
  assert.equal(preferredLanguage(null, ['de'], langs), 'EN');
  assert.equal(preferredLanguage(null, undefined, langs), 'EN');
});

test('numberTree numbers again from 1 and nests', () => {
  const tree = numberTree([
    { numbered: false, children: [] },
    { numbered: true, children: [] },
    { numbered: true, children: [{ numbered: true, children: [] }, { numbered: true, children: [] }] },
  ], '');
  assert.deepEqual(tree.map((n) => n.label), [null, '1.', '2.']);
  assert.deepEqual(tree[2].children.map((n) => n.label), ['2.1.', '2.2.']);
});
