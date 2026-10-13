# Target callbacks

[name]TargetConnected() and [name]TargetDisconnected(): reacting when targets are added to or removed from the DOM, including by server-rendered streams.

Official reference: <https://stimulus.hotwired.dev/reference/targets#connected-and-disconnected-callbacks>

## Examples (13 of 13 bottled)

01. [Pilot boarding board](01-pilot-boarding-board/) — available
02. [Tool library wall](02-tool-library-wall/) — available
03. [Orchard frost lanterns](03-orchard-frost-lanterns/) — available
04. [Canal lock queue](04-canal-lock-queue/) — available
05. [Smokehouse racks](05-smokehouse-racks/) — available
06. [Shortwave listening post](06-shortwave-listening-post/) — available
07. [Cranberry receiving dock](07-cranberry-receiving-dock/) — available
08. [Buoy tender charts](08-buoy-tender-charts/) — available
09. [Grain elevator ledger](09-grain-elevator-ledger/) — available
10. [Letterpress job dockets](10-letterpress-job-dockets/) — available
11. [Municipal compost scale](11-municipal-compost-scale/) — available
12. [Shipyard paint booths](12-shipyard-paint-booths/) — available
13. [Harbor night watch](13-harbor-night-watch/) — available

## What each scenario adds

| Slot | Target-callback technique |
| --- | --- |
| 01 | Order against `connect()` and `disconnect()`; the disconnected callback still receives the element after the identifier is removed |
| 02 | Targets present at open versus targets added later; the action's line runs before the callback |
| 03 | Adding or removing the target attribute on an element that stays in the tree |
| 04 | Moving a target inside the controller, out of it, and moving the controller element |
| 05 | A nested controller with the same identifier takes a target that moves in |
| 06 | Several names on one element; a trailing token versus a rewrite from the first token |
| 07 | Fragments, `innerHTML`, `insertAdjacentHTML`, and a cloned template, in one turn |
| 08 | A widget, a resize observer, and a listener attached and detached per target |
| 09 | A running total from the element argument while the getter already shows the whole batch |
| 10 | DOM writes that do not loop, and a target inserted while the observer is paused |
| 11 | Listeners and a tonnage total across a void and a slip replacement |
| 12 | Opening a nested controller around a target that does not move, versus rolling one in |
| 13 | Order, a batched sheet, a second name that owns a widget, a nested move, and taking the watch down |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
