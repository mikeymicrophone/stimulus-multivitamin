# Dispatching custom events · 01 · Port Gamble tide staff

The staff at Port Gamble posts a tide. The log files the event
by its full name. The gauge card posts too, under its own
identifier.

**What it teaches**

- `this.dispatch("posted")` fires `tide-staff:posted`. The
  prefix is the registered identifier. The argument is the
  name, so `this.dispatch("line-changed")` fires
  `tide-staff:line-changed`.
- The returned event's `type` is that string. The log listens
  with `data-action="tide-staff:posted->tide-log#filePosted"`.
- `gauge-card` dispatching `"posted"` fires
  `gauge-card:posted`. A listener for `tide-staff:posted`
  does not see it. The log files the gauge only because it
  has a second action for that name.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The log wrapped around the staff and the gauge |
| [`tide_staff_controller.js`](tide_staff_controller.js) | Dispatches `posted` and `line-changed` |
| [`gauge_card_controller.js`](gauge_card_controller.js) | Dispatches `posted` under `gauge-card` |
| [`tide_log_controller.js`](tide_log_controller.js) | Files each event name separately |

**Try it**

The log opens "No entries. The log is open." The staff says
"Staff has not posted." Post 8.4 ft. The staff says
"Dispatched tide-staff:posted." The log says "tide-staff:posted
Port Gamble 8.4 ft. filed". Mark the south line. The staff
says "Dispatched tide-staff:line-changed." The log adds
"tide-staff:line-changed south." Post the gauge. The gauge
says "Dispatched gauge-card:posted." The log adds
"gauge-card:posted Port Gamble gauge 8.1 ft." It does not add
a second `tide-staff:posted`.
