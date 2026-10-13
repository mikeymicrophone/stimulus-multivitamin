# Error handling · 01 · Tatoosh incident book

The watch office at Tatoosh files a foul tide-staff reading in an
incident book. The bell watch beside the staff keeps ringing.

**What it teaches**

- Assigning `application.handleError` replaces the default. This
  page does not call the original method, so nothing is written
  with `logger.error`.
- The arguments are `(error, message, detail)`. `message` is
  `Error invoking action "click->tide-staff#postReading"`.
  `error.message` is `Staff reading is foul.`
- `detail.identifier` is `tide-staff`. `detail.element` is the
  staff article. `detail.controller` is that controller instance,
  so `detail.controller.identifier` is `tide-staff` too.
- The lines above the `throw` have already run. The staff reads
  "Foul mark entered."
- Replacing the method skips the `window.onerror` call that lives
  inside the default. An `error` listener also stays quiet. See
  [Default `handleError` calls `window.onerror` with an empty source and does not dispatch an `error` event](../../../DISCOVERIES.md#default-handleerror-calls-windowonerror-with-an-empty-source-and-does-not-dispatch-an-error-event)
  and
  [Replacing `handleError` skips the logger and `window.onerror`](../../../DISCOVERIES.md#replacing-handleerror-skips-the-logger-and-windowonerror).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The incident book and both wires |
| [`tide_staff_controller.js`](tide_staff_controller.js) | Posts the foul reading |
| [`bell_watch_controller.js`](bell_watch_controller.js) | Rings after the incident |

**Try it**

The book reads "No incidents filed." Incidents 0. Onerror calls 0.
Error events 0. The staff reads "Staff is steady." The bell reads
"Bell is quiet." Post a foul reading. The staff reads "Foul mark
entered." The book reads:

```
Error invoking action "click->tide-staff#postReading" | tide-staff | tide-staff | Staff reading is foul. | instance tide-staff
```

Incidents 1. Onerror calls 0. Error events 0. Ring the bell. The
bell reads "Bell rang." Incidents stays 1.
