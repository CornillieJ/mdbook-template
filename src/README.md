# Welcome

This book is two things at once: a **starting point** for your own
interactive mdBook site, and the **documentation** for that starting
point. Every widget you see here is driven by plain HTML/Markdown in the
page, so writing a new book never means touching JavaScript.

<div class="callout rule">
<div class="callout-label">Try it</div>

Open the [example chapter](example-chapter.md), answer a quiz question,
flip a flashcard, then hit **Mark this chapter done** in the bar at the
top. Come back here and watch the map below light up.

</div>

## Your progress

<div data-progress-map data-title="Your journey">

- [HTTP caching in 20 minutes](example-chapter.md) A worked chapter with levels, quiz and flashcards
- [Component gallery](components.md) Every widget, live, with copy-paste markup
- [Writing guide](writing-guide.md) How to write pages that teach well

</div>

Progress lives in the reader's browser only (localStorage). Nothing is
sent anywhere.

## What you get

<div class="table-wrap">

| Piece | What it does |
|---|---|
| **Level tabs** | Overview / Deep / Drill versions of one chapter; the choice follows the reader |
| **Quiz** | Multiple choice with instant feedback, retries and a page scoreboard |
| **Flashcards** | Flip, "again", "got it", shuffle; keyboard friendly |
| **Code compare** | Two or more code blocks side by side, tabs on phones |
| **Self-checks** | Answer in your head, reveal, "Mark as known" |
| **Progress map** | The journey above, with "continue where you left off" |
| **Pace chooser** | Hours per week and weeks available become a week-by-week plan |
| **Layer explorer** | A clickable architecture stack with an animated request trace |
| **Callouts, checklists, tables** | Styled building blocks for everyday prose |

</div>

## Where to go next

1. [Example chapter](example-chapter.md): what a finished chapter looks like.
2. [Component gallery](components.md): every widget with its markup.
3. [Writing guide](writing-guide.md): how to structure chapters and the
   rules that keep mdBook happy.

<div class="callout note">
<div class="callout-label">Making it yours</div>

Change the title in `book.toml`, the `storagePrefix` in
`theme/book-config.js`, and the colors at the top of `theme/custom.css`.
Then copy `templates/chapter.md` into `src/` and start writing. The
repository README has the full checklist.

</div>
