# Outlets · 11 · Pier 91 shed office

The pier office and the shed office are two controllers on one
board. The shed lamp and the spare each carry two controller
tokens. The north pile is only a pile lamp.

**What it teaches**

- `pier`'s outlet `shed-lamp` reads
  `data-pier-shed-lamp-outlet`. `pier-shed`'s outlet `lamp`
  reads the same attribute. One selector serves both. They
  still require different tokens, `shed-lamp` and `lamp`,
  which are both on the lamp element.
- `pile-lamp` is `data-pier-pile-lamp-outlet`. Pointing the
  shared attribute at `#spare-lamp` moves both offices and
  leaves the pile on `#pile-lamp`.
- Each office gets its own connected and disconnected
  callback for its own outlet name. The spare was already
  connected; changing the selector is what attaches it.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three lamps and the shared office |
| [`pier_controller.js`](pier_controller.js) | `shed-lamp` and `pile-lamp` |
| [`pier_shed_controller.js`](pier_shed_controller.js) | `lamp` through the shared attribute |
| [`shed_lamp_controller.js`](shed_lamp_controller.js) | The shed-lamp token |
| [`lamp_controller.js`](lamp_controller.js) | The lamp token |
| [`pile_lamp_controller.js`](pile_lamp_controller.js) | The pile lamp |

**Try it**

The shed lamp and the spare each say they connected. The pier
line opens "Pier shed-lamp shed-lamp. Pier pile-lamp pile-lamp.
connected." The shed line opens "Shed lamp shed-lamp.
connected." The log has a connected line for shed-lamp from
each office. Point both offices at the spare. The log adds a
disconnected line and a connected line for each office, the
spare's id on the connected lines. The pier line says "Pier
shed-lamp spare-lamp. Pier pile-lamp pile-lamp. spare." The
shed line says "Shed lamp spare-lamp. spare."
