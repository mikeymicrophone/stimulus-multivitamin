# Target callbacks · 13 · Harbor night watch

Middle watch on the fairway. Mary Jane (4 souls) and Cormorant
(2 souls) are already alongside. Ivy Rose and Kittiwake are on the
traffic sheet. The anchorage is a nested watch.

**What it teaches**

- The opening transcript is the same order as
  [initialize, value-changed, target-connected, then connect](../../../DISCOVERIES.md#callback-order-is-initialize-value-changed-target-connected-then-connect):
  `initialize`, `watchName Middle`, both vessels, `connect`. Logging
  the traffic clones the sheet into the fairway. The notice keeps the
  action's line, written when the getter already listed the new
  vessels and the callbacks had not stamped them. Fairway souls become
  14. The opening transcript does not grow, and the tick marks are one
  per vessel callback (four), not a loop.
- Marking Mary Jane overdue writes `vessel overdue`. Only
  `overdueTargetConnected` runs. It clips on a blinker. Souls stay 14.
  Clicking the blinker line tocks, which is the listener the callback
  attached.
- Anchoring Cormorant moves her into the nested anchorage. Fairway
  souls drop to 12 and anchorage souls rise to 2, from the disconnected
  callback on the fairway and the connected callback on the anchorage.
  Taking the watch down removes the fairway identifier. `disconnect()`
  records `vessels=0` while `soulsStill=12`, because the getters are
  empty the way they are in
  [Targets vanish in `disconnect()` after the identifier is removed](../../../DISCOVERIES.md#targets-vanish-in-disconnect-after-the-identifier-is-removed).
  The following lines still name Mary Jane, Ivy Rose, and Kittiwake.
  Mary Jane's blinker reads "Blinker off". The anchorage keeps
  Cormorant's 2 souls.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Fairway, anchorage, traffic sheet, importmap, and registration |
| [`night_watch_controller.js`](night_watch_controller.js) | Souls, blinkers, the move, and the transcript |
| [`blinker_widget.js`](blinker_widget.js) | The overdue lamp |

**Try it**

The transcript ends with `connect` after Mary Jane and Cormorant. The
fairway tally is "Fairway souls: 6. Blinkers: 0." The anchorage is
"Anchorage souls: 0. Blinkers: 0." Log the night traffic. The notice
says the getter already listed all four names and the stamps had not
run; the fairway tally is 14 souls, and there are four tick marks. Mark
Mary Jane overdue. Her line reads "Blinker on" and the tally says one
blinker. Click that line: "Blinker on, tock 1". Anchor Cormorant. She
is under the anchorage, the fairway is 12 souls, and the anchorage is
2. Take the watch down. The transcript adds `disconnect vessels=0 soulsStill=12`,
then disconnected lines for Mary Jane, Ivy Rose, and Kittiwake. The
fairway tally is 0 souls and 0 blinkers. Mary Jane reads "Blinker off".
The anchorage still has 2 souls.
