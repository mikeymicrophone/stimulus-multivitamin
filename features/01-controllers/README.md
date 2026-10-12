# Controllers

Controller classes, identifiers and naming conventions, controller scope, many instances of one controller, nesting, and reaching other controllers through the application.

Official reference: <https://stimulus.hotwired.dev/reference/controllers>

## Examples (13 of 13 bottled)

01. [Invoice line-item editor](01-invoice-line-items/) — available
02. [Restaurant seat picker](02-restaurant-seat-picker/) — available
03. [Listing description editor](03-listing-description-editor/) — available
04. [Kanban board with independent columns](04-kanban-board/) — available
05. [Recipe card collection](05-recipe-card-collection/) — available
06. [Phone plan comparison table](06-phone-plan-comparison/) — available
07. [Shipment tracking timeline](07-shipment-tracking-timeline/) — available
08. [Nested comment thread](08-nested-comment-thread/) — available
09. [Parking garage occupancy panel](09-parking-garage-occupancy/) — available
10. [Podcast episode queue](10-podcast-episode-queue/) — available
11. [Classroom attendance roster](11-classroom-attendance-roster/) — available
12. [Warehouse pick list](12-warehouse-pick-list/) — available
13. [Mortgage application sections](13-mortgage-application-sections/) — available

## What each scenario adds

| Slot | Controllers technique |
| --- | --- |
| 01 | Identifiers, one instance per row, parent and child lookups, rows added from a template |
| 02 | Many independent instances of one class; instance state versus module-level state |
| 03 | Several controllers on one element; namespaced targets and actions; connect order follows `data-controller` order |
| 04 | Nested controllers; scope follows the DOM live and stops at a nested element with the same identifier |
| 05 | Controllers attached by fetched HTML and by adding or removing a `data-controller` token at runtime |
| 06 | `--` namespaced identifiers from subfolders (`plans/usage_estimator_controller.js` → `plans--usage-estimator`) |
| 07 | Sharing behavior through a base class; static targets and values merged across subclasses |
| 08 | A controller nested inside itself; per-instance scope boundaries for targets and actions |
| 09 | `this.application`, `application.controllers`, and `getControllerForElementAndIdentifier()` from plain JavaScript |
| 10 | A controller's public API versus `#private` internals; controller instances passed between controllers |
| 11 | Disposable instances when server-rendered fragments replace markup; state kept on a longer-lived controller |
| 12 | Composing a page: sibling controllers on one element, an element that is a target and a controller host |
| 13 | Capstone: namespaced base class and subclasses, finding controllers by `instanceof`, dynamic sections |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
