# Application setup and registration · 09 · Cattle Point fog logger

The fog desk at Cattle Point writes Stimulus debug lines onto
the page. The browser console is not the logger.

**What it teaches**

- `application.debug` starts false. `logDebugActivity` returns
  immediately, and the logger is not called.
- `Application.start()` waits on a microtask before it scans.
  Setting `debug` and `logger` in that same turn is early
  enough to record `application #starting`, `initialize`,
  `connect`, and `application #start`.
- The logger methods used are `groupCollapsed(title)`,
  `log("details:", detail)`, and `groupEnd()`. The title is
  `identifier #method`. For a controller, the detail object
  includes `identifier`. The application lines do not.
- An action is logged after the method returns. Silencing
  the tape (`debug = false`) leaves the next sound out of
  the tape. The horn reading still updates.
- `?debug=0` never turns debug on. The tape stays "Tape is
  quiet." The desk still connects.
- A logger that throws from `groupCollapsed` throws after
  `breakHorn` has written the desk. Stimulus reports that
  through `logger.error`. The first argument is the format
  string `%s\n\n%o\n\n%o`. The message is the second
  argument: `Error invoking action "click->fog-desk#breakHorn"`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Debug flag, both loggers, the query string |
| [`fog_desk_controller.js`](fog_desk_controller.js) | Desk, horn, and the breaking action |

**Try it**

The tape reads:

```
application #starting
fog-desk #initialize
detail fog-desk
fog-desk #connect
detail fog-desk
application #start
```

The desk reads "Fog desk connected." Sound the horn. The desk
reads "Horn sounded." The tape gains `fog-desk #sound` and
`detail fog-desk`. Silence the tape. The note reads "Tape
silenced." Sound the horn again. The desk still reads "Horn
sounded." The tape does not gain another line. Arm the
breaking logger. The note reads "Logger will throw." Break
the horn. The desk reads "Horn broke the tape." The tape gains
`fog-desk #breakHorn` and `reported Error invoking action
"click->fog-desk#breakHorn"`.

Open the page as `?debug=0`. The tape stays "Tape is quiet."
The desk still reads "Fog desk connected."
