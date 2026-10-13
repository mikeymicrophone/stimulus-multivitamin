# Application setup and registration · 12 · Anacortes pilot importmap

The Anacortes pilot station loads controllers from the import
map. There is no bundler. `window.Stimulus` is assigned by
the page, which is the usual convention and not something
Stimulus does itself.

**What it teaches**

- The library never sets `window.Stimulus`. A classic script
  in the body runs while the document is still parsing,
  before deferred modules. At that moment `window.Stimulus`
  is missing. `DOMContentLoaded` runs after the module,
  including its dynamic imports, so the handle is there.
- Specifiers under `controllers/` that end in `_controller`
  become identifiers: `controllers/pilot_order_controller`
  is `pilot-order`. `import(specifier)` uses the import map.
- The boot scan registers only identifiers already in the
  station. `late-slip` is in the map and is not imported
  until a slip element appears. The ready line therefore
  counts 2 controllers.
- `import()` is async. Both new slips are in the document
  before the module arrives. A pending set allows one
  import. `register` then connects every existing scope, so
  each slip connects once.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Import map, `window.Stimulus`, the early script |
| [`station_loader.js`](station_loader.js) | Scan, import, pending set |
| [`station_log_controller.js`](station_log_controller.js) | Present at boot |
| [`pilot_order_controller.js`](pilot_order_controller.js) | Present at boot |
| [`late_slip_controller.js`](late_slip_controller.js) | Posted later, two at a time |

**Try it**

The early window reads "Stimulus is not on the window yet."
The ready window reads "Station window sees HTML. Controllers
2." The tape reads "station-log registered. pilot-order
registered." The log reads "Station log connected." The order
reads "Pilot order connected." Post two late slips. The tape
reads "station-log registered. pilot-order registered.
late-slip registered." Both slips read "Late slip connected."
