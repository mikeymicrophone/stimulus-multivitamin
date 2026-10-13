# Targets · 06 · Rehearsal dinner seating

Cedar and Salt is seating a rehearsal dinner. Priya Shah is already at
table 4. The blank place card lives in a template. It is not a guest
until it is cloned onto the chart.

**What it teaches**

- `guestTargets` only includes guests in the document. The card inside
  `cardBlueprint`, a `<template>`, is not among them. Stimulus finds
  targets with `querySelectorAll`, and that method does not look inside
  a template's contents.
- The template element is itself a target, so the chart can clone
  `cardBlueprintTarget.content`. Appending the clone makes a guest
  target on that same turn.
- Excusing a guest removes the element, and the next `guestTargets`
  read no longer lists them. The blueprint still holds one card.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Seated guest, the place-card template, importmap, and registration |
| [`rehearsal_dinner_controller.js`](rehearsal_dinner_controller.js) | Seats and excuses guests, and counts the blueprint separately |

**Try it**

The status seats Priya Shah at table 4 and says the blueprint holds one
guest who is not in `guestTargets`. The name and table fields already
say Jonah Ellis and 2. Seat the guest. The status now lists Priya and
Jonah, and the blueprint count is still 1. Excuse Priya. Only Jonah
remains seated.
