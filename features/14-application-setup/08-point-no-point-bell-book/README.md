# Application setup and registration · 08 · Point No Point bell book

The book at Point No Point looks up bells by element and
identifier. The shore bell is outside the book, so it is not
this application's controller.

**What it teaches**

- `getControllerForElementAndIdentifier(element, identifier)`
  returns the instance on that element for that identifier,
  or `null`.
- The outer bell and the inner bell both use `fog-bell`.
  The lookup returns the one whose element you passed.
  They are not the same instance.
- The outer element also has `watch-flag`. That lookup
  returns the flag controller. Asking the inner bell for
  `watch-flag` is `null`. An identifier that was never
  registered is `null`.
- The application root is the book. The shore bell is
  outside it, so the lookup is `null` and the shore bell
  never connects. Its text stays "Shore bell is waiting."

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Book root, nested bells, shore bell |
| [`bell_book_controller.js`](bell_book_controller.js) | Reads the lookups into one line |
| [`fog_bell_controller.js`](fog_bell_controller.js) | Station name from a value |
| [`watch_flag_controller.js`](watch_flag_controller.js) | Second identifier on the outer bell |

**Try it**

The outer bell reads "Point No Point bell is connected." The
inner bell reads "Foulweather bell is connected." The shore
bell stays "Shore bell is waiting." Read the book. It reads
"Outer Point No Point. Inner Foulweather. Same outer false.
Watch watch-flag. Missing null. Shore null. Crossed null."
