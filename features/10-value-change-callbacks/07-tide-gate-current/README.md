# Value change callbacks · 07 · Dosewallips tide gate

Two gates on the Hood Canal. Dosewallips is slack with the current
still north. Duckabush is already on the ebb, and the card still says
north.

**What it teaches**

- `stageValueChanged` sets `currentValue` only when the getter is not
  already the current that stage calls for. The getter updates in the
  assignment, before the stage callback returns. `currentValueChanged`
  runs after that return. See
  [A value callback can schedule another](../../../DISCOVERIES.md#a-value-callback-can-schedule-another).
- Dosewallips writes `current` before `stage` in the tag. The first
  current callback sees `"north"`. Starting the ebb logs the stage
  line with the getter already `"south"`, then "stage callback
  returned.", then `current "south", previous "north"`.
- Duckabush writes `stage` before `current`. The stage callback sets
  south before the current attribute is visited, so the current
  callback's first value is `"south"` and its previous value is `""`,
  the string default. The chalked `"north"` is never an argument. See
  [Present values run in attribute order, then absent ones](../../../DISCOVERIES.md#present-values-run-in-attribute-order-then-absent-ones).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Both gates |
| [`tide_gate_controller.js`](tide_gate_controller.js) | Derives the current from the stage |

**Try it**

Dosewallips opens on three lines: `current "north", previous ""`, then
the slack stage line with `Current getter "north"`, then "Dosewallips
stage callback returned." Start the ebb. The log adds the ebb stage
line with `Current getter "south"`, then "stage callback returned.",
then `current "south", previous "north"`.

Duckabush opens on three lines and never says north: the ebb stage line
with `Current getter "south"`, then "stage callback returned.", then
`current "south", previous ""`.
