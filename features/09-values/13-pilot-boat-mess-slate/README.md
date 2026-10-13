# Values · 13 · Pilot boat mess slate

Middle watch in the galley of the pilot boat Mary Jane, and a relief
boat whose name was never chalked. A radio order arrived as a comma
list.

**What it teaches**

- One controller declares every value type. `watchName`, `lotCode`,
  and `allergenNote` are `String`. `batchCode` is `Number`.
  `galleyOpen` is `Boolean`. `menu` is `Array`. `tideNote` is
  `Object`. `boatName` and `bowls` use `{ type, default }`.
- Mary Jane's batch attribute is `08` and `batchCodeValue` is `8`.
  The lot attribute is `08` and `lotCodeValue` is the string `"08"`.
  Assigning the batch number back to itself rewrites the attribute as
  `8`. The lot string is untouched.
- The relief boat has no boat-name attribute. `boatNameValue` is the
  default `"Mary Jane"` and `hasBoatNameValue` is true. Bowls default
  to `4` the same way. `hasAllergenNoteValue` is false: that string
  has no default and no attribute. The galley attribute is `""`, so
  `galleyOpen` is true. Closing it writes `"false"`.
- `tideNote` keeps `height_ft`. `heightFt` is absent. Adding chowder
  assigns a new array and writes JSON. There is no
  `[name]ValueChanged` here; the action paints after the setter
  returns. Change callbacks are the next feature.
- The radio menu is not JSON. Taking the order throws `SyntaxError`.
  The galleys still connect, because that read is on the button.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Both galleys, the radio slip, importmap, and registration |
| [`mess_slate_controller.js`](mess_slate_controller.js) | The slate: every type, the defaults, and the write-back |
| [`radio_order_controller.js`](radio_order_controller.js) | The comma list |

**Try it**

Mary Jane opens "Watch Middle. Boat Mary Jane. hasBoatNameValue true.
Boat attribute \"Mary Jane\". Bowls 4. hasBowlsValue true. Bowl
attribute absent. Batch 8. Batch attribute \"08\". Lot \"08\". Galley
open false. Galley attribute \"false\". Menu pilot bread, pea soup.
Tide height_ft 6.2. direction flood. heightFt absent.
hasAllergenNoteValue false." Add chowder. The menu is "pilot bread,
pea soup, chowder" and the attribute is
`["pilot bread","pea soup","chowder"]`. Serve another bowl. Bowls are
5 and the bowl attribute is `"5"`. Rewrite the batch code. The batch
attribute becomes `"8"` and the lot stays `"08"`.

The relief boat opens "Watch Relief. Boat Mary Jane. hasBoatNameValue
true. Boat attribute absent. Bowls 4. Batch 8. Batch attribute \"08\".
Lot \"08\". Galley open true. Galley attribute \"\". Menu hard tack.
Tide height_ft absent. direction absent. hasAllergenNoteValue false."
Close the galley. It reads "Galley open false. Galley attribute
\"false\"."

Take the radio order. The line is a `SyntaxError` naming
`chowder, pilot bread`.
