# Error handling · 04 · Waadah error wire

Three wires listen at Waadah: `window.onerror`, an `error`
event, and `unhandledrejection`.

**What it teaches**

- Sounding the horn throws synchronously. `handleError` runs.
  `window.onerror` is called with
  `Error invoking action "click->horn-wire#sound"`, an empty
  source, line 0, column 0, and the `Error`. The `error`
  listener does not run. `unhandledrejection` does not run.
  See
  [Default `handleError` calls `window.onerror` with an empty source and does not dispatch an `error` event](../../../DISCOVERIES.md#default-handleerror-calls-windowonerror-with-an-empty-source-and-does-not-dispatch-an-error-event).
- Fetching the tide is `async` and throws after `await`.
  That rejection never reaches `handleError` or
  `window.onerror`. Only `unhandledrejection` hears
  `range lost`. See
  [A rejected promise from an action never reaches `handleError`](../../../DISCOVERIES.md#a-rejected-promise-from-an-action-never-reaches-handleerror).
- Striking the raw bell is a listener added with
  `addEventListener`, not a Stimulus action. The browser
  calls `window.onerror` with a page source and a real line,
  and the `error` event runs. `handleError` does not.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The three wires and the raw bell |
| [`horn_wire_controller.js`](horn_wire_controller.js) | The horn and the tide fetch |

**Try it**

All three wires are quiet. Handled 0. The horn reads "Horn
wire is quiet." Sound the horn. The horn reads "Horn
started." Handled 1. The property wire reads
`onerror Error invoking action "click->horn-wire#sound" | empty | 0 | 0 | horn cable parted`.
The event wire stays "No error event." The rejection wire
stays "No rejection." Fetch the tide. The horn reads "Tide
fetch started." Handled stays 1. The rejection wire reads
`rejection range lost`. The other two wires stay as they
were. Strike the raw bell. The event wire reads
`event Uncaught Error: raw bell cracked`. The property wire
gains a second line whose source label is `page` and whose
line is not 0. Handled stays 1.
