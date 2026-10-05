# Writing Guide

How to write pages that actually teach, and the handful of rules that
keep mdBook and the widgets happy.

## Start a chapter

1. Copy `templates/chapter.md` (outside `src/`) to `src/your-chapter.md`.
2. Add it to `src/SUMMARY.md`, under the right part heading.
3. Add it to the progress map on the welcome page, if it is a chapter
   readers should finish.
4. Run `mdbook serve --open` and write with the page open beside you.

## Structure a chapter

The template's shape is **Overview, Deep Understanding, Drilling**,
because readers arrive with different amounts of time and knowledge.

<div class="table-wrap">

| Level | Purpose | Put here |
|---|---|---|
| **Overview** | Why it matters and what "done" looks like, in 5 minutes | A short intro, an "After this chapter you can" list, one code compare or diagram |
| **Deep Understanding** | The mental model | `###` sections, tables, callouts for gotchas, a layer explorer |
| **Drilling** | Prove it | A checklist of hands-on tasks, a quiz, flashcards, self-checks, the mark-done button |

</div>

Not every page needs levels. Reference pages (a cheat sheet, a glossary)
read better as one long page with `##` headings, which "On this page"
picks up automatically.

## Choosing a widget

<div class="table-wrap">

| You want the reader to... | Use |
|---|---|
| notice a prerequisite, rule or trap | a callout (`setup`, `rule`, `danger`, `note`) |
| map something they know onto something new | code compare |
| do something outside the book | checklist |
| check understanding with feedback | quiz (3–5 per chapter, each with an explanation) |
| memorise vocabulary | flashcards |
| explain in their own words first | self-check (`.qa`) |
| see how parts fit together | layer explorer |
| understand real code line by line | code walkthrough |
| see an architecture, flow or ER diagram | a Mermaid diagram |
| see what changed in a small patch | diff view |
| practice a decision, not just read about it | branching scenario |
| plan their time | pace chooser (once, on a "how to use this book" page) |
| see how far they are | progress map (landing page) |

</div>

<div class="callout rule">
<div class="callout-label">Good quiz questions</div>

- Test a misconception, not a definition: the wrong options should be
  things a real learner believes.
- Keep options the same length and shape, so the right one doesn't stand out.
- Always write the `quiz-explain`: it is where the learning happens.

</div>

## The rules

<div class="callout danger">
<div class="callout-label">Blank lines around Markdown inside HTML</div>

CommonMark ends an HTML block at the first blank line. So when a `<div>`
should contain **Markdown**, put a blank line after the opening tag and
before the closing tag:

```html
<div class="callout note">
<div class="callout-label">Note</div>

This **is** Markdown.

</div>
```

Without the blank lines, everything inside is passed through as raw HTML.

</div>

- **Headings inside levels stay Markdown** (`### Title`), with blank lines
  around them. mdBook gives them ids, so they appear in "On this page"
  and the sidebar and can be linked to. A link to a heading inside a
  hidden level switches to that level automatically.
- **One level-tabs bar per page.** The bar is fixed to the top of the
  window; a second one would sit on top of the first.
- **Level names are fixed**: `overview`, `deep`, `drill`. Button text is
  free.
- **Widgets built from raw HTML** (quiz, flashcards, checklist, self-check,
  layer explorer, pace chooser) contain HTML, not Markdown: use `<code>`,
  `<strong>`, `<em>`, and write `&lt;` for a literal `<` (as in
  `List&lt;int&gt;`).
- **Code compare is the exception**: its code blocks are Markdown fences,
  so it needs the blank lines. The code walkthrough's fenced block +
  trailing `<ol>` of notes work the same way, and a Mermaid diagram is
  just a plain ` ```mermaid ` fence with no wrapper at all.
- **Progress map entries are Markdown links to `.md` files.** mdBook
  rewrites `.md` links to `.html` in Markdown, never inside raw HTML
  `href`s. The same goes for any link you write: prefer
  `[text](page.md)` over `<a href="page.html">`.
- **One mark-done button per chapter**, and give each chapter a unique
  file name: the file name is the key its progress is stored under.
- **Don't rename published chapters** lightly: readers' progress is keyed
  by file name and would reset.

## Voice and pacing

- Lead with *why*, then *what*, then *how*.
- One idea per section. If a section needs two callouts, it is two sections.
- Show before you tell: a code compare or a table often replaces three
  paragraphs.
- End every chapter with something to *do*.

## Check your work

```sh
mdbook build                      # must finish without warnings
node --test theme/*.test.js      # widget unit tests (npm test does the same)
mdbook serve --open               # click through every widget you used
```

Then open the page on a phone-sized window (DevTools device mode): tables
should scroll, code compares should become tabs, and the level bar should
stay on one line.

<button type="button" data-mark-done>Mark this chapter done</button>
