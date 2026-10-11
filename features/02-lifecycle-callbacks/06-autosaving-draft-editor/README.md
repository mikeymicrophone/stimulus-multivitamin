# Lifecycle callbacks · 06 · Autosaving draft editor

The Eastside Tool Library is applying for a Larkspur Community Foundation
grant. Each long-answer section is a `draft-autosave` controller that saves
a draft in this browser a moment after the applicant stops typing, and
restores it on the next visit. The `grant-application` controller opens a
section in a full-screen focus mode and submits the application.

**What it teaches**

- `initialize()` is for work that must happen once per instance. Restoring
  the saved draft and recording the session's starting word count happen
  there. Focus mode moves the editor into a `<dialog>` and back, and each
  move runs `connect()` again. If the baseline were taken in `connect()`,
  "+N this session" would drop to zero every time you entered focus mode.
- `disconnect()` saves pending changes instead of dropping them. A move, a
  removal, and a page swap all end in `disconnect()`, and a debounced save
  that never fires is lost work. Enter focus mode mid-sentence and the draft
  is saved at that moment.
- `connect()` can be nearly empty. This controller's real work is in
  `initialize()`, its actions, and `disconnect()`.
- `disconnect()` can't tell why its element went away. After a successful
  submit, the form controller calls `markSubmitted()` on each editor before
  replacing the form. Otherwise each editor's `disconnect()` would flush its
  pending save and write the draft back right after submission cleared it.

**Stimulus behavior worth knowing**

- `disconnect()` does not run when the tab is closed, reloaded, or navigated
  away. Stimulus only reacts to DOM changes, and unloading the page doesn't
  remove any elements. The editor declares
  `pagehide@window->draft-autosave#flushPendingSave` and
  `visibilitychange@document->draft-autosave#flushIfHidden` to save at those
  moments too. Stimulus removes both listeners when the editor disconnects.
- Targets can be read in `initialize()`. The element is already in the
  document when Stimulus creates the instance, just before the first
  `connect()`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Application form, focus-mode dialog, importmap, and controller registration |
| [`draft_autosave_controller.js`](draft_autosave_controller.js) | Restores once, saves after a pause, and saves pending changes on disconnect and pagehide |
| [`grant_application_controller.js`](grant_application_controller.js) | Moves editors in and out of focus mode and submits the application |
| [`submitted.html`](submitted.html) | The server's confirmation that replaces the form |

**Try it**

Add a sentence to the project summary and watch "Unsaved changes…" turn into
"Draft saved". Type a few more words and open focus mode right away: the
status says the draft was saved, and the session word count carries over.
Write in focus mode, close it, and reload the page: both sections say
"Restored your draft". Try "Discard draft" to go back to the server's text.
Finally, type something and submit before the save fires. The confirmation
replaces the form, and reloading shows no restored draft.
