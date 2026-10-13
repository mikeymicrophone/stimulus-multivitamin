# CSS classes · 07 · Mukilteo ramp lamps

The Mukilteo–Clinton crossing. Each ramp's lamp is painted from a
`state` value. The class tokens for open, moving, and closed are
different on each dock, and they live in the markup.

**What it teaches**

- `static values = { state: String }` and `static classes =
  ["open", "moving", "closed"]` together. `stateValueChanged`
  removes the three tokens from the lamp target and adds the one
  for the new state.
- The select's action assigns `stateValue` and does not call
  `classList`. The first callback, during connect, paints the
  markup's state.
- Mukilteo's closed token is `ramp-closed`. Clinton's open token
  is `clinton-clear`. Neither string is in the controller.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Both ramps, importmap, and registration |
| [`ramp_lamp_controller.js`](ramp_lamp_controller.js) | Paints the lamp from the state callback |

**Try it**

Mukilteo opens "Mukilteo state closed. Lamp class ramp-closed.
openClass ramp-open. movingClass ramp-moving. closedClass
ramp-closed." Clinton opens "Clinton state open. Lamp class
clinton-clear. openClass clinton-clear. movingClass clinton-travel.
closedClass clinton-latched." Set Mukilteo to moving. Its reading
says "Mukilteo state moving. Lamp class ramp-moving." Clinton still
says "Lamp class clinton-clear."
