# Application setup and registration · 04 · Grays Harbor retort shift

Six kettles on the Aberdeen floor, each with a different
`shouldLoad`. The night gate stays cold until the shift flag
changes and someone registers it again.

**What it teaches**

- `load` checks `constructor.shouldLoad` as a value. It does
  not call it. `false` skips the module, so `connect` and
  `afterLoad` never run.
- `static get shouldLoad()` is the shape that works. The day
  retort returns true. The night gate returns whether
  `document.body.dataset.retortShift` is `"day"`.
- `static shouldLoad() { return false }` is a method. The
  property is the function, the function is truthy, and the
  retort loads.
- `static shouldLoad = false` is a field. It skips.
- A getter that returns the string `"false"` is truthy. It
  loads.
- A subclass that does not define `shouldLoad` inherits the
  parent's getter. The cook floor inherits the night gate and
  stays cold.
- The check happens at `register` time. Calling the day shift
  flips the flag and registers `night-gate` again. The cook
  floor is not registered again, so it stays cold.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The six kettles and the shift button |
| [`day_retort_controller.js`](day_retort_controller.js) | Getter returns true |
| [`night_gate_controller.js`](night_gate_controller.js) | Getter reads the shift |
| [`cook_floor_controller.js`](cook_floor_controller.js) | Inherits the night gate |
| [`method_retort_controller.js`](method_retort_controller.js) | Method that would return false |
| [`field_retort_controller.js`](field_retort_controller.js) | Field set to false |
| [`string_retort_controller.js`](string_retort_controller.js) | Getter returns `"false"` |
| [`kettle_log.js`](kettle_log.js) | Tape used by the kettles |

**Try it**

The tape reads "day-retort afterLoad. method-retort afterLoad.
string-retort afterLoad. day-retort connect. method-retort
connect. string-retort connect." The roster reads "day-retort
method-retort string-retort". The night gate, cook floor, and
field retort stay cold. Call the day shift. That `register` happens after the router
is running, so the new lines are "night-gate connect.
night-gate afterLoad." The night gate reads "Night gate
connected." The roster reads "day-retort method-retort
string-retort night-gate". The cook floor stays "Cook floor
is cold."
