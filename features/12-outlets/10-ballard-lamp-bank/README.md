# Outlets · 10 · Ballard lamp bank

The large lock and the small lock are already lit. Hanging the
spare pulls the small lamp off the wall inside the outlet
callback. Recounting the bank is what finally logs that pull.

**What it teaches**

- `lockLampOutletConnected` runs for lamps that are already
  connected when the bank connects. Their `connect()` has
  finished, so life is `c`.
- The spare is inserted later. Its callback runs before the
  spare's `connect()`, so life is `none` in that line. The
  callback removes the small lamp while the selector observer
  is paused. The small lamp's own `disconnect()` still runs,
  because the scope observer is not paused. Life becomes `cd`.
  `lockLampOutletDisconnected` does not run. The outlet list
  is already `lamp-large` and `lamp-spare`.
- Recount sets the selector to `.lock-lamp, .lock-lamp`. That
  is a new attribute value and the same matches. The refresh
  notices the small lamp is gone and runs
  `lockLampOutletDisconnected` for an element that is already
  out of the document. See
  [A removal inside an outlet callback delays outletDisconnected](../../../DISCOVERIES.md#a-removal-inside-an-outlet-callback-delays-outletdisconnected).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two lamps and the bank |
| [`lamp_bank_controller.js`](lamp_bank_controller.js) | Hangs the spare and recounts |
| [`lock_lamp_controller.js`](lock_lamp_controller.js) | Writes life in connect and disconnect |

**Try it**

The large lamp says "large connect. Life c." The small lamp
says "small connect. Life c." The bank log opens "Connected
lamp-large. Life c." then "Connected lamp-small. Life c."
then "Bank outlets lamp-large lamp-small." Hang the spare.
The log adds "Connected lamp-spare. Life none." then "After
the hang, small life cd. In document false. Disconnected
callbacks 0. Outlets lamp-large lamp-spare." The small lamp's
card is gone. Recount the bank. The log adds "Disconnected
lamp-small. Life cd. In document false." then "After the
recount, disconnected callbacks lamp-small."
