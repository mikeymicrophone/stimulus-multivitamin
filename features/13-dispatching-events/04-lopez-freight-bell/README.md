# Dispatching custom events · 04 · Lopez freight bell

Fisherman Bay. The freight desk places a call on itself, on
the shed bell, on the document, or on the window.

**What it teaches**

- `target` defaults to `this.element`. The event bubbles
  from the desk to the pier, then to document and window.
  The shed is inside the desk, so it is not up the bubble
  and stays quiet.
- `target: this.shedTarget` starts the bubble on the shed.
  The shed hears it, then the pier, the clerk, and the
  watch. The desk's own element is an ancestor of the shed,
  but the desk is not listening.
- `bubbles: false` on that same target is heard only by
  the shed.
- `target: document` is heard by the clerk and, because
  the default is `bubbles: true`, by the watch. The pier
  and the shed are not ancestors of `document`.
- `target: window` is heard only by the watch. The event
  does not travel down to document.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Pier, desk, shed, clerk, and watch |
| [`freight_desk_controller.js`](freight_desk_controller.js) | Picks the target |
| [`pier_log_controller.js`](pier_log_controller.js) | Ancestor listener |
| [`shed_bell_controller.js`](shed_bell_controller.js) | The element passed as `target` |
| [`document_clerk_controller.js`](document_clerk_controller.js) | `@document` |
| [`window_watch_controller.js`](window_watch_controller.js) | `@window` |

**Try it**

Everyone opens quiet, and the desk says "No call yet."
Call from the desk. The desk says "Started on the desk.
type freight-desk:called. bubbles true." The pier says
"Pier heard freight-desk:called from desk." The clerk says
"Clerk heard freight-desk:called on document from desk."
The watch says "Watch heard freight-desk:called on window
from desk." The shed stays "Shed is quiet." Call on the
shed. The shed says "Shed heard freight-desk:called from
shed." The pier, clerk, and watch all say "from shed."
Call the shed without bubbling. Only the shed says it
heard "from shed-still." The pier, clerk, and watch stay
quiet. Call on the document. The pier and the shed stay
quiet. The clerk and the watch say "from document." Call
on the window. Only the watch says "from window."
