# Keyboard filters · 02 · Clinic message composer

Nurse Priya Nandakumar's inbox at Riverside Family Clinic. She is
replying to Owen Havelock about a cholesterol draw. Enter in the note
sends the message; Shift+Enter keeps a newline.

**What it teaches**

- Keyboard filters match modifiers exactly. `keydown.enter` does not run
  for Shift+Enter, because `shiftKey` is true and the filter did not name
  `shift`. `keydown.shift+enter` is a separate descriptor.
- Both filters sit on the note `<textarea>`, not on the composer. Enter in
  the subject `<input>` never reaches them.
- `sendNote()` calls `preventDefault()` so Enter does not insert a newline.
  `insertLineBreak()` does not, so Shift+Enter keeps the browser's newline.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Chart header, thread, composer, importmap, and registration |
| [`clinic_message_controller.js`](clinic_message_controller.js) | Sends on Enter and leaves Shift+Enter to the textarea |

**Try it**

Focus the note and press Enter: the reply appears in the thread and the
note clears. Type another sentence, press Shift+Enter, and keep typing:
the newline stays. Focus the subject and press Enter: the note does not
send, because that field has no keyboard filter.
