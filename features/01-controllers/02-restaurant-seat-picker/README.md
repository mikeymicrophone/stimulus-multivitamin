# Controllers · 02 · Restaurant seat picker

Osteria Marlowe's online floor plan for a Saturday 7:30 PM seating. Each of
the seven tables is its own `dining-table` controller instance. Guests hold
seats at a table and book them, and every table tracks its holds on its own.

**What it teaches**

- One controller class can back any number of elements. Seven
  `data-controller="dining-table"` elements give you seven instances of the
  same class.
- Instance state belongs on the instance, set up in `initialize()`. Mutable
  state at module level would be shared by every table; read-only
  configuration such as the online hold limit is fine there.
- An action reaches only the instance whose element contains it, so clicking
  a seat at Booth 3 never calls into Patio 5.
- Targets are per instance. `this.seatTargets` holds two seats at Window 1
  and six at the chef's counter.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Floor plan markup, importmap, and controller registration |
| [`dining_table_controller.js`](dining_table_controller.js) | One instance per table; holds, releases, and books that table's seats |

**Try it**

Hold two seats at Booth 3 and three at Round 7, then book Booth 3. Round 7
still shows its own holds. Try holding a fifth seat at Round 7 to hit the
online limit, and notice that Window 2 starts fully booked while its
neighbors do not.
