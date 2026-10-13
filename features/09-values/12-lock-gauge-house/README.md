# Values · 12 · Lock gauge house

Ballard locks. The saltwater gauge and the gauge house share a timber.
The zero was named twice. The pool readings were not.

**What it teaches**

- A value attribute is `data-${identifier}-${kebab-name}-value`.
  `gauge`'s `houseZeroFeet` and `gauge-house`'s `zeroFeet` both
  produce `data-gauge-house-zero-feet-value`. Both getters return
  `4.2`. See
  [A shorter identifier can share a longer identifier's value attribute](../../../DISCOVERIES.md#a-shorter-identifier-can-share-a-longer-identifiers-value-attribute).
- Assigning `houseZeroFeetValue = 5` writes that attribute
  immediately. The house controller reads `5` in the same action.
  `[name]ValueChanged` is not what publishes it; the getter reads the
  attribute.
- `poolFeet` does not collide. The gauge's pool is
  `data-gauge-pool-feet-value` (`11`). The house's pool is
  `data-gauge-house-pool-feet-value` (`9`). Setting the house pool to
  `8` leaves the gauge pool at `11`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The lock timber, both identifiers, importmap, and registration |
| [`gauge_controller.js`](gauge_controller.js) | Gauge zero and gauge pool |
| [`gauge_house_controller.js`](gauge_house_controller.js) | House zero and house pool |

**Try it**

The gauge line opens "Gauge zero 4.2. Gauge pool 11. Zero attribute
4.2. Pool attribute 11." The house line opens "House zero 4.2. House
pool 9. Zero attribute 4.2. House pool attribute 9." Raise the gauge
zero to 5. Both lines say zero 5 and the zero attribute is `5`. The
pools stay 11 and 9. Set the house pool to 8. The house line says
"House pool 8. House pool attribute 8." The gauge line still says
"Gauge pool 11. Pool attribute 11."
