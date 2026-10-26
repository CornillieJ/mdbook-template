// Book-wide settings for the theme widgets. Loaded FIRST (see book.toml),
// so every other script in theme/ can read window.BookConfig.
//
// This is the only JavaScript you need to touch when starting a new book.
(function () {
  var defaults = {
    // Prefix for every localStorage key the widgets write (level choice,
    // chapters marked done, "known" self-checks, ticked checklists, pace
    // chooser sliders). CHANGE THIS PER BOOK: two books served from the same
    // domain (e.g. two GitHub Pages sites under you.github.io) share one
    // localStorage, and would otherwise share each other's progress.
    storagePrefix: 'mybook',

    // Optional: the chapter slugs (file names without .md) that count
    // towards "N of M chapters done" when a reader marks a chapter done.
    // Leave it null and the list is taken from the last progress map
    // (<div data-progress-map>) the reader has seen; with neither, the
    // toast just says "Chapter done!".
    //   trackedChapters: ['example-chapter', 'components'],
    trackedChapters: null,

    // Optional: language folders in src/, for the language toggle in the
    // bottom-left corner. The toggle shows these names as they are written.
    // The first one is the default. null = a single-language book.
    // See "Languages" in CLAUDE.md for the folder layout.
    //   languages: ['EN', 'NL'],
    //   languageTitles: { EN: 'My Book', NL: 'Mijn boek' },  // top bar and tab title, optional
    //   readingTimeLabels: { NL: '~{n} min leestijd' },      // default '~{n} min read', optional
    languages: null,
  };

  if (typeof window === 'undefined') return;
  var existing = window.BookConfig || {};
  for (var k in defaults) {
    if (!(k in existing)) existing[k] = defaults[k];
  }
  window.BookConfig = existing;
})();
