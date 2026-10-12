# Keyboard filters · 01 · Pharmacy refill confirmation

Harborview Pharmacy's refill bench. Preparing a fill for Marisol Keene
opens a confirmation dialog. Escape closes it from anywhere on the page,
including the NDC lookup that sits beside the dialog rather than inside it.

**What it teaches**

- `keydown.esc@document->refill-dialog#dismiss` is a keyboard filter on a
  global target. Stimulus listens on `document` while the dialog controller
  is connected.
- A local `keydown.esc` on the dialog element would miss Escape while focus
  is in the NDC lookup. Keydown goes to the focused element and bubbles
  through its ancestors, never sideways to a sibling.
- The `@document` action also runs while the dialog is closed, so `dismiss()`
  returns immediately unless the dialog is open.
- The built-in filter name is `esc`, matching `event.key` `"Escape"`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Bench markup, dialog, importmap, and controller registration |
| [`refill_dialog_controller.js`](refill_dialog_controller.js) | Opens, confirms, and dismisses from Escape |
| [`refill_desk_controller.js`](refill_desk_controller.js) | Holds the bench status the dialog writes to |

**Try it**

Press "Prepare refill", then Escape: the dialog closes and focus returns
to the button. Open it again, click the NDC lookup, and press Escape: the
dialog still closes, which a local `keydown.esc` on the dialog would not
do. Open it once more and confirm the fill.
