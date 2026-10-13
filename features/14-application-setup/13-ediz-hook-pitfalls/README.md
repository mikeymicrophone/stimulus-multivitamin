# Application setup and registration · 13 · Ediz Hook pitfalls

Ediz Hook, the spit at Port Angeles, is where registration
goes wrong: twice, with the wrong case, and with a quote in
the identifier.

**What it teaches**

- `register` of an identifier that already has a module
  unloads it first. The old bell disconnects. The new
  instance runs `initialize` again.
- `register` of a constructor whose `shouldLoad` is false
  never reaches that unload. The day watch stays, and it
  is still a `DayWatchController`.
- `Application.start(element)` a second time is a new
  application. Assigning it to `window.Stimulus` does not
  stop the first one. A hail runs on both, so the count
  goes up by two.
- `application.start()` on an instance that is already
  started does not connect the lamp again.
- An identifier containing `"` is accepted by `register`.
  During the scan, `querySelectorAll` throws because
  `[data-slip"hook-target]` is not a selector. `initialize`
  has already run. `connect` does not. The controller is
  still listed. The next element in that scan, the after
  slip, never connects. The failure is an unhandled
  rejection, not `handleError`.
- `Bell-Case` does not match `data-controller="bell-case"`.
  The lowercase identifier does.
- Two copies of `tide-bell` in the attribute connect one
  instance. Removing one copy leaves that instance.
  Clearing the attribute disconnects it.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The buttons that trip each pitfall |
| [`ediz_bell_controller.js`](ediz_bell_controller.js) | Registered twice |
| [`day_watch_controller.js`](day_watch_controller.js) | Stays up |
| [`dark_watch_controller.js`](dark_watch_controller.js) | `shouldLoad` false |
| [`double_lamp_controller.js`](double_lamp_controller.js) | Two applications |
| [`restart_lamp_controller.js`](restart_lamp_controller.js) | `start()` again |
| [`quote_slip_controller.js`](quote_slip_controller.js) | Quoted identifier |
| [`after_slip_controller.js`](after_slip_controller.js) | Never reached |
| [`case_lamp_controller.js`](case_lamp_controller.js) | Case must match |
| [`tide_bell_controller.js`](tide_bell_controller.js) | Repeated token |

**Try it**

The bell reads "Ediz Hook bell instance 1." Register the bell
again. The tape reads "Bell disconnected." The bell reads
"Ediz Hook bell instance 2."

The day watch reads "Day watch is up." Register a dark watch
over it. The tape stays "Day watch has not disconnected." The
note reads "Still the day watch: true. Dark connected: false."
The watch still reads "Day watch is up."

The double lamp reads "1 connection." Start a second
application. It reads "2 connections." The note reads "Second
application registered." Hail the lamp. Hails read "Hails 2."

The restart lamp reads "Restart lamp connections 1." Start
the same application again. The note reads "Connections 1.
Was 1. Controllers 1."

Register the quoted slip. Initialize reads "Quote initialize
ran." Connect stays "Quote has not connected." The reading
starts "Listed slip"hook. After slip connected: false." and
contains `not a valid selector`. The after slip stays "After
slip is waiting."

The case lamp reads "Case lamp is dark." Register Bell-Case.
The note reads "Bell-Case found: false. bell-case found:
false." Register bell-case. The lamp reads "Case lamp is lit."

The tide bell reads "Tide bell connections 1." Drop the spare
token. The note reads "Same bell true. Connections 1." Clear
the token. The tide note reads "Tide bell disconnected."
