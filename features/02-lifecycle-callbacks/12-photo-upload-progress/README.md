# Lifecycle callbacks · 12 · Photo upload progress

A Keystone Home Inspections inspector attaches photos to report IR-3307. The
`inspection-report` controller starts an upload for each photo and
re-renders its whole photo list whenever photos are added, removed, or
regrouped by room. Each row is a `photo-upload` controller showing one
upload's thumbnail, room, and progress. Uploads are simulated by
`upload_queue.js`, so nothing leaves your browser.

**What it teaches**

- A view's lifetime and its work's lifetime are different. Uploads live in
  a module-level queue, keyed by id, for as long as the page is open. Rows
  are rebuilt on every re-render. `disconnect()` stops watching an upload
  but never cancels it. Only the Cancel button does. Compare
  [03 · Live scoreboard poller](../03-live-scoreboard-poller/), where the
  request belongs to the tile and `disconnect()` aborts it.
- `connect()` re-attaches by identity. A new row reads its upload id from a
  Stimulus value, looks the upload up in the queue, and renders its current
  progress, so a re-render in the middle of a transfer picks up where it was.
- Release per-view resources in `disconnect()`. Each row makes its own
  thumbnail with `URL.createObjectURL()` and revokes it when it disconnects.
  An object URL keeps the file's bytes in memory until it is revoked, so
  without that, every re-render would leak a full-size photo per row.
- State that must survive a re-render lives outside the instance. The room
  each photo belongs to is stored on the upload in the queue, not on the
  row, so regrouping keeps every assignment.
- Watching with an `AbortSignal` makes "stop listening" a single
  `abort()`, both for each row's progress listener and for the report's
  queue listener.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Report markup, sample photo list, importmap, and controller registration |
| [`photo_upload_controller.js`](photo_upload_controller.js) | One disposable row per upload; watches progress and owns a thumbnail URL while connected |
| [`inspection_report_controller.js`](inspection_report_controller.js) | Starts uploads and re-renders the photo list |
| [`upload_queue.js`](upload_queue.js) | The long-lived upload queue, with simulated transfers |
| [`report-sent.html`](report-sent.html) | The server's confirmation |

**Try it**

Click "Add sample photos" (or attach your own) and watch four uploads
start. Tick "Group by room" mid-upload: every row is rebuilt, and each one
picks up at the same percentage. Cancel the electrical panel photo and
remove it. Attach another photo, set its room to Exterior, and regroup: it
lands under Exterior. In the elements panel, each thumbnail's `blob:` URL
changes on every re-render, because the old one was revoked. Send the report
once everything has uploaded.
