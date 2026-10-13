# Targets

static targets, the singular, plural, and has-existence properties, optional targets, and targets shared between controllers on the same element.

Official reference: <https://stimulus.hotwired.dev/reference/targets>

## Examples (13 of 13 bottled)

01. [Harbor tide board](01-harbor-tide-board/) — available
02. [County bus route card](02-county-bus-route-card/) — available
03. [Marina moorage bill](03-marina-moorage-bill/) — available
04. [Seed packet label press](04-seed-packet-label-press/) — available
05. [Garden work day](05-garden-work-day/) — available
06. [Rehearsal dinner seating](06-rehearsal-dinner-seating/) — available
07. [Costume shop pull list](07-costume-shop-pull-list/) — available
08. [Bakery oven queue](08-bakery-oven-queue/) — available
09. [Apartment meter bank](09-apartment-meter-bank/) — available
10. [Archive request desk](10-archive-request-desk/) — available
11. [Clinic intake sections](11-clinic-intake-sections/) — available
12. [Trail work crew](12-trail-work-crew/) — available
13. [Orchestra seating chart](13-orchestra-seating-chart/) — available

## What each scenario adds

| Slot | Target technique |
| --- | --- |
| 01 | `static targets`; singular, plural, and `has`; the missing singular throws when it is read |
| 02 | Several names on one element; the singular is the first match in the document |
| 03 | One element targeted by two controllers; the attribute is exact, not a prefix match |
| 04 | Tokens are not camelized; an undeclared name has no getter |
| 05 | Targets are read lazily; a connect-time list goes stale; the connected callback runs after that read |
| 06 | A card inside a `<template>` is not a target until it is cloned into the document |
| 07 | Iterating and filtering the plural list; a hidden element stays; the singular ignores the filter |
| 08 | Document order, including after a move; CSS `order` does not change it |
| 09 | A nested controller with the same identifier is a scope boundary; a different identifier is not |
| 10 | Targets versus `querySelector`, including the legacy `data-target` attribute |
| 11 | Inherited `static targets` use the subclass identifier |
| 12 | Scope is re-checked on every read, including after a person moves into a nested crew |
| 13 | Template, filter, order, a shared element, several names, nested scope, `has`, and a missing singular |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
