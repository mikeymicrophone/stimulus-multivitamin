# Application setup and registration · 01 · Bush Point range board

The office at Bush Point keeps a watch on a meta element in the
head. The range board is a second application rooted on its own
section. A lamp on the shore wears the same identifier and never
connects.

**What it teaches**

- `Application.start()` with no element uses
  `document.documentElement`. A controller on `<meta>` in
  `<head>` connects. That meta is not inside `document.body`.
- `Application.start(document.body)` does not find the head
  watch. `getControllerForElementAndIdentifier` on that
  application is `null`.
- `Application.start(board)` watches the board and no more.
  The board element contains itself, so a controller on the
  root connects, and `application.element` is that board.
- The shore lamp is outside the board. Nobody registered
  `range-lamp` on an application that contains it, so it
  stays dark and its button does nothing.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three applications: document, body, and the board |
| [`office_clock_controller.js`](office_clock_controller.js) | Head watch, registered on the document and the body |
| [`range_board_controller.js`](range_board_controller.js) | Controller on the board root |
| [`range_lamp_controller.js`](range_lamp_controller.js) | Lamp inside the board |

**Try it**

The office clock reads "Office clock connected on HTML. In body:
false." The root note reads "Page found the head watch: true.
Body found the head watch: false." The board reads "Range board
connected. Root id is range-board." The board lamp reads "Board
lamp is lit." Log bearing 312. It reads "Bearing 312 logged."
The shore lamp stays "Shore lamp is dark." Logging it does not
change that line.
