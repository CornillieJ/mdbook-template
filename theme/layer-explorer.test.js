const test = require('node:test');
const assert = require('node:assert/strict');
const { LAYERS, renderLayers, detailFor } = require('./layer-explorer.js');

test('renders exactly one row per layer with a data-layer attribute', () => {
  const html = renderLayers(LAYERS);
  assert.equal((html.match(/data-layer="/g) || []).length, LAYERS.length);
  assert.ok(html.includes('Input Layer'));
  assert.ok(html.includes('Storage Layer'));
});

test('detailFor returns the annotations view by default', () => {
  const detail = detailFor(LAYERS, 'processing', 'annotations');
  assert.match(detail, /conventions/);
});

test('detailFor returns the files view when asked', () => {
  const detail = detailFor(LAYERS, 'processing', 'files');
  assert.match(detail, /src\/processing/);
});

test('detailFor returns null for an unknown layer id', () => {
  assert.equal(detailFor(LAYERS, 'nope', 'annotations'), null);
});
