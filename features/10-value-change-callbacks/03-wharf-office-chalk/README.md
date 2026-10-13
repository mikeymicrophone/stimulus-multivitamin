# Value change callbacks · 03 · Wharf office chalk

City Dock at Union Wharf, Port Townsend. The berth and the draft can be
chalked from the controller or from a plain script that sets the
attributes.

**What it teaches**

- The first callbacks are `Berth "City", previous ""` and `Draft 18,
  previous 0`. The string default is `""`. The number default is `0`.
- `chalkFromBoard` assigns `berthNameValue` and `draftFeetValue`. The
  ask line is recorded in the action. The callbacks run after that
  action returns, from the attribute observer.
- `office_chalk.js` is not a controller. `setAttribute` is the same
  path the elements panel uses. The callbacks are the same methods,
  with the same arguments. Nothing in the callback says which writer
  it was.
- Writing the strings the card already has does not run the callbacks.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | City Dock, importmap, and registration |
| [`berth_chalk_controller.js`](berth_chalk_controller.js) | The board, and the calls into the office script |
| [`office_chalk.js`](office_chalk.js) | Writes the attributes from outside the controller |

**Try it**

The card opens "City, 18 ft of draft." The log is "Berth "City",
previous ""." then "Draft 18, previous 0."

Chalk Union from the board. The log adds "The board chalked Union at
16 ft." then "Berth "Union", previous "City"." then "Draft 16, previous
18." The reading is "Union, 16 ft of draft."

Chalk South from the office script. The log adds the ask line, then
"Berth "South", previous "Union"." and "Draft 22, previous 16."

Chalk the same words again. The log adds only "The office script was
asked to chalk the same words."
