# Error handling · 03 · Patos lens tape

The lens cabinet at Patos keeps the default `handleError`. The
page's logger is the tape. `window.onerror` is recorded beside it.

**What it teaches**

- `logger.error` is called as `error("%s\n\n%o\n\n%o", message, error, detail)`.
  The format string is the first argument. See
  [Debug logging uses the logger only while `debug` is true](../../../DISCOVERIES.md#debug-logging-uses-the-logger-only-while-debug-is-true)
  for the same format when a logger throws, and
  [Default `handleError` calls `window.onerror` with an empty source and does not dispatch an `error` event](../../../DISCOVERIES.md#default-handleerror-calls-windowonerror-with-an-empty-source-and-does-not-dispatch-an-error-event).
- A `connect()` throw is `Error connecting controller`. That
  string does not name `wick-lamp`. `detail` keys are
  `identifier, controller, element`. `index` is absent.
  `event` is absent. `detail.element.id` is `wick-lamp`.
- `window.onerror` is called as
  `(message, "", 0, 0, error)`. Returning true does not
  remove the logger line. An `error` listener does not run.
- An action throw adds `index` and `event`. The message is
  `Error invoking action "click->lens-cabinet#breakPrism"`.
  `index` is `0`. `event.type` is `click`. `detail.element`
  is the cabinet. `event.target` is the button. See
  [Action `detail` carries `index` and `event`; lifecycle `detail` does not](../../../DISCOVERIES.md#action-detail-carries-index-and-event-lifecycle-detail-does-not).
- `stampBench` still runs. The default handler swallows the
  throw.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Logger, `window.onerror`, and the `error` listener |
| [`wick_lamp_controller.js`](wick_lamp_controller.js) | Throws in `connect()` |
| [`lens_cabinet_controller.js`](lens_cabinet_controller.js) | Throws, then stamps |

**Try it**

The wick reads "Wick lamp reached connect." Logger lines 1.
The first tape block is:

```
format %s

%o

%o
message Error connecting controller
error wick buried
keys identifier, controller, element
element wick-lamp
index none
event none
target 
```

The onerror tape reads `onerror Error connecting controller |  | 0 | 0 | wick buried`.
Error events 0. The bench reads "Prism is seated." The stamp
reads "Bench is quiet." Break the prism. The bench reads
"Prism cracked on the bench." The stamp reads "Bench stamped."
Logger lines 2. The second block's message is
`Error invoking action "click->lens-cabinet#breakPrism"`,
keys `identifier, controller, element, index, event`, element
`lens-cabinet`, index `0`, event `click`, target `break-prism`.
The onerror tape gains the same message, an empty source, line
0, column 0, and `prism cracked`. Error events stays 0.
