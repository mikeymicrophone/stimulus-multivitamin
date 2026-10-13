# Outlets · 05 · Willapa seed barge

Nahcotta's pump is on the dock. Three other barges cannot see a
pump. Tokeland reads a selector that matches nothing while it
connects. The tally board is the next controller.

**What it teaches**

- A present outlet reads `stationValue` and `strainValue` on
  `seedPumpOutlet`. `hasSeedPumpOutlet` is true.
- `hasSeedPumpOutlet` is false when the attribute is absent,
  when it is empty, and when the selector matches an element
  whose controller token is not `seed-pump`. The oyster float
  matches `.willapa-float` and is still not an outlet.
- `seedPumpOutlet` throws `Error: Missing outlet element
  "seed-pump" for host controller "seed-barge". Stimulus
  couldn't find a matching outlet element using selector
  "…"`. The absent attribute quotes `null`. The empty
  attribute quotes an empty selector. The float quotes
  `.willapa-float`. That is not the handbook sentence about a
  missing `data-controller` attribute.
- Tokeland reads the getter in `connect()`. `handleError`
  reports `Error connecting controller`. Tokeland's reading
  stays on the markup sentence. The tally board after it
  still connects. See
  [A missing outlet throws one of two errors, and the handbook names a third](../../../DISCOVERIES.md#a-missing-outlet-throws-one-of-two-errors-and-the-handbook-names-a-third).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The pump, the float, four barges, the tally board |
| [`seed_barge_controller.js`](seed_barge_controller.js) | Reads the pump or catches the missing-element error |
| [`seed_pump_controller.js`](seed_pump_controller.js) | Nahcotta's station and strain |
| [`seed_float_controller.js`](seed_float_controller.js) | The float with the wrong identifier |
| [`tally_board_controller.js`](tally_board_controller.js) | Connects after Tokeland throws |

**Try it**

Nahcotta opens "Nahcotta strain 3. hasSeedPumpOutlet true.
Outlet pump-nahcotta." The unmarked barge opens
"hasSeedPumpOutlet false. Selector null." The blank barge
opens "hasSeedPumpOutlet false. Selector ""." The float barge
opens "hasSeedPumpOutlet false. Selector ".willapa-float"."
Tokeland still says "Tokeland barge has not finished
connecting." The tally board says "Tally board connected."
The handled line is `Error connecting controller :: Error:
Missing outlet element "seed-pump" for host controller
"seed-barge". Stimulus couldn't find a matching outlet
element using selector "#missing-pump".` Read the pump on
the unmarked barge. The fault says `Error: Missing outlet
element "seed-pump" for host controller "seed-barge".
Stimulus couldn't find a matching outlet element using
selector "null".` Read the pump on the blank barge. The
selector in that sentence is `""`. Read the pump on the float
barge. The selector is `".willapa-float"`.
