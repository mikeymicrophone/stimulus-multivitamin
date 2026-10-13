# Dispatching custom events · 10 · Admiralty pilot orders

The Wicklow hails off Admiralty Head. Five listeners answer,
and the tape records the order.

**What it teaches**

- Actions on the boat run first, in `data-action` order:
  `log`, then `bell`. The station (ancestor) is next. The
  order book (`@document`) is next. Window listeners are
  last. That is the same order a click uses.
- The two window listeners share one native listener.
  Bindings are sorted by action index. The late watch is
  later in the document, and its hail action is token 0.
  The early watch is earlier, and its hail action is token
  1 because a clear action comes first. Late runs before
  early: `late early`, not document order.
- `stopPropagation()` in `log` hides the event from the
  station, the book, and both watches. `bell` still runs.
- `stopImmediatePropagation()` also skips `bell`.
- Listeners push onto `detail.tape`. It is one array, so
  the boat can read it after `dispatch` returns.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Station, boat, watches, and book |
| [`pilot_boat_controller.js`](pilot_boat_controller.js) | Dispatches, and the two boat actions |
| [`pilot_station_controller.js`](pilot_station_controller.js) | Ancestor |
| [`order_book_controller.js`](order_book_controller.js) | `@document` |
| [`early_watch_controller.js`](early_watch_controller.js) | Window action at index 1 |
| [`late_watch_controller.js`](late_watch_controller.js) | Window action at index 0 |

**Try it**

The tape says "No hail yet." Station, book, and both
watches are quiet. Hail Wicklow. The tape says "manner
plain. tape log bell station book late early." The station
says "Station heard Wicklow." The book says "Book heard
Wicklow." The late watch says it heard the hail, and so
does the early watch. Hail and stop. The tape says
"manner stop. tape log bell." The station, the book, and
both watches say they are quiet. Hail and cut. The tape
says "manner immediate. tape log." Everyone else stays
quiet.
