# Dispatching custom events · 05 · Point Wilson signal flags

The mast hoists a flag. The log vetoes a hoist that reaches
it. The lamp is inside a shadow root.

**What it teaches**

- `bubbles` and `cancelable` default to `true`. `composed`
  is not passed through to `CustomEvent`, so
  `event.composed` stays `false` even when the call passes
  `composed: true`.
- `bubbles: false` is heard on the mast only. The log and
  the watch stay quiet, and `defaultPrevented` stays false
  because the log never ran.
- `cancelable: false` still reaches the log. The log calls
  `preventDefault()`, and `defaultPrevented` stays false.
- `bubbles: "false"` and `cancelable: "false"` are still
  true. A non-empty string is truthy when the event is
  created. `0` is false for both flags, so that hoist does
  not bubble and cannot be vetoed.
- A hoist whose `target` is the lamp inside the shadow
  root does not reach the host, the log, or the watch.
  The same name built with `new CustomEvent(..., { bubbles: true, cancelable: true, composed: true })`
  does reach all three, and `event.composed` is true.
  A hand-built event is not cancelable unless the call
  says so. `dispatch()` is cancelable unless told otherwise.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Mast, shadow host, log, and watch |
| [`signal_mast_controller.js`](signal_mast_controller.js) | Passes the flags, and builds one event by hand |
| [`flag_log_controller.js`](flag_log_controller.js) | Ancestor that always calls `preventDefault()` |
| [`strait_watch_controller.js`](strait_watch_controller.js) | `@window` listener |

**Try it**

The log and the watch open quiet. The host says "Host is
quiet." The mast says "No hoist yet." Hoist baker. The
mast says "type signal-mast:hoisted. bubbles true.
cancelable true. composed false. defaultPrevented true."
The log says "Log heard baker. defaultPrevented true.
composed false." The watch says "Watch heard baker.
composed false." The host stays quiet, because the hoist
started on the mast and does not travel down. Hoist
without bubbling. The mast says "bubbles false.
defaultPrevented false." The log and the watch stay quiet.
Hoist a fixed flag. The mast says "cancelable false.
defaultPrevented false." The log says "Log heard fixed.
defaultPrevented false. composed false." Hoist with the
word false. The mast says "string bubbles true. string
cancelable true. defaultPrevented true." The log heard
`worded`. Hoist with zero. The mast says "zero bubbles
false. zero cancelable false. defaultPrevented false."
The log stays quiet. Hoist inside the shadow. The mast
says "shadow composed false." The host, the log, and the
watch stay quiet. Hoist a composed event by hand. The
mast says "manual composed true. defaultPrevented true."
The host says "Host heard manual. composed true." The log
and the watch both heard `manual` with composed true.
