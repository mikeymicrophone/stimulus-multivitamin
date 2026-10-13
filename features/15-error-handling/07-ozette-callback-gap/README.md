# Error handling · 07 · Ozette callback gap

The tide book, range lamp, and horn desk at Ozette throw from
callbacks `handleError` never sees.

**What it teaches**

- `slipTargetConnected` numbers a slip and then throws.
  Handled stays "No handled error." The fault line reads
  `slip card tore`. The next slip stays "Slip 2 unnumbered."
  because the target observer is not restarted. See
  [The target observer is paused while the callback runs](../../../DISCOVERIES.md#the-target-observer-is-paused-while-the-callback-runs).
- `bearingValueChanged` throws when the bearing becomes
  `foul`. That throw is after connect, so it is an error
  event, not `handleError`, and not an unhandled rejection.
  See
  [A throw from a value callback skips the rest of the connect scan](../../../DISCOVERIES.md#a-throw-from-a-value-callback-skips-the-rest-of-the-connect-scan).
  The connect-time skip, which this page does not repeat, is
  the hatchery fax at Totten Inlet.
- `passBellOutletConnected` throws after the desk has
  connected. The desk reads "Bell tied." Handled stays quiet.
  See
  [A throw from an outlet callback skips the rest of the connect scan](../../../DISCOVERIES.md#a-throw-from-an-outlet-callback-skips-the-rest-of-the-connect-scan).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Handled line, fault line, three cards |
| [`tide_book_controller.js`](tide_book_controller.js) | Target callback |
| [`range_lamp_controller.js`](range_lamp_controller.js) | Value callback |
| [`horn_desk_controller.js`](horn_desk_controller.js) | Outlet callback |
| [`pass_bell_controller.js`](pass_bell_controller.js) | The outlet |

**Try it**

The tide book, range lamp, and horn desk each say they
connected. The range lamp's reading is replaced by connect,
so it reads "Range lamp connected." Handled reads "No
handled error." Fault reads "No fault." Add the torn slip.
Slip 1 reads "Slip 1 numbered." Fault reads `slip card tore`.
Handled is unchanged. Add the next slip. Slip 2 reads
"Slip 2 unnumbered." Foul the bearing. The lamp reads
"Bearing went foul." Fault gains `bearing foul`. Tie the
pass bell. The desk reads "Bell tied." The bell reads
"Pass bell connected." Fault gains `bell cord parted`.
Handled still reads "No handled error."
