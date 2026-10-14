# Error handling

`application.handleError(error, message, detail)` reports throws from `initialize()`, `connect()`, `disconnect()`, and actions. Replacing it files the report somewhere else. Target, value, and outlet callbacks, and rejected promises, do not go through it.

Official reference: <https://stimulus.hotwired.dev/handbook/installing#error-handling>

## Examples (13 of 13 bottled)

01. [Tatoosh incident book](01-tatoosh-incident-book/) — available
02. [Mukilteo fare banner](02-mukilteo-fare-banner/) — available
03. [Patos lens tape](03-patos-lens-tape/) — available
04. [Waadah error wire](04-waadah-error-wire/) — available
05. [Partridge Point watch faults](05-partridge-point-watch-faults/) — available
06. [Sekiu pilot orders](06-sekiu-pilot-orders/) — available
07. [Ozette callback gap](07-ozette-callback-gap/) — available
08. [Westport retort queue](08-westport-retort-queue/) — available
09. [Fort Worden guard house](09-fort-worden-guard-house/) — available
10. [Discovery Bay tile board](10-discovery-bay-tile-board/) — available
11. [Hansville isolation](11-hansville-isolation/) — available
12. [Cape Disappointment report desk](12-cape-disappointment-report-desk/) — available
13. [Deception Pass fault line](13-deception-pass-fault-line/) — available

## What each scenario adds

| Slot | Error-handling shape |
| --- | --- |
| 01 | Replace `handleError` and file `error`, `message`, and `detail` (`identifier`, `element`, `controller`). `window.onerror` stays quiet |
| 02 | The same report drives a traveler-facing banner and a separate clerk log. Another controller keeps working |
| 03 | The default method: `logger.error("%s\n\n%o\n\n%o", message, error, detail)`, then `window.onerror(message, "", 0, 0, error)`. Connect detail has no `index` or `event` |
| 04 | Property `window.onerror` versus an `error` listener versus `unhandledrejection`, for a sync action, an async action, and a raw listener |
| 05 | Throws in `initialize()`, `connect()`, and `disconnect()`. Connect still follows initialize. Actions survive a connect throw. Disconnect still unbinds |
| 06 | A throw in the middle action does not skip the next one. A missing method is reported when the event fires |
| 07 | Target, value, and outlet callback throws never call `handleError`. The target observer stays stopped |
| 08 | Async actions and a returned rejection skip `handleError`. An async `connect()` does not abort the scan |
| 09 | `has[Name]Target`, `has[Name]Value`, `has[Name]Class`, and `has[Name]Outlet` before the singular getters. `try/catch` sets a fault value and class |
| 10 | `handleError` sets `faultValue` on `detail.controller`. The offline class and fallback markup follow. A caught failure uses the same value |
| 11 | A `connect()` throw leaves the neighbors up. A value-callback throw skips every later controller, and that controller's action still runs |
| 12 | Grouped reports, and the same message filed once per second |
| 13 | A throwing reporter, a throwing logger, async initialize and disconnect, option strings omitted from the message, a thrown string, and a throwing `handleError` during `initialize()` |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
