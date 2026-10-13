# Target callbacks · 03 · Orchard frost lanterns

A clear night in the lower block. Each row already has its lantern.
Only Northern Spy starts clipped to the frost circuit. Wiring another
row does not hang a new lantern. It marks the one that is there.

**What it teaches**

- `lanternTargetConnected` runs for Northern Spy because the attribute
  is in the markup. The circuit list names it, and the watch opens once.
- Setting `data-frost-watch-target="lantern"` on Gravenstein or
  Ashmead's Kernel runs `lanternTargetConnected` for an element that
  was already in the row. The tree's own sentence stays.
- `removeAttribute` runs `lanternTargetDisconnected` and the element
  stays. The openings line does not advance. Wiring a lantern that
  already has the attribute changes nothing, because the attribute
  value did not change.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three rows, importmap, and registration |
| [`frost_watch_controller.js`](frost_watch_controller.js) | Keeps the circuit list from the callbacks |

**Try it**

The circuit starts as Northern Spy, and the watch has opened once.
Wire Gravenstein. The circuit names Northern Spy and Gravenstein, and
the Gravenstein sentence is still in the row. Unwire Northern Spy. The
circuit is only Gravenstein, the Northern Spy card is still there, and
the watch has still opened once.
