# Action parameters · 02 · Bakery preorder window

Hearth & Rye's Saturday window. Preset buttons add a loaf or a wholesale
sack, and the ticket shows what `JSON.parse` did to each param.

**What it teaches**

- `"2"` and `"1.5"` become numbers. `"true"` and `"false"` become booleans.
  `"Caraway rye"` is not valid JSON, so it stays a string.
- `"null"` becomes `null`. Leaving the attribute off leaves the key
  missing (`undefined`), which is a different result.
- `"FALSE"` stays the string `FALSE`. JSON booleans are lowercase only.
- `"2e1"` is valid JSON and becomes the number `20`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Preset buttons, importmap, and controller registration |
| [`bakery_order_controller.js`](bakery_order_controller.js) | Writes a ticket line with each value's kind |

**Try it**

Add the caraway rye, then the granola, and read the kinds on the ticket.
Add the flourless chocolate: nut-free is the boolean `true`, and the gift
note is `null`. Add the seeded boule: the gift note was never set, so it
is missing rather than null. Add the almond croissant: the spreadsheet's
`FALSE` stays a string. Add the wholesale sack: `2e1` arrives as `20`.
