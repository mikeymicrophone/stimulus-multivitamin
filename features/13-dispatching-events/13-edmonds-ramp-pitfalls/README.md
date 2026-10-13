# Dispatching custom events · 13 · Edmonds ramp pitfalls

The ramp bell at Edmonds, the staff gauge, and the horn
shed across the slip. Three ways a dispatch surprises you.

**What it teaches**

- `ramp-bell:sounded` bubbles to the deck and on to the
  window. The horn shed is a sibling of the deck, so its
  action never runs. It stays "Horn shed is quiet."
- `detail` is the object that was passed. The deck sets
  `fathoms` to 0. The mate, later at `@window`, reads 0.
  The returned event reads 0. `event.detail === detail`
  is true. Pass a new object per call if a listener must
  not be able to rewrite the caller's numbers.
- `this.dispatch("click", { prefix: false, target: button })`
  runs `click->ramp-bell#countClick`. The event is a
  `CustomEvent`, not a `MouseEvent`, and `detail.horn`
  is `"Edmonds"`. A real click of that button is a mouse
  event with detail `none`.
- `this.dispatch("change", { prefix: false, target: input })`
  runs `change->ramp-bell#readGauge`. It is a
  `CustomEvent`, not an `InputEvent`, and the reading is
  `custom 14.2`. A native `change` event is not a
  `CustomEvent`, and the reading is the input's value.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Deck, bell, shed, and mate |
| [`ramp_bell_controller.js`](ramp_bell_controller.js) | Sounds, and collides with click and change |
| [`ramp_deck_controller.js`](ramp_deck_controller.js) | Ancestor that rewrites `detail.fathoms` |
| [`horn_shed_controller.js`](horn_shed_controller.js) | Sibling that does not hear the bell |
| [`detail_mate_controller.js`](detail_mate_controller.js) | Window listener that sees the rewrite |

**Try it**

The bell says "Bell is quiet." The deck says "Deck is
quiet." The shed says "Horn shed is quiet." The mate says
"Mate has not looked." Click says "No click yet." Change
says "No change yet." Sound the bell. The bell says
"Returned fathoms 0. Same object true. type
ramp-bell:sounded." The deck says "Deck set fathoms to
0." The mate says "Mate saw fathoms 0." The shed stays
"Horn shed is quiet." Dispatch click. The click line says
"clicks 1. last custom. detail Edmonds." Click the horn
button. The click line says "clicks 2. last mouse. detail
none." Post a change. The change line says "type change.
custom true. inputEvent false. reading custom 14.2."
Type 9.5. The change line says "type change. custom
false. reading native 9.5."
