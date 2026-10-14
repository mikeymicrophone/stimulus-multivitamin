# Error handling · 06 · Sekiu pilot orders

Filing an order for the Sekiu runs three actions. The middle
one throws. The deck stamp still runs.

**What it teaches**

- Stimulus catches the throw inside the action invocation.
  Later actions on that same listener still run. The order
  reads "Order filed for the Sekiu." The deck reads "Deck
  stamped." Handled reads
  `Error invoking action "click->pilot-order#jamWinch" | winch jammed`.
- `pilot-order#soundMissing` is not a method. The page still
  loads. The click reports
  `Error invoking action "click->pilot-order#soundMissing"`
  and the error text is
  `Action "click->pilot-order#soundMissing" references undefined method "soundMissing"`.
  See
  [A missing method is reported when the event fires](../../../DISCOVERIES.md#a-missing-method-is-reported-when-the-event-fires).
- The harbor clock advances after both of those reports.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The order, the missing horn, the clock |
| [`pilot_order_controller.js`](pilot_order_controller.js) | File, jam, and stamp |
| [`harbor_clock_controller.js`](harbor_clock_controller.js) | The clock |

**Try it**

Handled reads "No handled error." The order reads "No order
filed." The deck reads "Deck is clear." The clock reads
"Clock holds 09:15." File the Sekiu order. The order reads
"Order filed for the Sekiu." The deck reads "Deck stamped."
Handled reads
`Error invoking action "click->pilot-order#jamWinch" | winch jammed`.
Sound the missing horn. Handled gains
`Error invoking action "click->pilot-order#soundMissing" | Action "click->pilot-order#soundMissing" references undefined method "soundMissing"`.
Advance the clock. The clock reads "Clock advanced."
