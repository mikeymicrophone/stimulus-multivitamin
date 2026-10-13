# Error handling · 05 · Partridge Point watch faults

Three lamps at Partridge Point fail in `initialize()`,
`connect()`, and `disconnect()`.

**What it teaches**

- Each lifecycle method has its own `try`. The messages are
  `Error initializing controller`, `Error connecting controller`,
  and `Error disconnecting controller`. `detail` carries
  `identifier` and does not carry `index` or `event`. See
  [A throw in `initialize()` still connects, a throw in `connect()` leaves actions live, and a throw in `disconnect()` still stops them](../../../DISCOVERIES.md#a-throw-in-initialize-still-connects-a-throw-in-connect-leaves-actions-live-and-a-throw-in-disconnect-still-stops-them).
- The init lamp writes a sentence, throws, and then
  `connect()` replaces that sentence with "Init lamp
  connected." Trimming the wick still runs.
- The connect lamp throws from `connect()`. Its trim action
  still runs. The point lamp, later in the document, still
  connects. That is not the scan skip in
  [A throw from a value callback skips the rest of the connect scan](../../../DISCOVERIES.md#a-throw-from-a-value-callback-skips-the-rest-of-the-connect-scan).
- Pulling the disc lamp removes the controller token.
  `disconnect()` throws, the report is filed, and the
  observers still stop. The next click reaches the button
  and does not change the reading.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The four lamps and the handled list |
| [`init_lamp_controller.js`](init_lamp_controller.js) | Throws in `initialize()` |
| [`connect_lamp_controller.js`](connect_lamp_controller.js) | Throws in `connect()` |
| [`point_lamp_controller.js`](point_lamp_controller.js) | Connects after that throw |
| [`disc_lamp_controller.js`](disc_lamp_controller.js) | Throws in `disconnect()` |

**Try it**

Handled reads:

```
Error initializing controller | init-lamp | init wick failed
Error connecting controller | connect-lamp | connect wick failed
```

The init lamp reads "Init lamp connected." The connect lamp
reads "Connect lamp entered connect." The point lamp reads
"Point lamp connected." The disc lamp reads "Disc lamp is
up." Trim the wick. The init lamp reads "Wick trimmed." Trim
the connect lamp. It reads "Connect lamp trimmed." Pull the
lamp. Handled gains
`Error disconnecting controller | disc-lamp | disconnect wick failed`.
The disc reading stays "Disc lamp is up." Trim the pulled
lamp. Button clicks 1. The reading stays "Disc lamp is up."
