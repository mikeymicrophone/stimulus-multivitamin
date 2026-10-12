# Action options · 08 · Clerk minutes editor

Millbrook City Clerk's draft for the 12 October council meeting. Save is a
window shortcut, Find is a field that must not submit the form, and
Escape closes Find from anywhere on the page. The action options, not the
methods, cancel those defaults.

**What it teaches**

- Keyboard filters and action options compose on one descriptor.
  `keydown.ctrl+s@window->minutes-editor#saveDraft:prevent` (and
  `meta+s`) lets `:prevent` cancel the browser Save dialog before
  `saveDraft()` runs. The method never calls `preventDefault()`.
- Find uses `keydown.enter->minutes-editor#findPassage:prevent` on the
  field so Enter does not submit the wrapping form. Escape is
  `keydown.esc@document->minutes-editor#closeFind:prevent`.
- Stimulus runs the key filter *before* action options
  (`willBeInvokedByEvent` then `applyEventModifiers`). A key that fails
  the filter never reaches `:prevent`. `keydown.enter` does not match
  Shift+Enter, so that chord is left to the browser.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Minutes form, Find panel, importmap, and registration |
| [`minutes_editor_controller.js`](minutes_editor_controller.js) | Saves, finds, and closes Find |

**Try it**

Press Ctrl+S (or ⌘S) from the minutes: the saved-at line reports
`defaultPrevented=true` and the browser Save dialog does not open. Open
Find, leave "Harbor Street" in the field, press Enter: one match, and the
URL does not become `filed/`. Press Escape: Find closes. Type in Find and
press Shift+Enter: that chord is not `keydown.enter`, so `:prevent` does
not run.
