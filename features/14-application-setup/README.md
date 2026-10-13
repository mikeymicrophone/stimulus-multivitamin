# Application setup and registration

`Application.start()`, `register()`, `load()`, and `unload()`, the static `shouldLoad` and `afterLoad` hooks, `application.debug` and the logger, schema customization, more than one application on a page, and import-map registration without a build step.

Official reference: <https://stimulus.hotwired.dev/handbook/installing>

## Examples (13 of 13 bottled)

01. [Bush Point range board](01-bush-point-range-board/) — available
02. [Cape Flattery lens cabinet](02-cape-flattery-lens-cabinet/) — available
03. [Destruction Island foghorn](03-destruction-island-foghorn/) — available
04. [Grays Harbor retort shift](04-grays-harbor-retort-shift/) — available
05. [Kalama elevator tape](05-kalama-elevator-tape/) — available
06. [Bay Center ticket load](06-bay-center-ticket-load/) — available
07. [Nahcotta barge watch](07-nahcotta-barge-watch/) — available
08. [Point No Point bell book](08-point-no-point-bell-book/) — available
09. [Cattle Point fog logger](09-cattle-point-fog-logger/) — available
10. [Colman Dock shed](10-colman-dock-shed/) — available
11. [Slip Point light schema](11-slip-point-light-schema/) — available
12. [Anacortes pilot importmap](12-anacortes-pilot-importmap/) — available
13. [Ediz Hook pitfalls](13-ediz-hook-pitfalls/) — available

## What each scenario adds

| Slot | Registration technique |
| --- | --- |
| 01 | `Application.start()` with no element, `Application.start(document.body)`, and `Application.start(element)`. The root contains itself. A head meta is outside the body |
| 02 | One constructor registered under two identifiers. `afterLoad` once per name. `instanceof` versus `constructor` |
| 03 | `register` after the router is running connects elements already in the document, then `afterLoad`. Markup added inside `afterLoad` connects on a later microtask |
| 04 | `shouldLoad` as a getter, a method, a field, the string `"false"`, and an inherited getter. The check is at `register` time |
| 05 | `afterLoad` before `connect` when `register` shares a turn with `start()`. The reverse order once the router is running. `this` is the constructor |
| 06 | `load` and `unload` with an array, a dropped extra argument, a nested array that throws, and `shouldLoad: false` inside the array |
| 07 | `unload`, a new instance on the next `register`, `stop()` without `disconnect`, and `start()` again picking up DOM changes without reconnecting a lamp that stayed |
| 08 | `getControllerForElementAndIdentifier`: the element you pass, a second identifier, `null`, and an element outside the root |
| 09 | `application.debug` and a custom logger. Same-turn timing. `?debug=0`. A logger that throws after the action method |
| 10 | Two applications whose roots overlap, so one click runs twice. A third schema that only changes `controllerAttribute` |
| 11 | Renamed controller, action, and target attributes. `keyMappings` added versus replaced. Target callbacks ignore the renamed attribute |
| 12 | `window.Stimulus` is not set by the library. Import-map specifiers become identifiers. A pending set so two new elements register once |
| 13 | Duplicate `register`, `shouldLoad: false` does not unload, two `Application.start()` calls versus `start()` on the same instance, a quoted identifier, case, and a repeated token |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
