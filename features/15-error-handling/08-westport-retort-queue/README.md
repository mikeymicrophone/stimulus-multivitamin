# Error handling · 08 · Westport retort queue

Four ways to save a retort chart at Westport, plus a kettle
watch whose `connect()` is `async`.

**What it teaches**

- `saveSync` throws into `handleError`:
  `Error invoking action "click->retort-chart#saveSync" | chart pencil snapped`.
- `saveEarly` is `async` and throws before any `await`.
  The caller still receives a promise, so the `try` does
  not catch it. `saveLate` throws after `await`.
  `saveReturned` returns `Promise.reject`. All three are
  `unhandledrejection` and not `handleError`. See
  [A rejected promise from an action never reaches `handleError`](../../../DISCOVERIES.md#a-rejected-promise-from-an-action-never-reaches-handleerror)
  and
  [An `async` lifecycle method rejects outside `handleError`, and the scan continues](../../../DISCOVERIES.md#an-async-lifecycle-method-rejects-outside-handleerror-and-the-scan-continues).
- `kettle-watch` writes "Kettle watch wrote the slate." and
  then its async `connect()` rejects with `kettle slate tore`.
  The floor clock, later in the document, reads "Floor clock
  connected." Marking the kettle still runs.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Handled list and rejection list |
| [`retort_chart_controller.js`](retort_chart_controller.js) | Four saves |
| [`kettle_watch_controller.js`](kettle_watch_controller.js) | Async `connect()` |
| [`floor_clock_controller.js`](floor_clock_controller.js) | Connects after that rejection |

**Try it**

The kettle reads "Kettle watch wrote the slate." The floor
clock reads "Floor clock connected." Rejections reads
`kettle slate tore`. Handled stays "No handled error." Mark
the kettle. It reads "Kettle marked." Save in sync. The chart
reads "Sync save started." Handled 1, with the pencil message.
Save before await. The chart reads "Early save started."
Handled stays 1. Rejections gains `cook never started`. Save
after await. Rejections gains `retort lost pressure`. Return
a refusal. Rejections gains `ticket refused`. Handled stays 1.
