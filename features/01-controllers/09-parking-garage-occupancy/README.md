# Controllers · 09 · Parking garage occupancy panel

The attendant's panel for the Elm Street municipal garage. Each level is a
`parking-level` controller updated by a sensor gateway written in plain
JavaScript. The entrance sign is a separate `garage-overview` controller that
totals open spaces, accessible spaces, and EV chargers across every level.

**What it teaches**

- The application object is the registry of every connected controller. The
  same object is `this.application` inside a controller, the return value of
  `Application.start()`, and `window.Stimulus` on this page.
- Code outside Stimulus can drive controllers through it. `sensor_feed.js`
  finds a level's element by id and calls
  `application.getControllerForElementAndIdentifier(element, "parking-level")`,
  checking for `null` in case the level is not connected.
- Sibling controllers can find each other without nesting.
  `garage-overview` filters `this.application.controllers` by identifier to
  find every `parking-level`, and sorts them into page order, because the
  registry lists them in connection order.
- A controller can expose a deliberate public API (`recordSensorReading()`,
  `openSpaceCount`, `isClosed`) for callers outside it. Its occupancy state
  lives in `data-occupancy` attributes, so the markup is the record every
  caller reads.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Garage markup, importmap, registration, and the sensor feed start-up |
| [`garage_overview_controller.js`](garage_overview_controller.js) | Entrance sign; totals every level found through the application |
| [`parking_level_controller.js`](parking_level_controller.js) | One instance per level; records readings, holds spaces, closes the level |
| [`sensor_feed.js`](sensor_feed.js) | Plain JavaScript gateway that calls level controllers through the application |

**Try it**

Watch the levels and the entrance sign update as sensor readings arrive.
Close the roof level and the sign drops its spaces. Hold an open space on P2
and that space ignores its sensor from then on. Then open the browser console
and try:

```js
const p3 = Stimulus.getControllerForElementAndIdentifier(document.getElementById("level-p3"), "parking-level")
p3.recordSensorReading(301, false)
Stimulus.controllers.map((controller) => controller.identifier)
```
