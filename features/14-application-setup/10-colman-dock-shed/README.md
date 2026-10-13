# Application setup and registration · 10 · Colman Dock shed

Colman Dock is an application inside the page application.
The terminal shed is a third application with a different
controller attribute, and it sits inside the dock.

**What it teaches**

- `Application.start()` and `Application.start(dock)` are
  two routers. Both register `pier-lamp`. The pier lamp is
  inside both roots, so it connects twice. One click runs
  `flash` twice.
- The street lamp is outside the dock and inside the page.
  It connects once and flashes once.
- The street clock is registered only on the page. Its root
  is `HTML`.
- The shed schema is `defaultSchema` with
  `controllerAttribute` set to `data-shed-controller`.
  `actionAttribute` stays `data-action`. The page and the
  dock do not see the shed. The shed does not see
  `data-controller`. It connects once and flashes once.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Page, dock, and shed applications |
| [`pier_lamp_controller.js`](pier_lamp_controller.js) | Shared by the page and the dock |
| [`street_clock_controller.js`](street_clock_controller.js) | Page only |
| [`shed_lamp_controller.js`](shed_lamp_controller.js) | Shed schema |

**Try it**

The street clock reads "Street clock connected on HTML." The
street lamp reads "1 connection." The pier lamp reads "2
connections." The shed reads "Shed lamp connected once."
Flash the street lamp. It reads "Flashes 1." Flash the pier
lamp. It reads "Flashes 2." Flash the shed lamp. It reads
"Shed flashes 1."
