# Error handling · 13 · Deception Pass fault line

The fault line at Deception Pass is the throw that escapes
`handleError`, the logger that throws, and the lifecycle
methods that are `async`.

**What it teaches**

- Arming the reporter makes `handleError` throw
  `reporter jammed`. `markPass` has run. `closeGate` does
  not. The fault is `reporter jammed`, not `cable parted`.
  `window.onerror` is the browser's call: source `page`,
  line not 0. The Stimulus-shaped call, empty source and
  line 0, stays 0. See
  [A throw from `handleError` or `logger.error` escapes the action listener](../../../DISCOVERIES.md#a-throw-from-handleerror-or-loggererror-escapes-the-action-listener).
- Arming the logger calls the default method once.
  `logger.error` throws `tape snapped` before that method
  reaches `window.onerror`. The slate already reads
  "Horn wrote the slate." The next watch does not post.
  See
  [Debug logging uses the logger only while `debug` is true](../../../DISCOVERIES.md#debug-logging-uses-the-logger-only-while-debug-is-true).
- `async initialize()` rejects with `async init tore`.
  `connect()` still runs. The gate book connects. Pulling
  the lamp runs `async disconnect()`, which rejects with
  `async disconnect tore` after the observers stop, so the
  trim does not change the reading. See
  [An `async` lifecycle method rejects outside `handleError`, and the scan continues](../../../DISCOVERIES.md#an-async-lifecycle-method-rejects-outside-handleerror-and-the-scan-continues).
- `click->pass-bell#jam:prevent` and
  `click->pass-bell#jam:stop` are different listeners, so
  both run. Both messages are
  `Error invoking action "click->pass-bell#jam"`. The
  options are not in the string. `detail.index` is `0`
  and then `1`. See
  [Action `detail` carries `index` and `event`; lifecycle `detail` does not](../../../DISCOVERIES.md#action-detail-carries-index-and-event-lifecycle-detail-does-not).
- `throw "rope parted"` is not an `Error`. `error.message`
  is not a field. The report uses `String(error)`.
- Filing the late init makes `handleError` throw during
  `initialize()`. The late lamp reads "Late init entered
  initialize." and never "Late init connected." The next
  controller stays "Late next waiting." The fault is
  `init reporter jammed`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Reporter, logger, wires, and the late host |
| [`pass_gate_controller.js`](pass_gate_controller.js) | Pass, slate, and rope |
| [`pass_bell_controller.js`](pass_bell_controller.js) | The two option strings |
| [`async_init_controller.js`](async_init_controller.js) | Async initialize and disconnect |
| [`gate_book_controller.js`](gate_book_controller.js) | Connects after the async rejection |
| [`late_init_controller.js`](late_init_controller.js) | initialize() that throws |
| [`late_next_controller.js`](late_next_controller.js) | Skipped when the reporter throws |

**Try it**

The gate book reads "Gate book connected." The async lamp
reads "Async init connected." Rejections reads
`async init tore`. Stimulus-shaped 0. Arm the reporter.
The note reads "Reporter will throw." Run the pass. The
pass reads "Pass marked." The gate stays "Gate is open."
Faults reads `reporter jammed`. The onerror line contains
`reporter jammed`, source `page`, and a line that is not 0.
Stimulus-shaped stays 0. Browser-shaped 1. Arm the logger.
Write the slate. The slate reads "Horn wrote the slate."
The watch stays "Watch is waiting." Faults gains
`tape snapped`. Browser-shaped 2. Jam both options. Jam
notes 2. Handled gains two lines, both
`Error invoking action "click->pass-bell#jam"`, indexes
`0` and `1`, reported `bell jammed`. Part the rope. The
rope reads "Rope let go." Handled gains
`reported rope parted. message field undefined.` Pull the
async lamp. Rejections gains `async disconnect tore`.
Trim the async lamp. Button clicks 1. The reading stays
"Async init connected." File the late init. The late lamp
reads "Late init entered initialize." The next lamp reads
"Late next waiting." Faults gains `init reporter jammed`.
