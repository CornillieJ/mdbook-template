// Language toggle: a fixed pill in the bottom-left corner that switches the
// whole book between language folders (src/EN, src/NL, ...). The pill shows
// the folder names. Opt-in: with no `languages` in window.BookConfig this
// script does nothing.
//
// One mdBook, one SUMMARY.md. Every language has its own folder with the same
// file names, so the toggle can map `EN/it/plan.html` to `NL/it/plan.html`.
// This script then
//   - hides the sidebar entries, prev/next links and search hits of the
//     other languages, and numbers the visible chapters again from 1;
//   - sends the root page (src/README.md) to the reader's language;
//   - remembers the choice in localStorage (`<prefix>:language`).
// See "Languages" in CLAUDE.md for the folder and SUMMARY.md layout.
(function () {
  // Pure: the path under the site root, without a leading slash.
  function relativePath(pathname, rootPathname) {
    var root = rootPathname || '/';
    var rel = pathname.indexOf(root) === 0 ? pathname.slice(root.length) : pathname.replace(/^\//, '');
    return rel.replace(/^\/+/, '');
  }

  // Pure: the language folder a path lives in, or null (root page, 404, ...).
  function languageOf(rel, languages) {
    var first = String(rel || '').split('/')[0];
    return languages.indexOf(first) !== -1 && rel.indexOf('/') !== -1 ? first : null;
  }

  // Pure: the same page in another language. The root page maps to the
  // language's home page.
  function swapLanguage(rel, to, languages) {
    var from = languageOf(rel, languages);
    if (!from) return to + '/index.html';
    return to + rel.slice(from.length);
  }

  // Pure: language for sidebar rows that have no link of their own (part
  // titles, spacers). They take the language of the next row that has one.
  function fillLanguages(langs) {
    var out = langs.slice();
    var next = null;
    for (var i = out.length - 1; i >= 0; i--) {
      if (out[i] === undefined) out[i] = next;
      else next = out[i];
    }
    return out;
  }

  // Pure: the folder to start in, from the saved choice, then the browser
  // language, then the first folder.
  function preferredLanguage(saved, browserLanguages, languages) {
    if (saved && languages.indexOf(saved) !== -1) return saved;
    for (var i = 0; i < (browserLanguages || []).length; i++) {
      var code = String(browserLanguages[i]).slice(0, 2).toLowerCase();
      for (var j = 0; j < languages.length; j++) {
        if (languages[j].toLowerCase() === code) return languages[j];
      }
    }
    return languages[0];
  }

  // Pure: "1.", "2.", "2.1." labels for the numbered rows of a tree. A node
  // is { numbered: bool, children: [...] }. Returns the labels in the same
  // shape: { label: string|null, children: [...] }.
  function numberTree(nodes, prefix) {
    var count = 0;
    return nodes.map(function (node) {
      var label = null;
      if (node.numbered) {
        count += 1;
        label = (prefix || '') + count + '.';
      }
      return { label: label, children: numberTree(node.children || [], label || prefix || '') };
    });
  }

  function storage(action, key, value) {
    try {
      return action === 'get' ? window.localStorage.getItem(key) : window.localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  // Where this page sits: the site root, the path under it and its language.
  function locate(languages) {
    // mdBook declares path_to_root with const, so it is not on window.
    var toRoot = typeof path_to_root === 'string' ? path_to_root : '';
    var siteRoot = new URL(toRoot, window.location.href);
    var rel = relativePath(window.location.pathname, siteRoot.pathname);
    return { siteRoot: siteRoot, rel: rel, current: languageOf(rel, languages) };
  }

  // Runs while the page parses, so scripts that run later can read the language.
  function markLanguage() {
    var languages = (window.BookConfig || {}).languages;
    if (!languages || languages.length < 2) return;
    var current = locate(languages).current;
    if (!current) return;
    document.documentElement.lang = current.toLowerCase();
    document.documentElement.setAttribute('data-language', current);
  }

  function wire() {
    var config = window.BookConfig || {};
    var languages = config.languages;
    if (!languages || languages.length < 2) return;

    var where = locate(languages);
    var siteRoot = where.siteRoot;
    var rootPath = siteRoot.pathname;
    var rel = where.rel;
    var current = where.current;
    var storageKey = (config.storagePrefix || 'book') + ':language';

    function chooseLanguage(lang) {
      storage('set', storageKey, lang);
      var target = swapLanguage(rel, lang, languages);
      var home = lang + '/index.html';
      var go = function (path) { window.location.href = siteRoot.href + path + window.location.hash; };
      if (target === home) return go(target);
      fetch(siteRoot.href + target, { method: 'HEAD' })
        .then(function (res) { go(res.ok ? target : home); })
        .catch(function () { go(target); });
    }

    // The root page only exists to pick a language.
    if (!current && (rel === '' || rel === 'index.html')) {
      var start = preferredLanguage(storage('get', storageKey), window.navigator.languages, languages);
      window.location.replace(siteRoot.href + start + '/index.html' + window.location.hash);
      return;
    }

    if (current) {
      storage('set', storageKey, current);
      var title = (config.languageTitles || {})[current];
      if (title) {
        var menuTitle = document.querySelector('.menu-title');
        if (menuTitle) menuTitle.textContent = title;
        var cut = document.title.lastIndexOf(' - ');
        document.title = (cut === -1 ? '' : document.title.slice(0, cut + 3)) + title;
      }
    }

    buildToggle(languages, current, chooseLanguage);
    if (current) {
      whenSidebarReady(function (sidebar) { filterSidebar(sidebar, current, languages, siteRoot); });
      filterNavLinks(current, languages, rootPath);
      filterSearchResults(current, languages, rootPath);
    }
  }

  function buildToggle(languages, current, onPick) {
    var box = document.createElement('div');
    box.className = 'lang-toggle';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Language');
    languages.forEach(function (lang) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = lang;
      button.setAttribute('aria-pressed', lang === current ? 'true' : 'false');
      button.addEventListener('click', function () { if (lang !== current) onPick(lang); });
      box.appendChild(button);
    });
    document.body.appendChild(box);
  }

  function urlLanguage(href, languages, rootPath) {
    var rel = relativePath(new URL(href, window.location.href).pathname, rootPath);
    return languageOf(rel, languages);
  }

  // mdBook's toc.js fills the sidebar after parsing, so wait for its rows.
  function whenSidebarReady(done) {
    var sidebar = document.querySelector('mdbook-sidebar-scrollbox') || document.getElementById('mdbook-sidebar');
    if (!sidebar) return;
    if (sidebar.querySelector('ol.chapter')) return done(sidebar);
    var observer = new MutationObserver(function () {
      if (!sidebar.querySelector('ol.chapter')) return;
      observer.disconnect();
      done(sidebar);
    });
    observer.observe(sidebar, { childList: true, subtree: true });
  }

  function filterSidebar(sidebar, current, languages, siteRoot) {
    var rootPath = siteRoot.pathname;
    var list = sidebar.querySelector('ol.chapter');
    var rows = Array.prototype.slice.call(list.children);
    var own = rows.map(function (row) {
      var a = row.querySelector('a[href]');
      if (!a) return undefined;
      return urlLanguage(a.href, languages, rootPath);
    });
    var langs = fillLanguages(own);
    rows.forEach(function (row, i) {
      var empty = !row.textContent.trim();
      row.hidden = empty || langs[i] !== current;
    });

    // Number the visible chapters again. The home page of a language has no number.
    function toTree(ol) {
      return Array.prototype.filter.call(ol.children, function (li) {
        return li.matches('li.chapter-item') && !li.hidden && li.querySelector(':scope > .chapter-link-wrapper');
      }).map(function (li) {
        var a = li.querySelector(':scope > .chapter-link-wrapper > a');
        var isHome = relativePath(new URL(a.href).pathname, rootPath) === current + '/index.html';
        var sub = li.querySelector(':scope > ol.section');
        return { li: li, a: a, numbered: !isHome && !!a.querySelector('strong'), children: sub ? toTree(sub) : [] };
      });
    }
    function apply(nodes, labels) {
      nodes.forEach(function (node, i) {
        var strong = node.a.querySelector('strong');
        if (strong) {
          if (labels[i].label) strong.textContent = labels[i].label;
          else strong.remove();
        }
        apply(node.children, labels[i].children);
      });
    }
    var tree = toTree(list);
    apply(tree, numberTree(tree, ''));
  }

  function filterNavLinks(current, languages, rootPath) {
    // Remove, not hide: mdBook's arrow-key shortcuts still follow a hidden link.
    document.querySelectorAll('a[rel~="prev"], a[rel~="next"]').forEach(function (a) {
      if (urlLanguage(a.href, languages, rootPath) !== current) a.remove();
    });
  }

  function filterSearchResults(current, languages, rootPath) {
    var box = document.querySelector('[id$="searchresults"]');
    if (!box) return;
    new MutationObserver(function () {
      box.querySelectorAll('li').forEach(function (li) {
        var a = li.querySelector('a[href]');
        if (a) li.hidden = urlLanguage(a.href, languages, rootPath) !== current;
      });
    }).observe(box, { childList: true, subtree: true });
  }

  if (typeof document !== 'undefined') {
    markLanguage();
    document.addEventListener('DOMContentLoaded', wire);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      relativePath: relativePath,
      languageOf: languageOf,
      swapLanguage: swapLanguage,
      fillLanguages: fillLanguages,
      preferredLanguage: preferredLanguage,
      numberTree: numberTree,
    };
  }
})();
