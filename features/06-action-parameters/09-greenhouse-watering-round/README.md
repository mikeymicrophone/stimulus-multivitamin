# Action parameters · 09 · Greenhouse watering round

Glasshouse Row's orchid house. One pour button is the excuse to read the
same bench three ways: Stimulus values, action params, and `dataset`.

**What it teaches**

- `event.params.liters` is the number `1.5`. The button's
  `dataset.greenhouseBedLitersParam` is the string `"1.5"`. `dataset`
  keeps the identifier and the `Param` suffix, and it does not parse JSON.
- A String value keeps `"08"`. A Number value uses `Number()`, so `"08"`
  becomes `8`. The param `"08"` fails `JSON.parse` and stays the string
  `"08"`. See
  [Action params turn all-digit strings into numbers](../../../DISCOVERIES.md#action-params-turn-all-digit-strings-into-numbers).
- A Boolean value treats `"FALSE"` as `false`. The param `"FALSE"` stays
  the string `FALSE`.
- Moisture is `data-moisture="damp"` on the bed, read as
  `element.dataset.moisture`. It is not a param and not a value.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Bed markup, importmap, and controller registration |
| [`greenhouse_bed_controller.js`](greenhouse_bed_controller.js) | Prints all three channels |

**Try it**

Pour 1.5 liters. The report shows the bed name and bed code as strings,
the flow value as the number 8, the shade value as the boolean false, the
liters param as the number 1.5, the shade param as the string FALSE, the
bed-code param as the string 08, moisture as the string damp, and the
dataset param key as the string 1.5.
