# Lifecycle callbacks · 07 · Resizable dashboard tiles

The Cedar Falls Water Utility's operations dashboard. Each tile is a
`dashboard-tile` controller that picks a compact, standard, or wide layout
from its own width: just the latest reading, a 7-day sparkline, or a 30-day
sparkline. The `operations-dashboard` controller moves tiles between the main
area and the sidebar, widens them, and hides and restores them.

**What it teaches**

- Create the `ResizeObserver` once in `initialize()`, call `observe()` in
  `connect()`, and call `observer.disconnect()` in `disconnect()`. The same
  observer object is reused each time the tile reconnects.
- `observe()` reports the element's current size right away, so `connect()`
  doesn't measure anything itself. A tile moved to the sidebar gets its new,
  narrower size as soon as it reconnects.
- A `ResizeObserver` hears every size change, not only window resizes. Three
  different things resize a tile here: a move to the sidebar (which
  disconnects and reconnects the tile), the "Span two columns" toggle (a
  class change, which doesn't reconnect anything), and a drag of the resize
  handle. A `resize@window` listener would miss the last two.
- A detached element that is put back reconnects to its existing instance.
  A hidden tile keeps its selected series when it is shown again, and its
  series picker, built once in `initialize()`, isn't built twice.

**Behavior worth knowing**

- If an observer callback changes the size it is observing, the browser
  reports a "ResizeObserver loop completed with undelivered notifications"
  error. The tiles have a fixed height, and the callback only redraws when
  the layout name changes, so swapping a tile's contents never changes the
  observed size.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Dashboard markup with each tile's readings, importmap, and controller registration |
| [`dashboard_tile_controller.js`](dashboard_tile_controller.js) | Observes its own size and picks a layout |
| [`operations_dashboard_controller.js`](operations_dashboard_controller.js) | Moves, widens, hides, and restores tiles |

**Try it**

Each tile's footer shows its current layout and width. Choose "South
reservoir" on the reservoir tile, then "Span two columns": it switches to the
30-day chart without reconnecting. Move it to the sidebar and it becomes
compact, still showing the south reservoir. Hide it and show it again, and
it comes back the same. Drag the lower-right corner of any tile to resize it
and watch the layout switch as it crosses 300 px and 520 px.
