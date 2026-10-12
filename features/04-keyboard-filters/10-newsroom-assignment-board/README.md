# Keyboard filters · 10 · Newsroom assignment board

The Marigold Dispatch's Monday assignment desk. Stories move between
Pitch, Reporting, Copy desk, and Published with Alt+arrows. Shift+Alt
jumps to an edge; Ctrl+Enter opens the focused story.

**What it teaches**

- Modifier combinations have to list every flag. `keydown.alt+left` moves
  one column; it does not match Alt+Shift+Left, because `shiftKey` is
  true. `keydown.shift+alt+left` jumps to Pitch. The order of `alt` and
  `shift` in the descriptor does not matter; both are looked up with
  `includes()`.
- `keydown.ctrl+enter` opens the story. Ctrl+Enter does not match Enter
  or Alt+Enter.
- Alt+ArrowLeft is Back in some browsers. The actions `preventDefault()`
  so the assignment board keeps the key.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Columns, stories, filters, importmap, and registration |
| [`assignment_board_controller.js`](assignment_board_controller.js) | Alt+arrows, Shift+Alt jumps, Ctrl+Enter to open |

**Try it**

Harbor crane collapse starts selected in Reporting. Press Alt+Right to
send it to Copy desk, Alt+Left to bring it back, Alt+Down to swap it
with School board overtime. Shift+Alt+Right jumps it to Published.
Ctrl+Enter opens the drawer; Escape closes it.
