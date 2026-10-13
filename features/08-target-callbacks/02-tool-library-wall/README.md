# Target callbacks · 02 · Tool library wall

Saturday hours at the church-basement tool library. The brace drill
and the drawknife are already on the pegboard. A neighbor checks in a
post hole digger after the wall has opened.

**What it teaches**

- `toolTargetConnected` runs for the tools in the markup before
  `connect()`. Those stamps read "on the wall at open".
- A tool appended later runs `toolTargetConnected` and does not run
  `connect()` again. The openings line stays at 1. The new stamp reads
  "checked in after the wall opened".
- The check-in action writes its status before the callback, and that
  sentence is left as it was: "Callback has run: no." The stamp on the
  tool is the callback. The same gap is why
  [target getters are already current before the callback](../../../DISCOVERIES.md#target-getters-query-the-dom-when-you-read-them).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Pegboard, check-in field, importmap, and registration |
| [`tool_wall_controller.js`](tool_wall_controller.js) | Stamps each tool and counts openings |

**Try it**

The brace drill and the drawknife both say "on the wall at open".
Opens is 1. The status names those two tools. Check in the tool. The
post hole digger says "checked in after the wall opened", the callback
log names all three, and the status still says the callback had not
run and that the wall has opened once.
