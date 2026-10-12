# Action options · 13 · Permit photo uploader

Kestrel Falls building department. Permit BP-2026-1842 needs a JPEG or PNG
of the site plan for the ell at 18 Quarry Road. Drops must not navigate
the browser to the file, must not run while offline, and must reject a
PDF. Sending must stay on this page and must not run twice.

**What it teaches**

- Built-in and custom options stack on one descriptor.
  `dragover->permit-upload#markDropzone:prevent:stop` and
  `drop->permit-upload#queueDroppedPhoto:prevent:stop:online:accepted`
  cancel the browser's file navigation, keep the event off ancestors,
  then let custom `:online` and `:accepted` decide whether the method
  runs.
- `:online` reads `navigator.onLine`. `:accepted` reads the file from the
  event and the accepted types from the controller. Either returning
  `false` blocks the action; `queueDroppedPhoto()` never sees that drop.
- The file picker uses
  `change->permit-upload#queuePickedPhoto:online:accepted`. Submit uses
  `submit->permit-upload#sendPacket:prevent:once`. After the first send,
  the button is disabled: `:once` has dropped `:prevent` too, and a
  second submit would otherwise POST to `filed/`.
- Custom filters run in descriptor order with the built-in ones. On drop,
  `:prevent` and `:stop` run first (they always return true), then
  `:online`, then `:accepted`. An offline drop is still cancelled, so the
  browser does not navigate to the file.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Dropzone, file picker, `registerActionOption` for `online` and `accepted` |
| [`permit_upload_controller.js`](permit_upload_controller.js) | Queues photos and sends the packet after the options allow it |

**Try it**

Pick a JPEG of a site plan: it appears in the queue. Send packet: the
confirmation stays on this page. Send again: the submit count stays 1.
Reload, go offline in the browser tools, and pick a file: the option log
shows `:online` returning false and the queue stays empty. Pick a PDF
while online: `:accepted` returns false.
