# Application setup and registration · 03 · Destruction Island foghorn

The foghorn is in the markup before anyone registers it. The
keeper brings it online with one click. `afterLoad` then mounts
the spare, and that spare connects before `afterLoad` returns.

**What it teaches**

- `Application.start()` returns before the router scans. A
  `register` in that same turn, like the horn log, runs
  `afterLoad` with no elements connected yet. The log's own
  `connect` comes afterwards.
- A `register` after the router is running (the button) finds
  scopes Stimulus already recorded for `fog-horn`. The main
  horn connects during `register`, then `afterLoad` runs, and
  `register` does not return until both are done.
- `getControllerForElementAndIdentifier` sees the main horn
  as soon as `register` returns. The spare was appended
  inside `afterLoad`, and it is not connected yet.
- Stimulus hears that append through a mutation observer.
  The spare's `connect` runs after `register` returns, as
  a microtask. The tape's "spare connect." is the last
  line, not a line in the middle of `afterLoad`.
- Sounding the horn before registration does nothing. The
  action has no controller yet.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The floor, the late `register`, the note written when `register` returns |
| [`horn_log_controller.js`](horn_log_controller.js) | Registered immediately |
| [`fog_horn_controller.js`](fog_horn_controller.js) | Late registration, `afterLoad` mounts the spare |

**Try it**

The log reads "Horn log is open." The tape reads "Tape is
empty." The note reads "Horn is not registered." The main horn
reads "Horn is mounted and not connected." Sound the horn.
Nothing changes. Bring the horn online. The tape reads "horn connect. afterLoad
start. afterLoad end. spare connect." The register note reads
"Register returned. Main present. Spare missing." The spare
note reads "After the mutation. Spare present." The main horn
reads "Horn connected." The spare reads "Spare horn connected."
Sound the horn. It reads "Horn sounded." Sound the spare. It
reads "Spare horn sounded."
