# Writing Guide

This template is for three kinds of book: a tutorial that teaches something
end to end, a piece of project documentation, or a reference/knowledge base
people search rather than read start to finish. The widgets below work for
all three. The rules are what keep mdBook and the widgets happy. The word
list at the end is there because AI drafting tools have a house style of
their own, and it's not yours.

## Start a chapter

1. Copy `templates/chapter.md` (outside `src/`) to `src/your-chapter.md`.
2. Add it to `src/SUMMARY.md`, under the right part heading.
3. Add it to the progress map on the welcome page, if it is a chapter
   readers should finish (skip this for reference pages nobody "finishes").
4. Run `mdbook serve --open` and write with the page open beside you.

## Structure a chapter

Pick the shape that matches what the page is for. Don't force a tutorial
skeleton onto a reference page.

<div class="table-wrap">

| This page is... | Structure it as |
|---|---|
| A tutorial or walkthrough | Levels: **Overview** (what and why, 5 minutes), **Deep Understanding** (the mental model), **Drilling** (hands-on tasks, a quiz, the mark-done button) |
| Project documentation (how a system works, how to deploy it) | Flat `##`/`###` sections in the order someone would actually need them: setup first, then the thing itself, then the edge cases |
| Reference material (API list, config options, a glossary) | One long page, `##` per entry, alphabetical or grouped by feature — "On this page" picks the headings up automatically |

</div>

Levels are a tool for *pacing*, not a requirement. A reference page that
forces every entry through Overview/Deep/Drill just slows people down who
already know what they're looking for.

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
| compare support/status at a glance | compatibility matrix |
| show how something evolved over time | timeline |
| show equivalent ways to do the same thing | copy as |
| practice a decision, not just read about it | branching scenario |
| look up a term without losing their place | glossary term |
| get a command they can actually paste and run | fill-in-the-blank snippet |
| see what contains what | reference tree |
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
  Reference pages don't need one at all.
- **Don't rename published chapters** lightly: readers' progress is keyed
  by file name and would reset.

## Voice

Write like you're explaining it to the person sitting next to you, not
presenting it to a room.

<div class="table-wrap">

| Instead of | Write |
|---|---|
| "This section will delve into the configuration options." | "Here are the config options." |
| "Leverage the API to seamlessly integrate your workflow." | "Call the API from your own code." |
| "It's important to note that the cache can become stale." | "The cache can go stale." |
| "Whether you're a beginner or an experienced developer, this guide has you covered." | Pick one reader. Write for them. |
| "Simply click the button to get started." | "Click the button." (if it were simple, you wouldn't need the sentence) |
| "This powerful feature unlocks a world of possibilities." | Say what it actually does. |
| "In today's fast-paced development landscape..." | Delete. Start with the first real sentence. |

</div>

A few words and patterns to cut on sight, because they're the fingerprint
of AI-generated prose, not because they're "wrong" in some abstract sense:

<div class="table-wrap">

| Avoid | Why |
|---|---|
| delve, dive in, unpack, navigate, landscape, realm, tapestry | Filler that sounds like it means something |
| leverage, utilize, harness, foster, streamline | Use the plain verb: use, make, help, simplify |
| robust, seamless, powerful, cutting-edge, game-changing | Adjectives standing in for a missing fact |
| unlock, supercharge, elevate, take X to the next level | Marketing voice, not documentation voice |
| "It's not just X, it's Y" | Just say what it is |
| "Whether you're X or Y, ..." | Pick a reader and address them |
| "In today's world / fast-paced landscape" | Says nothing; delete the sentence |
| Em dashes doing the work a period should | Use a period. Or a comma. Rarely a dash. |
| A rhetorical question as a section opener ("But what does this really mean?") | Just answer it |
| Stacking "Additionally," "Furthermore," "Moreover" as paragraph openers | Cut the connector, keep the sentence |

</div>

None of this means writing has to be dry. It means every sentence should
survive the test "would I actually say this out loud to a colleague?" If
not, cut it or say it plainer.

- Lead with *why*, then *what*, then *how*.
- One idea per section. If a section needs two callouts, it is two sections.
- Show before you tell: a code compare or a table often replaces three
  paragraphs.
- Name the actual thing. "The config file" beats "this configuration",
  "the `deploy` button" beats "this feature."
- Tutorials end with something to *do*. Reference pages end with a link
  to whatever's related, not a call to action.

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
