# Value change callbacks · 01 · Tide staff reading

Morning reading along the Strait of Juan de Fuca. Ediz Hook was chalked
at 6 feet, Koitlah Point at 0, and Tongue Point's card never got a height.

**What it teaches**

- `heightValueChanged(height, previousHeight)` runs before `connect()`,
  for a staff that has the attribute and for a staff that does not.
- Ediz Hook's first call is `(6, 0)`. The previous value is the number
  default, not `undefined`, because the attribute is present. See
  [The first previousValue is the default when the attribute is present](../../../DISCOVERIES.md#the-first-previousvalue-is-the-default-when-the-attribute-is-present).
- Koitlah was chalked `0`. The first call is `(0, 0)`. A check for
  `previousHeight === undefined` does not mean "this is the first paint"
  once a zero is on the card.
- Tongue Point has no height attribute. The first call is
  `(0, undefined)`, and the reading still paints 0 feet.
- `connect()` does not paint. It records the height the callback already
  wrote. Raising Ediz Hook runs the callback again with `(7, 6)`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three tide staffs, importmap, and registration |
| [`tide_staff_controller.js`](tide_staff_controller.js) | Paints each staff from `heightValueChanged` |

**Try it**

Ediz Hook opens "Ediz Hook reads 6 ft." The log is "Ediz Hook 6,
previous 0." then "connect saw Ediz Hook at 6 ft." Raise one foot. The
reading is "Ediz Hook reads 7 ft." and the log adds "Ediz Hook 7,
previous 6."

Koitlah opens "Koitlah Point reads 0 ft." and "Koitlah Point 0, previous
0." Tongue Point opens "Tongue Point reads 0 ft." and "Tongue Point 0,
previous undefined."
