# Value change callbacks · 10 · Anacortes cannery retorts

Retort 2 is holding 240°F. Retort 4 came online with no temperature on
the card. The office can write the attribute directly.

**What it teaches**

- `temperatureValueChanged` is the only place that paints. It writes
  the figure, the meter width (degrees divided by 3, capped at 100),
  `aria-valuenow`, the hidden record's value, and the status sentence.
  `connect()` does not paint. The status starts as "Not charted." and
  changes only because the callback ran.
- Retort 4 has no temperature attribute. The callback still runs with
  0, and the status is "Retort 4 is at 0°F."
- `retort_office.js` sets the attribute to 255. The same callback moves
  retort 2. The callback cannot tell the office script from a board
  assignment.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Both retorts |
| [`retort_chart_controller.js`](retort_chart_controller.js) | Paints the chart from the callback |
| [`retort_office.js`](retort_office.js) | Writes the attribute from outside |

**Try it**

Retort 2 opens with figure "240°F", meter width 80%, `aria-valuenow`
240, hidden value "240", and "Retort 2 is at 240°F." Office sets 255°F.
The figure is "255°F", the width is 85%, `aria-valuenow` is 255, the
hidden value is "255", and the status is "Retort 2 is at 255°F."

Retort 4 opens "0°F", width 0%, `aria-valuenow` 0, hidden value "0",
and "Retort 4 is at 0°F."
