# Targets · 05 · Garden work day

Saturday at the community garden. The roster starts with Beans and Kale.
Adding Squash and sending Kale home both show up the next time the
roster is read. A list kept from `connect()` does not.

**What it teaches**

- `plotTargets` runs a query on every read and returns a new array. The
  plot appended inside `addPlot` is already in that list. The plot
  removed inside `sendHome` is already gone. Nothing waits for a
  repaint or a callback.
- `plotsSeenAtConnect` is an ordinary array saved when the roster
  connected. It still says Beans, Kale after the roster changes.
- `plotTargetConnected` runs after `addPlot` has written the status
  line. The line says the callback had not run for Squash. The callback
  log, written by the callback itself, later includes Squash. Connected
  callbacks are not how the list stays current. Feature 08 is where
  those callbacks are the point.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Roster, the new-plot field, importmap, and registration |
| [`work_day_controller.js`](work_day_controller.js) | Reads plots lazily and keeps a connect-time snapshot |

**Try it**

The status starts "Live plots: Beans, Kale" and the snapshot matches.
The callback log already lists Beans and Kale, because those callbacks
ran as the roster connected. Type nothing extra: the field already says
Squash. Add the plot. The live list is Beans, Kale, Squash, the snapshot
is still Beans, Kale, and the status says the callback had not run for
Squash. The callback log now includes Squash. Send Kale home. The live
list is Beans, Squash. The snapshot still includes Kale.
