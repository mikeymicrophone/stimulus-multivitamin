# Values · 01 · Maple sugar shack

Boiling night at the Grafton sugar shack. Lot S-14 is on the north
arch. Lot S-15 is drawn and has not been assigned a pan.

**What it teaches**

- `static values` declares `lotCode` and `evaporatorName` as `String`.
  The attributes are `data-sugar-shack-lot-code-value` and
  `data-sugar-shack-evaporator-name-value`. CamelCase in the controller
  is kebab-case in the attribute.
- A missing string reads as `""`. On the south arch
  `hasEvaporatorNameValue` is false and the card says "(unnamed)". The
  north arch has the attribute, so `hasEvaporatorNameValue` is true.
- Assigning `this.evaporatorNameValue` writes the data attribute before
  the reading is painted. `[name]ValueChanged` is the next feature; this
  page does not wait for it.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The two arches, importmap, and registration |
| [`sugar_shack_controller.js`](sugar_shack_controller.js) | Reads the lots and writes a new pan name |

**Try it**

The north arch reads "Lot S-14. hasLotCodeValue true. Lot attribute
S-14. Evaporator North arch. hasEvaporatorNameValue true. Evaporator
attribute North arch." The south arch reads "Lot S-15" and
"Evaporator (unnamed). hasEvaporatorNameValue false. Evaporator
attribute absent." Move the south lot. The reading becomes "Evaporator
Finishing pan. hasEvaporatorNameValue true. Evaporator attribute
Finishing pan."
