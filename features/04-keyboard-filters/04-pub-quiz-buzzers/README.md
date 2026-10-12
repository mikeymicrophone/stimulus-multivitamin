# Keyboard filters · 04 · Pub quiz buzzers

Round 3 at The Anchor & Quill. The table locks an answer to "Which river
runs through Cairo?" with A–D or 1–4 from anywhere on the page, except
while someone is typing the team name.

**What it teaches**

- `a`–`z` and `0`–`9` are built-in filters. `keydown.a@window` and
  `keydown.1@window` both lock in the Nile.
- The listeners sit on `window`, so they fire even while the team-name
  field has focus: `keydown` bubbles to `window`. `lockAnswer()` ignores
  the key when the event started in an input, otherwise typing "Aardvarks"
  would lock answer A.
- Caps Lock still matches `keydown.a`. Stimulus compares `event.key`
  case-insensitively, and Caps Lock does not set `shiftKey`. Shift+A does
  not match, because the filter did not name `shift`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Question, choices, team name, global filters, importmap, and registration |
| [`quiz_board_controller.js`](quiz_board_controller.js) | Locks A–D and 1–4 from `@window`, skipping the team-name field |

**Try it**

Press `A` or `1`: the Nile locks. Press "Host reveals" for the points.
Clear the lock, click the team name, and type `B`: the Thames does not
lock, because the action ignores keys that started in an input. Click
the question text and press `2` to lock the Thames from outside the field.
