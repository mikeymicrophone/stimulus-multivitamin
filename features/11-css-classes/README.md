# CSS classes

static classes, [name]Class, [name]Classes, and has[Name]Class: letting markup decide which class names a controller applies.

Official reference: <https://stimulus.hotwired.dev/reference/css-classes>

## Examples (13 of 13 bottled)

01. [Icehouse brine tags](01-icehouse-brine-tags/) — available
02. [Alder damper board](02-alder-damper-board/) — available
03. [Netshed mend flags](03-netshed-mend-flags/) — available
04. [Kelp dryer trays](04-kelp-dryer-trays/) — available
05. [Ilwaco end labeler](05-ilwaco-end-labeler/) — available
06. [Buoy depot paint rack](06-buoy-depot-paint-rack/) — available
07. [Mukilteo ramp lamps](07-mukilteo-ramp-lamps/) — available
08. [Fresnel lens cabinets](08-fresnel-lens-cabinets/) — available
09. [Turn Point foghorn](09-turn-point-foghorn/) — available
10. [Lummi reefnet tally](10-lummi-reefnet-tally/) — available
11. [Terminal shed lamps](11-terminal-shed-lamps/) — available
12. [Strait chart locker](12-strait-chart-locker/) — available
13. [Seattle traffic board](13-seattle-traffic-board/) — available

## What each scenario adds

| Slot | CSS class technique |
| --- | --- |
| 01 | `static classes`, kebab-case `data-[identifier]-[name]-class`, `this.[name]Class`, and add/remove on the controller element |
| 02 | Several logical classes, swapped on the element so only one state token remains |
| 03 | `this.[name]Classes` for a space-separated stack, against the singular property which is only the first token |
| 04 | `has[Name]Class`, a fallback when the attribute is absent, and the throw from `this.[name]Class` in `connect()` and in an action |
| 05 | An empty or whitespace attribute: `has` is true, the plural list is `[]`, and the singular value is `undefined` |
| 06 | The same classes applied to targets, while a class attribute on a target is ignored |
| 07 | A value-change callback paints markup-owned classes. The action only writes the value |
| 08 | One controller, three instances, each with its own lit and dark stacks |
| 09 | `classList.toggle` of one class, and the force-flag trap when a stack is spread into `toggle` |
| 10 | Inherited logical names, read through the subclass identifier |
| 11 | `wharf` + `shedLamp` and `wharf-shed` + `lamp` share one attribute. The pile names do not |
| 12 | Live reads, no setter, an object or a string `static classes` ignored, and a camelCase or underscore miss |
| 13 | Values, callbacks, targets, a priority stack, per-sector tokens, and a missing class thrown from a value callback |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
