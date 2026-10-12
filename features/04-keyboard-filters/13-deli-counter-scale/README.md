# Keyboard filters · 13 · Deli counter scale

Birch & Brine's counter scale. Smoked turkey starts at a pound. Plus and
minus nudge the weight; the number keys type a quantity; Enter adds the
line; F2 cycles the PLU; F4 voids the ticket. Those extra names are not
built in — they come from the application's `keyMappings`.

**What it teaches**

- Custom key names come from `Application`'s schema, not from the
  controller. The page spreads `defaultSchema.keyMappings` and adds
  `plus`, `minus`, `star`, `slash`, `dot`, `equals`, `backspace`, `f2`,
  and `f4`. Replacing the map outright would drop `enter` and `esc`.
- Numpad `+` is `event.key` `"+"` with `shiftKey` false, so
  `keydown.plus` matches it. The main-keyboard `+` is Shift+`=`, so it
  needs `keydown.shift+plus`. Both call `bumpQuantity()`.
- Unknown names throw when a keyboard event hits the action, not when
  the page parses. `keydown.comma` would throw `contains unknown key
  filter: comma` unless `comma` is added to the map.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Custom schema, scale face, filters, importmap, and registration |
| [`deli_scale_controller.js`](deli_scale_controller.js) | Quantity, PLU, ticket, and the mapped keys |

**Try it**

Press `+` to bump smoked turkey by a quarter pound, then Enter to add it
to the ticket. Type `2.5` and Enter for 2.50 lb. Press F2 to switch to
aged cheddar, `/` for the staff discount, `*` to void the last line, and
F4 to clear the ticket. Escape zeros the keyed quantity without touching
lines already on the ticket.
