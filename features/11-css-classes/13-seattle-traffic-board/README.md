# CSS classes · 13 · Seattle traffic board

Vessel Traffic Service. Seattle Traffic is quiet on the morning
watch. The Strait sector is crowded on the forenoon watch. A lane
slip after the boards reads a class the card never named, and the
bell book after that slip does not connect.

**What it teaches**

- `crowded` is a Boolean value. `crowdedValueChanged` removes both
  state stacks from the board target, adds `quietClasses` or
  `crowdedClasses`, and adds or removes `priorityClasses` on every
  vessel target. The mark-crowded action only assigns
  `crowdedValue`.
- Seattle's tokens are `sector-quiet`, `sector-crowded`,
  `ink-red rule-thick`, and `vessel-calling`. The Strait's tokens
  are `strait-calm`, `strait-thick`, `chalk-amber hang-high`, and
  `vessel-hailing`. None of those strings are in the controller.
  `callingClass` is toggled on one vessel.
- The lane slip's `laneValueChanged` reads `alarmClass`. The
  attribute is absent, so the getter throws `Error: Missing
  attribute "data-lane-slip-alarm-class"`. That is not a
  `TypeError`, so the value observer does not prefix it with
  `Stimulus Value`. `handleError` stays quiet. `connect()` does
  not run. The bell book, later in the same scan, does not
  connect. See
  [The singular class throws only when the attribute is absent](../../../DISCOVERIES.md#the-singular-class-throws-only-when-the-attribute-is-absent)
  and
  [A throw from a value callback skips the rest of the connect scan](../../../DISCOVERIES.md#a-throw-from-a-value-callback-skips-the-rest-of-the-connect-scan).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two sectors, the lane slip, the bell book, importmap, and registration |
| [`traffic_board_controller.js`](traffic_board_controller.js) | Paints board and vessels from the crowded callback |
| [`lane_slip_controller.js`](lane_slip_controller.js) | Reads a missing class from a value callback |
| [`bell_book_controller.js`](bell_book_controller.js) | Sits after the slip and does not connect |

**Try it**

Seattle Traffic opens "Seattle Traffic crowded false. Board
sector-quiet. quietClasses ["sector-quiet"]. crowdedClasses
["sector-crowded"]. priorityClasses ["ink-red","rule-thick"].
hasCallingClass true. callingClass vessel-calling. Watch morning.
Vessels Andrew Foss plain, Kitsap plain." The Strait sector opens
"Strait sector crowded true. Board strait-thick. quietClasses
["strait-calm"]. crowdedClasses ["strait-thick"]. priorityClasses
["chalk-amber","hang-high"]. hasCallingClass true. callingClass
vessel-hailing. Watch forenoon. Vessels Sapphire priority, Westrac
priority." The lane slip still says "Lane slip has not painted."
The bell book still says "Bell book has not connected." The fault
line is `Error: Missing attribute "data-lane-slip-alarm-class"`.
The handled line stays "handleError quiet." Mark Seattle crowded.
Its reading says "Seattle Traffic crowded true. Board
sector-crowded." and "Vessels Andrew Foss priority, Kitsap
priority." Toggle calling on Andrew Foss. The log says "Andrew
Foss calling true." Mark the Strait quiet. It says "Strait sector
crowded false. Board strait-calm." and "Vessels Sapphire plain,
Westrac plain."
