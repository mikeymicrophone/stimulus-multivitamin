# Lifecycle callbacks · 04 · Pet clinic visit date pickers

Maple Hollow Veterinary Clinic's visit request form. Each pet's preferred
date is a `visit-date-picker` controller wrapping a
[flatpickr](https://flatpickr.js.org/) calendar, loaded as a pinned ES module
through the importmap. The `visit-request` controller adds, removes, and
reorders pets, and shows how many pop-up calendars are attached to the page.

**What it teaches**

- Third-party widgets are built in `connect()` and torn down in
  `disconnect()`. flatpickr appends its pop-up calendar to `<body>`, outside
  the controller's element, so removing a pet's fieldset doesn't remove its
  calendar. Only `destroy()` does. Without it, every removed pet would leave
  an orphaned calendar and its document listeners behind. The count under the
  form shows this never happens.
- Don't count on a library to clean up after itself. flatpickr happens to
  destroy an old instance when it is initialized again on the same input, so
  a move wouldn't leak, but a removal gives it no such chance. Tearing down
  in `disconnect()` covers both cases.
- Keep durable state in the DOM, not in the widget. The chosen date is the
  `<input>`'s value, so moving a pet up (Stimulus disconnects and reconnects
  its date picker) builds a fresh widget that still shows the date.
- Fieldsets cloned from a `<template>` get their own widget when they
  connect, with no setup code in the form controller.

**Stimulus behavior worth knowing**

- `connect()` and `disconnect()` don't run inside the code that changes the
  DOM. Stimulus watches with a `MutationObserver`, whose callback runs as a
  microtask after the current code finishes. On the line after
  `petVisit.remove()`, the date picker hasn't disconnected yet. The form
  counts calendars on the next animation frame for that reason.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Visit request form, importmap with flatpickr, and controller registration |
| [`visit_date_picker_controller.js`](visit_date_picker_controller.js) | Builds a flatpickr calendar on connect and destroys it on disconnect |
| [`visit_request_controller.js`](visit_request_controller.js) | Adds, removes, and reorders pets; counts pop-up calendars |

**Try it**

Pick a date for Juniper (Sundays are closed), then move Juniper up. The date
is still there, and the count still shows two calendars for two pets. Add a
third pet and pick a date, then remove Biscuit. Open the elements panel and
look at the end of `<body>`: there is one `.flatpickr-calendar` per pet,
never more. Submit without a date to see which pet still needs one.
