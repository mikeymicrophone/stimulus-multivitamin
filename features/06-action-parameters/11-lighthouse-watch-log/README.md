# Action parameters · 11 · Lighthouse watch log

Cape Ann Light's evening watch. Enter stamps the watch from anywhere on
the page. A buoy button records a bearing from its own params.

**What it teaches**

- `keydown.enter@document->watch-log#stamp:prevent` is declared on the
  section, so `stationName` and `watchName` come from the section. The
  focused visitor field's `data-watch-log-visitor-name-param` is not
  read. The typed text is `event.target.value`, a separate channel.
- `:prevent` stops Enter in the visitor field from filing the log.
- `watch-log#markBuoy` is declared on the buoy button, so it reads
  `buoyName` and `bearingDegrees` from the button. `stationName` lives
  on the section and is missing for that action.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Watch form, buoy, importmap, and controller registration |
| [`watch_log_controller.js`](watch_log_controller.js) | Stamps the watch and marks a buoy |

**Try it**

Focus the visitor field and press Enter. The stamp names the Evening
watch at Cape Ann Light, says `visitorName` is missing, and quotes what
you typed. The log stays unfiled. Click File the log to file it. Mark
the northeast bell: 42 degrees, as a number, and `stationName` is missing
on that button.
