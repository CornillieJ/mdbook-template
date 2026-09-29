(function () {
  // Placeholder example data — replace this with your own architecture layers.
  var LAYERS = [
    { id: 'input', label: 'Input Layer',
      annotations: 'Example: the conventions or annotations used at this layer',
      files: 'Example: where this layer\'s code lives, e.g. src/input/**' },
    { id: 'processing', label: 'Processing Layer',
      annotations: 'Example: the conventions or annotations used at this layer',
      files: 'Example: where this layer\'s code lives, e.g. src/processing/**' },
    { id: 'storage', label: 'Storage Layer',
      annotations: 'Example: the conventions or annotations used at this layer',
      files: 'Example: where this layer\'s code lives, e.g. src/storage/**' },
  ];

  function renderLayers(layers) {
    return layers.map(function (l, i) {
      return '<button class="layer-row" data-layer="' + l.id + '" aria-expanded="false">' +
        '<span class="layer-index">' + (i + 1) + '</span><span class="layer-label">' + l.label + '</span></button>';
    }).join('');
  }

  function detailFor(layers, id, view) {
    var layer = layers.filter(function (l) { return l.id === id; })[0];
    if (!layer) return null;
    return view === 'files' ? layer.files : layer.annotations;
  }

  function wire() {
    var widget = document.querySelector('[data-layer-explorer]');
    if (!widget) return;
    var rows = widget.querySelector('.le-rows');
    var detailEl = widget.querySelector('.le-detail');
    rows.innerHTML = renderLayers(LAYERS);
    var view = 'annotations';

    function showDetail(id) {
      Array.prototype.slice.call(rows.querySelectorAll('.layer-row')).forEach(function (btn) {
        btn.setAttribute('aria-expanded', btn.getAttribute('data-layer') === id ? 'true' : 'false');
      });
      detailEl.textContent = detailFor(LAYERS, id, view);
    }

    rows.addEventListener('click', function (e) {
      var btn = e.target.closest('.layer-row');
      if (!btn) return;
      showDetail(btn.getAttribute('data-layer'));
    });

    widget.querySelectorAll('.le-view-toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        view = btn.getAttribute('data-view');
        widget.querySelectorAll('.le-view-toggle button').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        var active = rows.querySelector('.layer-row[aria-expanded="true"]');
        if (active) showDetail(active.getAttribute('data-layer'));
      });
    });

    showDetail(LAYERS[0].id);
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', wire);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LAYERS: LAYERS, renderLayers: renderLayers, detailFor: detailFor };
  }
})();
