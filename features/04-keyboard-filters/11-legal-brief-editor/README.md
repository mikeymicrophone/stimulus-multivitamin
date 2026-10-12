# Keyboard filters · 11 · Legal brief editor

Northshore Legal Aid's affidavit editor for Tomasz Wierzbicki. Ctrl+S
and Meta+S both save, whether the caret is in the contenteditable
affidavit, the caption field, or the notes.

**What it teaches**

- There is no `cmdorctrl` modifier. Save is declared twice:
  `keydown.meta+s@window` and `keydown.ctrl+s@window`. Command+S on macOS
  and Control+S elsewhere both reach `saveBrief()`. Meta is Command on
  macOS and the Windows key elsewhere; Ctrl is Control on every platform.
- The same pair exists for Shift+S (exhibit stamp) and B (bold).
  `keydown.ctrl+shift+s` does not match `keydown.ctrl+s`, because `shift`
  must be listed.
- The listeners sit on `window`, so they run while the caret is in the
  contenteditable affidavit, the caption `<input>`, or the notes
  `<textarea>`. `preventDefault()` stops the browser's Save dialog.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Caption, affidavit, notes, filters, importmap, and registration |
| [`legal_brief_controller.js`](legal_brief_controller.js) | Meta/Ctrl save, stamp, and bold from any field |

**Try it**

Click in the affidavit and press Ctrl+S (or ⌘S): the status names the
affidavit. Click the caption and save again: the status names the caption
field. Ctrl+Shift+S stamps Exhibit A. Select a phrase in the affidavit
and press Ctrl+B to bold it; the same shortcut in the notes does not wrap
plain text.
