# Target callbacks · 08 · Buoy tender charts

Bell 2, Gong 4, and Whistle 7 are on the station chart. Each one gets
a sparkline widget, a resize observer, and a hail listener when it
becomes a buoy target, and loses them when it stops being one.

**What it teaches**

- `buoyTargetConnected` creates a `SparkWidget`, observes the buoy with
  a `ResizeObserver`, and listens on that buoy's hail button. The
  listening count is 3 and each caption names spark 1.
- `buoyTargetDisconnected` destroys the widget, disconnects the
  observer, and removes the listener. Pulling Gong 4 off the chart
  drops the listening count to 2 and raises the destroyed count to 1.
  Gong 4's caption says the spark was cleared.
- Moving Bell 2 down the chart runs both callbacks. The spark is built
  again (spark 2), the destroyed count goes up, and the listening count
  is unchanged. The hail count lives on the buoy, so a hail from before
  the move is still there and the new listener can hail again.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three buoys, importmap, and registration |
| [`buoy_chart_controller.js`](buoy_chart_controller.js) | Attaches and detaches widget, observer, and listener |
| [`spark_widget.js`](spark_widget.js) | Draws and clears the sparkline |

**Try it**

The gear line reads "Widgets listening: 3. Destroyed: 0." Each caption
says spark 1. Hail Bell 2. The line reads "Hailed 1". Move Bell 2 down.
It sits under Gong 4, the caption says spark 2, the hail line still
says "Hailed 1", and the gear line reads "Widgets listening: 3.
Destroyed: 1." Hail Bell 2 again: "Hailed 2". Pull Gong 4 off the
chart. The card is gone, and the gear line reads "Widgets listening: 2.
Destroyed: 2."
