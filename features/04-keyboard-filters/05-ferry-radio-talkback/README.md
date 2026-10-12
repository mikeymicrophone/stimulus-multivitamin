# Keyboard filters · 05 · Ferry radio talkback

Len Cho's desk at Portage Bay Ferry. Hold Space to talk to the Issaquah
wheelhouse; release to listen. Escape cancels an open transmission.

**What it teaches**

- Keyboard filters work on `keydown`, `keyup`, and `keypress`. The same
  Space key is wired three ways: `keydown.space` starts talkback,
  `keyup.space` ends it, `keypress.space` only writes to the event log.
- `keypress.esc` is declared too and never runs. Browsers do not fire
  `keypress` for Escape (or Tab, arrows, Home, End, PageUp, PageDown).
  `keydown.esc` is what cancels talkback.
- The built-in `space` filter maps to `event.key` `" "` (a space
  character), not `"Space"`. `keydown` repeats while the key is held;
  `startTalkback()` is a no-op when already transmitting.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Radio face, the three Space filters, Escape, importmap, and registration |
| [`ferry_radio_controller.js`](ferry_radio_controller.js) | Starts on `keydown.space`, ends on `keyup.space`, logs `keypress` |

**Try it**

Hold Space: the lamp goes TX and the log shows `keydown.space`, then
usually `keypress.space`. Release: `keyup.space` and the lamp goes RX.
Hold Space and press Escape: talkback cancels, and `keypress.esc` never
appears in the log. Type in the incident log: Space inserts a space
instead of opening the transmitter.
