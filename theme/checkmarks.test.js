const test = require('node:test');
const assert = require('node:assert/strict');
const { chapterKey, knownKey, slugFromHref } = require('./checkmarks.js');

test('chapterKey namespaces the slug', () => {
  assert.equal(chapterKey('chapter_1'), 'mdbook-template:done:chapter_1');
});

test('knownKey namespaces the slug and the question position', () => {
  assert.equal(knownKey('chapter_1', 0), 'mdbook-template:known:chapter_1:0');
  assert.notEqual(knownKey('chapter_1', 1), knownKey('chapter_1', 0));
  assert.notEqual(knownKey('chapter_2', 0), knownKey('chapter_1', 0));
});

test('slugFromHref strips directories, extension, and anchors', () => {
  assert.equal(slugFromHref('chapter_1.html'), 'chapter_1');
  assert.equal(slugFromHref('nested/chapter_2.html#section'), 'chapter_2');
  assert.equal(slugFromHref('./chapter_1.html'), 'chapter_1');
});

test('done/known storage never throws when localStorage is unavailable', () => {
  const { isDone, setDone, isKnown, setKnown } = require('./checkmarks.js');
  const original = global.localStorage;
  global.localStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
  };
  assert.doesNotThrow(() => setDone('chapter_1', true));
  assert.equal(isDone('chapter_1'), false);
  assert.doesNotThrow(() => setKnown('chapter_1', 0, true));
  assert.equal(isKnown('chapter_1', 0), false);
  global.localStorage = original;
});
