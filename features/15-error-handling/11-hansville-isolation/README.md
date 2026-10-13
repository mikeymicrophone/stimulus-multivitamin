# Error handling · 11 · Hansville isolation

One throwing controller does not decide the whole page.
Where it throws does.

**What it teaches**

- `mid-lamp` throws from `connect()`. Handled records
  `Error connecting controller | mid-lamp | mid lamp cracked`.
  The shore bell before it and the point clock after it
  connect. Trimming the lamp still runs. See
  [A throw in `initialize()` still connects, a throw in `connect()` leaves actions live, and a throw in `disconnect()` still stops them](../../../DISCOVERIES.md#a-throw-in-initialize-still-connects-a-throw-in-connect-leaves-actions-live-and-a-throw-in-disconnect-still-stops-them).
- The fax menu is `chowder, pilot bread`. That is the
  Totten Inlet failure: the value callback throws
  `SyntaxError` before `connect()`, `handleError` is not
  called, and every later controller is skipped. See
  [A throw from a value callback skips the rest of the connect scan](../../../DISCOVERIES.md#a-throw-from-a-value-callback-skips-the-rest-of-the-connect-scan).
- The fax is still in the application's controller list,
  because the binding observer started before the value
  observer threw. The fax button rings. The after bell
  stays "After bell is waiting." See
  [A value-callback throw during connect leaves that controller's actions live](../../../DISCOVERIES.md#a-value-callback-throw-during-connect-leaves-that-controllers-actions-live).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Five stations in document order |
| [`shore_bell_controller.js`](shore_bell_controller.js) | Before the connect throw |
| [`mid_lamp_controller.js`](mid_lamp_controller.js) | Throws in `connect()` |
| [`point_clock_controller.js`](point_clock_controller.js) | Still connects |
| [`bad_fax_controller.js`](bad_fax_controller.js) | Bad JSON, action still bound |
| [`after_bell_controller.js`](after_bell_controller.js) | Skipped |

**Try it**

The shore bell reads "Shore bell connected." The mid lamp
reads "Mid lamp entered connect." The point clock reads
"Point clock connected." The fax stays "Fax is waiting."
The after bell stays "After bell is waiting." Handled is
only the mid-lamp connect line. The rejection reads
`Unexpected token 'c', "chowder, pilot bread" is not valid JSON`.
Ring the shore bell. It reads "Shore bell rang." Trim the
mid lamp. It reads "Mid lamp trimmed." Tick the point clock.
It reads "Point clock ticked." Ring the fax button. It reads
"Fax button rang." Ring the after bell. Button clicks 1.
The after bell still reads "After bell is waiting."
