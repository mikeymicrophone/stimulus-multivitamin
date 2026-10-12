# Keyboard filters · 03 · Darkroom contact sheet

Jules Amaro is proofing roll 26 at Copperplate Darkroom. The filmstrip
steps through six frames with the left and right arrow keys, but only
while the strip has focus.

**What it teaches**

- `keydown.left` and `keydown.right` are the built-in names for
  `ArrowLeft` and `ArrowRight`. The mapping is `left` → `"ArrowLeft"`, not
  `"left"` or `"Left"`.
- The actions sit on the filmstrip. They run only while the strip (or a
  frame inside it) has focus. They are not `@window` listeners, so arrows
  in the sleeve-label field do nothing to the sheet.
- `showPrevious()` and `showNext()` call `preventDefault()` so the arrows
  do not scroll the page.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Viewer, filmstrip, sleeve label, importmap, and registration |
| [`contact_sheet_controller.js`](contact_sheet_controller.js) | Steps through frames on left and right |
| [`frames/`](frames/market-awning.svg) | The six proof frames |

**Try it**

Click frame 14, then press the right arrow: the viewer moves to the
fishmonger. Keep going to wrap from 19 back to 14. Click the sleeve
label and press the arrows: the sheet does not move, because the filters
are not global.
