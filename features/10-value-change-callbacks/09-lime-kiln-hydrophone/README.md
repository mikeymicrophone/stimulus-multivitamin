# Value change callbacks · 09 · Lime Kiln hydrophone

The hydrophone off Lime Kiln Point. The bearing readout follows every
change. The four-band plot waits until the head has been still for a
quarter of a second.

**What it teaches**

- `bearingValueChanged` writes the bearing text itself. That work is
  cheap, so it is not delayed.
- The band plot is scheduled with `setTimeout` and the previous timer
  is cleared on every callback. A swing assigns the bearing three times
  before the observer delivers the callbacks. Those callbacks run in one
  turn and leave a single timer. One plot follows.
- The first callback, on connect, also schedules a plot. `disconnect()`
  clears the timer.
- Bands are `round(abs(sin((bearing + band * 40) degrees)) * 100)` for
  bands 0 through 3.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The Lime Kiln watch |
| [`hydrophone_controller.js`](hydrophone_controller.js) | Bearing readout and the debounced plot |

**Try it**

The bearing opens "40°". The plot stays "No plot yet." until the delay
passes, then "Plot 1: 64, 98, 87, 34".

Swing the head. The bearing becomes "85°" before the next plot. After
the delay the plot is "Plot 2: 100, 82, 26, 42".
