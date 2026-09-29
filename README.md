# mdBook Template

A reusable starting point for mdBook projects: a pink/cyan/teal theme, five
small JS widgets, and a Docker setup, with nothing project-specific left in
it. Click "Use this template" on GitHub to start a new book from it.

## Usage

With Docker:

```sh
docker compose up --build
```

Then open `http://localhost:8080`.

Or locally, if you have [mdBook](https://rust-lang.github.io/mdBook/) installed:

```sh
mdbook serve
```

## Recoloring the theme

The design tokens live at the top of `theme/custom.css`, under `:root`:
`--pink`, `--cyan`, `--teal`, `--yellow`. Change those and every component
(callouts, checklists, tabs, the done-marks, etc.) follows. `--font-mono`,
`--muted`, and `--faint` are typography tokens (real IBM Plex Mono, loaded
via `theme/head.hbs` — mdBook includes this file in `<head>` automatically
if it's present, no `book.toml` entry needed) matching
[CornillieJ/sa](https://github.com/CornillieJ/sa)'s guide, which this
theme's `.toc`/`.callout-label` styling is a deliberate match for.

## The JS widgets

Each widget is wired in via `book.toml`'s `additional-js` list — remove an
entry there (and its `<script>`-driven markup from your pages) to opt out:

- `levels.js` — the `.level-tabs`/`.level` overview/deep/drill tab pattern.
- `checkmarks.js` — per-chapter "mark done" + per-question "mark as known" state, persisted in `localStorage`, with sidebar checkmarks.
- `on-this-page.js` — a left-side, fixed-in-place mini table-of-contents with scroll-spy highlighting, built from a page's `h2`/`h3` headings.
- `pace-chooser.js` — a multi-slider calculator with a live verdict; ships with placeholder example data in the file, meant to be replaced.
- `layer-explorer.js` — a clickable list with a detail panel and a view toggle; also ships with placeholder example data.

## Notes

- `preferred-dark-theme` (not `default-dark-theme`) is the correct `book.toml` key for this mdBook version (0.5.4).
- The on-this-page widget's CSS class is `.toc` (list id `#tocList`), not `.on-this-page` — the latter collides with mdBook 0.5.4's own built-in sidebar feature.
- `.level-tabs` and `.toc` are both `position: fixed` (computed in JS), not `position: sticky` — mdBook's own `#mdbook-content` wrapper has `overflow: auto` but never actually scrolls, which silently breaks `position: sticky` on any descendant.
- The "mark this chapter done" button is declared once per chapter in your Markdown, but `checkmarks.js` relocates it into `.level-tabs` at runtime so it stays reachable regardless of scroll position or which level tab is active.
- `on-this-page.js`'s active-item highlighting is a threshold scrollspy, not `IntersectionObserver` on the headings — a click-triggered jump can land a heading above an `IntersectionObserver` trigger band without ever crossing it. It also force-activates the last entry once you've scrolled to the end of the page, since a short final section can't otherwise be scrolled up far enough to activate normally.
