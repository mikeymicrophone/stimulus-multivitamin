# Value change callbacks · 08 · Coupled fog bells

Slip Point and Waadah Island, with their fog-bell intervals tied
together. One pair chases. The other refuses to write a value it
already has.

**What it teaches**

- The value observer is not paused while a callback runs. A callback
  that assigns a different value schedules another callback. Nothing
  in Stimulus stops a pair that each write a new number. See
  [A value callback can schedule another](../../../DISCOVERIES.md#a-value-callback-can-schedule-another).
- The unguarded pair starts at 1 and 1. Slip Point's first callback
  sets Waadah to 2 before Waadah's own first callback, so the chalked
  1 on Waadah never appears. The chase then continues one step at a
  time until the ninth strike, which logs the interval and cuts the
  chase instead of writing again.
- The guarded pair writes the other bell only when
  `this.otherValue !== interval`. Both start at 5, so the first pass
  logs two lines and stops. Striking Slip Point to 8 writes Waadah
  once. Waadah sees Slip Point already at 8 and does not write back.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Both pairs |
| [`unguarded_bells_controller.js`](unguarded_bells_controller.js) | The chase |
| [`guarded_bells_controller.js`](guarded_bells_controller.js) | The guard |

**Try it**

The unguarded log is: Slip Point 1. Waadah Island 2. Slip Point 3.
Waadah Island 4. Slip Point 5. Waadah Island 6. Slip Point 7. Waadah
Island 8. Slip Point 9. Cut the chase.

The guarded log opens "Slip Point 5." then "Waadah Island 5." Strike
Slip Point to 8 seconds. The log adds "Slip Point 8." then "Waadah
Island 8." and stops.
