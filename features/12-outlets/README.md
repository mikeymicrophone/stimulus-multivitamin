# Outlets

static outlets, [name]Outlet, [name]Outlets, [name]OutletElement, [name]OutletElements, has[Name]Outlet, and outlet connected/disconnected callbacks for controllers that coordinate without nesting.

Official reference: <https://stimulus.hotwired.dev/reference/outlets>

## Examples (13 of 13 bottled)

01. [Port Townsend hoist log](01-port-townsend-hoist-log/) — available
02. [Friday Harbor fuel dock](02-friday-harbor-fuel-dock/) — available
03. [Neah Bay entrance log](03-neah-bay-entrance-log/) — available
04. [La Push skiff line](04-la-push-skiff-line/) — available
05. [Willapa seed barge](05-willapa-seed-barge/) — available
06. [Blaine retort floor](06-blaine-retort-floor/) — available
07. [New Dungeness lens desk](07-new-dungeness-lens-desk/) — available
08. [Marrowstone fog desk](08-marrowstone-fog-desk/) — available
09. [Sequim Bay staff gate](09-sequim-bay-staff-gate/) — available
10. [Ballard lamp bank](10-ballard-lamp-bank/) — available
11. [Pier 91 shed office](11-pier-91-shed-office/) — available
12. [Quillayute chart desk](12-quillayute-chart-desk/) — available
13. [Rosario watch floor](13-rosario-watch-floor/) — available

## What each scenario adds

| Slot | Outlet technique |
| --- | --- |
| 01 | `static outlets`, `data-[identifier]-[outlet]-outlet` as a CSS selector, the singular controller, and calling a method while reading a value and a target |
| 02 | One selector, many matches. Singular is document order. A class match with the wrong identifier is not an outlet |
| 03 | `[name]OutletConnected` and `[name]OutletDisconnected`. Callback before the outlet's `connect()`. Host `disconnect()` before the outlet callbacks |
| 04 | Selector changes, removing the attribute, and adding the controller token later |
| 05 | Missing-element errors for an absent attribute, an empty selector, and the wrong controller. A `connect()` throw does not skip the next controller |
| 06 | Element present, controller not registered. `has` is true, the element getter works, the plural warns, the singular throws. Registering later connects |
| 07 | Kebab-case `lens-cabinet` and namespaced `keeper--slate` as two different properties |
| 08 | Outlet method return versus `dispatch`. A sibling does not hear the event. A missing outlet throws before the dispatch |
| 09 | Reading the controller getter in `connect()` before the outlet has connected, and the removal that does not disconnect it |
| 10 | DOM removal inside the connected callback. The outlet controller disconnects immediately. `outletDisconnected` waits |
| 11 | `pier` + `shed-lamp` and `pier-shed` + `lamp` share one attribute. `pile-lamp` does not |
| 12 | Inherited outlets, a non-array `static outlets`, a camelCase attribute miss, and `--` colliding with `-` |
| 13 | Callback before the host's `connect()`, an outlet in `head`, a callback throw that skips the rest of the scan, and an invalid selector |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
