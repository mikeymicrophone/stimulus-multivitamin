# Dispatching custom events · 11 · Smith Island tide drum

The drum sets as it connects. The west striker arms after
that. An east striker can be hung later. Pulling the west
striker, then the drum, shows what a dispatch can still reach.

**What it teaches**

- With both controllers registered before `start()`, the
  parent connects first. `tide-drum:set` from the drum's
  `connect()` has no striker listener yet. The striker's
  line stays "Heard the set: no."
- The striker dispatches `tide-striker:armed` from its own
  `connect()`. Listeners are already bound, so it hears
  itself, and the drum hears it too.
- Hanging the east striker connects it on a later turn.
  The page ear and the west striker hear `east`. East
  hears only itself. It missed `west`.
- The line after `remove()` still finds the controller.
  `isConnected` is already false. The disconnect dispatch
  runs on the microtask after that. A bubble from the
  detached striker does not reach the drum. The same
  event aimed at the drum element saved in `connect()`,
  with `bubbles: false`, does. The window copy reaches
  the page ear.
- Removing the drum disconnects the drum first, then the
  striker. During the drum's `disconnect()` the east
  striker is still connected, so it hears
  `tide-drum:goodbye` on the window. The striker's later
  window `leaving` is not heard by the drum. The page ear
  hears both the goodbye and the leaving. The order line
  is `striker west drum striker east`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Page ear, drum, west striker, and the east template |
| [`tide_drum_controller.js`](tide_drum_controller.js) | Dispatches from `connect()` and `disconnect()` |
| [`tide_striker_controller.js`](tide_striker_controller.js) | Arms on connect, aims leaving at the saved drum |
| [`page_ear_controller.js`](page_ear_controller.js) | Window listener that outlives the drum |

**Try it**

The drum says "Set went out before the striker was
listening. Drum heard armed west." The west striker says
"Striker west armed. Heard the set: no. Heard armed:
west." The page ear says "Page armed west." Order, leaving,
and goodbye are still none. Hang the east striker. The
east line says "Striker east armed. Heard the set: no.
Heard armed: east." The west line now says "Heard armed:
west east." The drum says "Drum heard armed west east."
The page ear says "Page armed west east." Pull the west
striker. The sync line says "Just removed. isConnected
false. controller yes." After it settles, the after line
says "Settled. heard via drum for west." The drum leaving
line says "Drum leaving heard via drum for west." The page
leaving line says "Page leaving window west." Order says
"Order striker west." Pull the drum. The witness says
"east heard the drum goodbye." The page goodbye says
"Page heard goodbye from drum." Order says "Order striker
west drum striker east." Page leaving says "Page leaving
window west, window east."
