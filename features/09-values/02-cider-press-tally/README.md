# Values · 02 · Cider press tally

October pressing at the Lyme town orchard. Kingston's bushel slip still
has a leading zero. Lyme has already drawn eighteen gallons.

**What it teaches**

- `bushels` and `gallons` are `Number` values. A missing attribute
  reads as `0`. Kingston has no gallons attribute, so
  `hasGallonsValue` is false. Lyme's `18` makes `hasGallonsValue` true.
- `Number` parsing drops the leading zero. Kingston's attribute is
  `"08"` and `bushelsValue` is `8`. Reading does not rewrite the
  attribute.
- Assigning `this.bushelsValue` writes `` `${value}` ``. One more
  bushel changes Kingston's attribute from `08` to `9`. Drawing a
  gallon on Kingston writes `1` into an attribute that was absent, and
  `hasGallonsValue` becomes true.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Kingston and Lyme presses, importmap, and registration |
| [`press_tally_controller.js`](press_tally_controller.js) | Reads the slips and writes the next tally |

**Try it**

Kingston opens "Bushels 8. Bushel attribute 08. hasBushelsValue true.
Gallons 0. Gallon attribute absent. hasGallonsValue false." Lyme opens
"Bushels 24. Bushel attribute 24. Gallons 18. Gallon attribute 18.
hasGallonsValue true." Press another bushel at Kingston. The reading
is "Bushels 9. Bushel attribute 9." Draw a gallon there. It becomes
"Gallons 1. Gallon attribute 1. hasGallonsValue true."
