# Target callbacks · 10 · Letterpress job dockets

Wedding programs and the seed catalog are already in the tray. The
press numbers a docket when its target callback runs. The serial is
written into a paragraph that is not itself a target.

**What it teaches**

- `docketTargetConnected` can change the docket's text. That write does
  not add or remove a target, so it does not re-enter the callback.
  Wedding programs is serial 1. The seed catalog is serial 2. A poetry
  broadside added from the button is serial 3.
- Chasing the form inserts Chapel cards from the button, and that
  callback inserts Ghost form before it returns. Stimulus pauses the
  target observer for the duration of the callback and does not scan
  again afterward, so Ghost form never gets `docketTargetConnected`.
  It stays "Unnumbered". The tray does not fill with further ghosts.
- Deferring one overrun inserts Run-on posters, and the callback queues
  a microtask that inserts Overrun. The observer is listening again by
  then, so Overrun is numbered. A callback that always deferred another
  docket would not stop. A throw inside a target callback is worse: it
  is not passed to `handleError`, the observer stays paused, and later
  targets are silent. This tray never throws.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Job tray, importmap, and registration |
| [`job_docket_controller.js`](job_docket_controller.js) | Stamps serials and inserts the ghost form from the callback |

**Try it**

Wedding programs reads "Serial 1" and the seed catalog reads "Serial 2".
Add the poetry broadside. It reads "Serial 3". Chase the form. Chapel
cards is numbered, Ghost form is in the tray and still says
"Unnumbered", and the note says the press never called back. Defer one
overrun. Run-on posters and Overrun are both numbered, and Ghost form
is still unnumbered.
