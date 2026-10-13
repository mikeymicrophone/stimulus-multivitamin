# Application setup and registration · 05 · Kalama elevator tape

The belt and the scale at Kalama are registered in the same
turn as `Application.start()`. The annex is registered later,
from a button, and its `afterLoad` seeds an oats bin.

**What it teaches**

- `Application.start()` awaits a microtask before the router
  scans, even when the document is already parsed. `register`
  in that same turn runs `afterLoad` while no controllers are
  connected yet. `connect` follows, in document order.
- Two early registrations both finish `afterLoad` before
  either `connect`.
- A `register` from the button is late. The annex element is
  already in the document, so it connects first, then
  `afterLoad` runs.
- `afterLoad` receives the identifier and the application.
  `this` is the constructor, so `this.binKind` is `"oats"`.
- The seeded bin is appended during `afterLoad`. It is not
  connected inside that hook. The mutation observer
  connects it afterwards, so "seeded connect." is the last
  line on the tape. The application root is the elevator,
  and the bin is appended inside it.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Elevator root, early registrations, the annex button |
| [`belt_controller.js`](belt_controller.js) | Early `afterLoad` |
| [`scale_controller.js`](scale_controller.js) | Second early registration |
| [`annex_controller.js`](annex_controller.js) | Late `afterLoad` that seeds the bin |
| [`tape.js`](tape.js) | Shared tape |

**Try it**

The tape reads "belt afterLoad. scale afterLoad. belt connect.
scale connect." The annex reads "Annex is mounted and not
connected." Open the annex. The tape reads "belt afterLoad. scale
afterLoad. belt connect. scale connect. annex connect. annex
afterLoad start oats. annex afterLoad end. seeded connect."
The annex reads "Annex connected." The seeded bin reads
"Seeded bin is waiting." Its connect wrote the tape and left
that text, because the seeded bin has no reading target.
