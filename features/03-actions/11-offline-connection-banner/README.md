# Actions · 11 · Offline connection banner

A field technician's work order at Northgate Heating & Air. The tablet
loses signal in basements. A `connection-banner` controller listens for
`offline` and `online` on the window. The `job-notes` controller on the
work order listens for the same `online` event, plus `visibilitychange` on
the document, so notes written while the tablet is offline go out when the
connection returns, even if the tablet slept through the `online` event.

**What it teaches**

- `online` and `offline` fire on `window` only. The descriptors say
  `online@window` and `offline@window`. The same events with `@document`
  would never run, and nothing would report the mistake.
- `visibilitychange` fires on `document` and bubbles to `window`, so either
  target hears it. This page uses `@document` to make the difference
  visible.
- Two controllers can answer the same global event. The banner and the
  notes both declare `online@window`, and each does its own job: the banner
  reports the connection, the notes send the outbox.
- Global events report changes, not state. A page that loads already
  offline never sees `offline`. Both controllers read `navigator.onLine`
  when they need the current state, starting in `connect()`.
- Notes queued while offline are cloned from a `<template>` whose Retry and
  Discard buttons already carry `data-action`. Stimulus binds them as each
  note arrives and unbinds them when the note is sent or discarded.

**Stimulus behavior worth knowing**

- `@window` and `@document` are the only global targets a descriptor can
  name. Writing any other target after `@` doesn't fail loudly: the whole
  string before `->` becomes the event name, so
  `online@navigator->…` would listen on the element for an event literally
  named `online@navigator`.
- The banner's stylesheet sets `display: flex`. Without
  `[hidden] { display: none !important; }`, a `[hidden]` banner would still
  show, because a class's `display` overrides the user-agent rule for
  `[hidden]`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Work order markup, the window and document actions, importmap, and controller registration |
| [`connection_banner_controller.js`](connection_banner_controller.js) | Shows the connection state from window events |
| [`job_notes_controller.js`](job_notes_controller.js) | Saves, queues, retries, and sends job notes |
| [`dispatch/note-received.json`](dispatch/note-received.json) | The dispatch office's reply to a note |

**Try it**

Write a note while online: it goes to "Sent to dispatch" immediately. Turn
off the network (or the browser's offline toggle) and write two more. The
banner appears, and Retry on a waiting note explains that it will go out on
its own. Discard one. Turn the network back on: the banner says "Back
online" and the waiting notes send. The banner hides a few seconds later.
