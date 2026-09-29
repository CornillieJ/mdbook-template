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
(callouts, checklists, tabs, the done-marks, etc.) follows.

## The JS widgets

Each widget is wired in via `book.toml`'s `additional-js` list — remove an
entry there (and its `<script>`-driven markup from your pages) to opt out:

- `levels.js` — the `.level-tabs`/`.level` overview/deep/drill tab pattern.
- `checkmarks.js` — per-chapter "mark done" + per-question "mark as known" state, persisted in `localStorage`, with sidebar checkmarks.
- `on-this-page.js` — a mini table-of-contents with scroll-spy highlighting, built from a page's `h2`/`h3` headings.
- `pace-chooser.js` — a multi-slider calculator with a live verdict; ships with placeholder example data in the file, meant to be replaced.
- `layer-explorer.js` — a clickable list with a detail panel and a view toggle; also ships with placeholder example data.

## Notes

- `preferred-dark-theme` (not `default-dark-theme`) is the correct `book.toml` key for this mdBook version (0.5.4).
- The on-this-page widget's CSS class is `.otp-nav`, not `.on-this-page` — the latter collides with mdBook 0.5.4's own built-in sidebar feature.
