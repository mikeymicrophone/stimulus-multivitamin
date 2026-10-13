# Value change callbacks · 02 · Bell buoy ledger

The aids-to-navigation tender's ledger for five bell buoys. Each card
wrote the bell a different way. Laying the pier up moves the cards.

**What it teaches**

- Partridge Point is chalked `false`. The first call is `(false, false)`.
  The previous value is the boolean default, because the attribute is
  present. See
  [The first previousValue is the default when the attribute is present](../../../DISCOVERIES.md#the-first-previousvalue-is-the-default-when-the-attribute-is-present).
- Smith Island has no attribute. The first call is `(false, undefined)`
  and the buoy is silent.
- Marrowstone is `(true, false)`. Dungeness's blank cell is an empty
  attribute, which reads as true, so the first call is also
  `(true, false)` and the buoy is ringing.
- Protection Island uses `sounding === previous` as a guard. Both are
  `false`, so the reading stays "Paint skipped."
- Laying the buoys up reconnects each controller. Smith Island logs a
  second `(false, undefined)`. The buoys whose attributes are still on
  the card do not. See
  [Present values do not re-fire on reconnect](../../../DISCOVERIES.md#present-values-do-not-re-fire-on-reconnect).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The working pier, the lay-up pier, and five buoy cards |
| [`bell_buoy_controller.js`](bell_buoy_controller.js) | The sounding callback and the guard |
| [`buoy_ledger_controller.js`](buoy_ledger_controller.js) | Moves the cards |

**Try it**

Partridge Point opens "Partridge Point is silent." and "Partridge Point
false, previous false." Smith Island opens "Smith Island is silent." and
"Smith Island false, previous undefined." Marrowstone and Dungeness both
open ringing, each with "previous false." Protection Island stays
"Paint skipped." and logs "Guard held false against false."

Lay the buoys up. Smith Island's log gains a second "Smith Island false,
previous undefined." The other four logs stay one line each. The cards
sit under Lay-up pier.
