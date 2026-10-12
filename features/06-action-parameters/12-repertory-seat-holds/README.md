# Action parameters · 12 · Repertory seat holds

The Lantern Repertory box office. Holding a seat reads its section, row,
and number, then waits a beat. The row around the seats has its own click
action and its own param.

**What it teaches**

- Stimulus assigns `event.params` on the shared event for each action.
  `hold()` captures the seat's object, then waits for a timer. The timer
  runs after the click finishes bubbling, and `event.params` is now the
  row's `houseNote`. The captured object still has the seat.
  `await Promise.resolve()` is too early on a real click: that microtask
  runs before the event reaches the row. A scripted `element.click()`
  runs the row first.
- `click->seat-hold#hold:stop` stops the click before `hold()` runs, so
  the row action does not replace the params. After the wait they are
  still the orchestra seat.
- The label is a `<span>` inside the button. `event.target` is the span.
  The seat params still come from the button.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The row, two seats, importmap, and controller registration |
| [`seat_hold_controller.js`](seat_hold_controller.js) | Holds a seat and reads `event.params` again after waiting |

**Try it**

Click the words Orchestra A4. The hold stays Orchestra A4 after the wait,
the target was SPAN, and the row has not noted a click. Click the words
Balcony C12. Before the wait the seat is Balcony C12. After the wait the
event's params are the house note “Balcony rail is loose”, and the captured
object still names Balcony C12.
