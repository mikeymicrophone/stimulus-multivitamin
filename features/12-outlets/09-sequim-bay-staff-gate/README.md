# Outlets · 09 · Sequim Bay staff gate

Two gates. The early gate is before the Travis staff and reads
`bayStaffOutlets` while connecting. The late gate is after the
Gibson staff and reads only the element list.

**What it teaches**

- `bayStaffOutletConnected` runs before the outlet's
  `connect()` when the staff is later in the document and the
  host reads the controller getter. Travis's latch is missing
  in that callback. Values are not the issue here; the latch
  is instance state written in `connect()`. After the getter
  returns, Travis has connected and the latch is set.
- That read calls the internal connect for a controller the
  scope observer has not counted yet. Pulling Travis fires
  `bayStaffOutletDisconnected` and does not run Travis's
  `disconnect()`. Life stays `c`. Putting Travis back fires
  the callback again, with the latch already set, and does
  not run `connect()` a second time.
- The late gate reads `hasBayStaffOutlet` and
  `bayStaffOutletElements` only. Gibson connected on its own.
  The callback sees the latch. Pulling Gibson runs
  `disconnect()` and life becomes `cd`. See
  [Reading the outlet controller in connect() keeps it alive after removal](../../../DISCOVERIES.md#reading-the-outlet-controller-in-connect-keeps-it-alive-after-removal).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two gates and two staffs |
| [`staff_gate_controller.js`](staff_gate_controller.js) | The early read and the late read |
| [`bay_staff_controller.js`](bay_staff_controller.js) | Latch, life, connect, and disconnect |

**Try it**

The early log opens "Early connect start." then "Travis
callback. Latch missing. Life none." then "Early connect
outlets travis latch set." Travis's card says "Travis connect.
Latch set. Life c." The late log opens "Gibson callback. Latch
set. Life c." then "Late connect has true. Elements gibson
latch set." Gibson's card says "Gibson connect. Latch set.
Life c." Pull Travis. The early log adds "Travis disconnected.
Life c." Travis's card is gone. Put Travis back. The log adds
"Travis callback. Latch set. Life c." and the card still says
"Travis connect. Latch set. Life c." Pull Gibson. The late log
adds "Gibson disconnected. Life cd." and Gibson's card says
"Gibson disconnect. Life cd."
