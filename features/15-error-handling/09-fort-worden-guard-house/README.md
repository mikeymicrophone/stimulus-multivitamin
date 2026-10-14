# Error handling · 09 · Fort Worden guard house

The slip board at Fort Worden checks the guards before it
reads. Three unguarded reads are reported. A caught drift
is not.

**What it teaches**

- `hasAdvisoryTarget`, `hasTideFeetValue`, `hasAlarmClass`,
  and `hasBellOutlet` are false. The status line is built
  without the singular getters. See
  [The singular target throws when it is missing; the plural and the has-property do not](../../../DISCOVERIES.md#the-singular-target-throws-when-it-is-missing-the-plural-and-the-has-property-do-not),
  [The singular class throws only when the attribute is absent](../../../DISCOVERIES.md#the-singular-class-throws-only-when-the-attribute-is-absent),
  and
  [A missing outlet throws one of two errors, and the handbook names a third](../../../DISCOVERIES.md#a-missing-outlet-throws-one-of-two-errors-and-the-handbook-names-a-third).
- Reading `advisoryTarget` throws
  `Missing target element "advisory" for "slip-board" controller`
  through `handleError`. The after-line stays
  "After the read has not run."
- Reading `alarmClass` throws
  `Missing attribute "data-slip-board-alarm-class"`.
- Reading `bellOutlet` throws
  `Missing outlet element "bell" for host controller "slip-board"`.
  The parade bell is connected. It is not the board's outlet,
  because the board has no outlet attribute. `hasBellOutlet`
  is false. The singular getter is the one that throws.
- `postDrift` catches its own throw, sets `faultValue` to
  `held`, and adds `slip-fault`. Handled stays at 3.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The board without advisory, tide, alarm class, or outlet |
| [`slip_board_controller.js`](slip_board_controller.js) | Guards, unguarded reads, caught drift |
| [`bell_watch_controller.js`](bell_watch_controller.js) | The parade bell |

**Try it**

The status reads "No advisory posted. Tide not posted. No
alarm class. No bell outlet." The after-line reads "After
the read has not run." The parade bell reads "Parade bell
connected." Handled 0. Fault class off. Read the advisory
anyway. Handled 1, and the error text is
`Missing target element "advisory" for "slip-board" controller`.
The after-line is unchanged. Read the alarm class. Handled
gains `Missing attribute "data-slip-board-alarm-class"`.
Read the bell outlet. Handled gains
`Missing outlet element "bell" for host controller "slip-board". Stimulus couldn't find a matching outlet element using selector "null".`
Handled 3. Post the drift. The status reads "Drift held.
Board still open." Fault class on. Handled stays 3. The
board element has the class `slip-fault`.
