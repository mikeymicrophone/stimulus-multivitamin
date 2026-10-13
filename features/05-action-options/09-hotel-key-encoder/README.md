# Action options · 09 · Hotel key encoder

The Marlowe Inn's front desk. Jonah Ellison is checking into room 412.
Enter is supposed to encode a key card once. The first letter typed in
the guest field spends that listener instead.

**What it teaches**

- `:once` is `{ once: true }` on the native listener for that event name.
  It is not "the first time the keyboard filter matches".
- `keydown.enter@document->key-encoder#encodeFromEnter:once:prevent` still
  receives every `keydown`. The first key — a letter, Shift, Tab —
  invokes the listener. The filter then rejects it, `encodeFromEnter()`
  never runs, and the browser has already removed the listener. Later
  Enter does nothing.
- `click->key-encoder#encodeFromButton:once` is a different event, so it
  still encodes after the `keydown` listener is gone.
- A second action, `keydown@document->key-encoder#noteKey`, has no
  `:once` and keeps logging, which is how the desk can see that a
  non-Enter key spent the filtered listener.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Front desk fields, Encode button, importmap, and registration |
| [`key_encoder_controller.js`](key_encoder_controller.js) | Encodes from Enter or the button, and logs every keydown |

**Try it**

Click the guest field (it already says Jonah Ellison) and type an extra
letter, then press Enter: the key log shows the letter spending the
`:once` listener, and no card is encoded. Press Encode: the card encodes
from the click listener. Reload, don't type, and press Enter first: the
card encodes from Enter, once.
