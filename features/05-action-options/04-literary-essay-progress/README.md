# Action options · 04 · Literary essay progress

The Plover Review's reader for Imani Okonkwo's *Glass Eels on the
Damariscotta*. A bar above the essay tracks how far the visitor has
scrolled in the column.

**What it teaches**

- `:passive` is the native `{ passive: true }` listener option. The
  column declares `scroll->essay-progress#updateProgress:passive` so the
  browser can scroll without waiting to see whether JavaScript will call
  `preventDefault()`.
- The method only reads `scrollTop`. A `:passive` listener that did call
  `preventDefault()` would be ignored, and Chromium would warn on the
  console.
- The listener sits on the article, not on `window`. Scrolling the page
  around the essay does not move the bar.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Essay column, progress bar, importmap, and registration |
| [`essay_progress_controller.js`](essay_progress_controller.js) | Maps `scrollTop` to a percent and a passage label |

**Try it**

Scroll the essay column (not the whole page). The bar fills, the percent
updates, and the passage label moves from the weir at dawn through the
night watch and upriver. The status line mentions the `:passive`
listener. The page around the column can scroll too; that does not move
the bar.
