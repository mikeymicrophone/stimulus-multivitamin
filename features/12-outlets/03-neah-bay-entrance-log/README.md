# Outlets · 03 · Neah Bay entrance log

The Makah entrance watch. The log is in the page before the Ediz
Hook and Waadah Island staffs. Slip Point can be hung later.
Closing the log does not take the staffs down.

**What it teaches**

- `tideStaffOutletConnected(outlet, element)` and
  `tideStaffOutletDisconnected(outlet, element)` run when a
  matching staff appears or disappears. The outlet name
  `tide-staff` becomes the `tideStaff` prefix.
- The staffs are later in the document than the log. The
  callback runs from the staff's startup, before that staff's
  `connect()`. `heightValue` is already readable. The watch
  flag, written in `connect()`, is still missing.
- Pulling Ediz removes the element. The staff's `disconnect()`
  runs, then the log's outlet callback sees the life string
  the disconnect wrote.
- Closing the log removes its controller token. The log's
  `disconnect()` runs first, while the outlet elements are
  still listed. The outlet callbacks follow. The staffs stay
  connected. See
  [The host's disconnect() runs before outletDisconnected, and the outlet stays up](../../../DISCOVERIES.md#the-hosts-disconnect-runs-before-outletdisconnected-and-the-outlet-stays-up).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The log, two staffs, importmap, and registration |
| [`entrance_log_controller.js`](entrance_log_controller.js) | Records outlet callbacks and closes the log |
| [`tide_staff_controller.js`](tide_staff_controller.js) | Height value and the watch flag |

**Try it**

The log opens with "Log connected." then "Ediz connected.
Height 6. Watch missing." then "Waadah connected. Height 4.
Watch missing." Ediz's own line says "Ediz watch set. Life c."
Waadah's line says "Waadah watch set. Life c." Pull the Ediz
staff. The log adds "Ediz outlet disconnected. Life cd. Watch
set." Ediz's line says "Ediz staff disconnect. Life cd." Hang
Slip Point. The log adds "Slip Point connected. Height 8.
Watch missing." and the new staff says "Slip Point watch set.
Life c." Close the log. The log adds "Log disconnect, outlets
still waadah slip-point." then a disconnected line for Waadah
and for Slip Point, each with life c. Both staffs still say
their watch is set.
