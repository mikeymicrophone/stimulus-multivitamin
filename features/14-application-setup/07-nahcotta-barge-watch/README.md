# Application setup and registration · 07 · Nahcotta barge watch

The oyster barge at Nahcotta unloads a hold, registers it
again, then stops the watch while the crew cuts that hold
loose and ties on a skiff.

**What it teaches**

- `application.unload(identifier)` disconnects that module
  and deletes it. The element stays in the document.
  `getControllerForElementAndIdentifier` returns `null`.
- `register` of the same identifier builds a new instance.
  `initialize` runs again, so the claim count goes from 1
  to 2. `connect` runs because the router is already going.
- `stop()` removes action listeners. It does not call
  `disconnect`. A hail while stopped does not change the
  hail line. The deck still says it is connected.
- Removing the hold and appending a skiff while stopped
  does not disconnect or connect anything yet.
- `await application.start()` refreshes the router. The
  removed hold disconnects. The skiff connects. The deck
  was never removed, so its connection count stays 1 and
  there is still one deck controller.
- A hail after that start works again.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Unload, stop, the cut, and start |
| [`oyster_hold_controller.js`](oyster_hold_controller.js) | Claims and disconnect |
| [`barge_deck_controller.js`](barge_deck_controller.js) | Connection count and hail |
| [`skiff_line_controller.js`](skiff_line_controller.js) | Connects on the later start |

**Try it**

The deck reads "Deck connected. Connections 1." Hails read
"Hails 0." The hold reads "Hold connected. Claims 1." Unload
the hold. The tape reads "Hold disconnected." The note reads
"Hold controller null." Register the hold again. The hold
reads "Hold connected. Claims 2." Stop the watch. The note
reads "Watch stopped." Hail the deck. Hails stay "Hails 0."
Cut the hold loose. The note reads "Hold cut loose. Skiff
tied. Watch has not started." The tape is still only "Hold
disconnected." The skiff reads "Skiff is tied and not
connected." Start the watch. The note reads "Deck connections
1. Was 1. Deck controllers 1." The tape reads "Hold
disconnected. Hold disconnected. Skiff connected." The skiff
reads "Skiff connected." Hail the deck. Hails read "Hails 1."
