# Action parameters · 07 · Field recording chapters

A harbor-seal reel for the coastal archive. Chapter buttons jump to a
start time, and the player skips by its own param when an arrow key is
pressed.

**What it teaches**

- `click->episode-player#jump:prevent` and
  `keydown.enter->episode-player#jump:prevent` on the same submit button
  both read `chapterTitle` and `startSeconds` from that button.
- `:prevent` keeps the click, and Enter, from submitting the chapter
  form. The keyboard filter runs first, so the keydown action cancels
  only Enter.
- `keydown.right` and `keydown.left` are declared on the player, so they
  read `skipSeconds` from the player. ArrowRight while a chapter button
  is focused still skips 15 seconds. The chapter's `startSeconds` stay
  on the button, which is not the element that declared the arrow action.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Player, chapters, notes form, importmap, and registration |
| [`episode_player_controller.js`](episode_player_controller.js) | Jumps and skips from `event.params` |

**Try it**

Click Tide pool: the position is 184 seconds, and the chapter form has not
submitted. Focus that chapter and press Enter: it jumps again, still
without submitting. Focus the player and press the right arrow: the
position moves 15 seconds, not to a chapter boundary. Save the notes with
the button beside the player to confirm that form still submits on a real
click.
