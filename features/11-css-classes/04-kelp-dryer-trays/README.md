# CSS classes · 04 · Kelp dryer trays

Fidalgo Island dryer. Dulse has a scorching class. Wing kelp does
not, and falls back to steady. Nori reads the missing class from
`connect()`.

**What it teaches**

- `hasScorchingClass` is true only when
  `data-dryer-tray-scorching-class` is on the controller element.
  Dulse reads `scorchingClass` `tray-scorch` and `scorchingClasses`
  `["tray-scorch"]`.
- Wing kelp has no scorching attribute. `hasScorchingClass` is
  false. `scorchingClasses` is `[]` and does not throw. The tray
  adds `steadyClass` instead. See
  [The singular class throws only when the attribute is absent](../../../DISCOVERIES.md#the-singular-class-throws-only-when-the-attribute-is-absent).
- The wing kelp button reads `scorchingClass` with no guard.
  `handleError` reports `Error invoking action "click->dryer-tray#readScorching" :: Error: Missing attribute "data-dryer-tray-scorching-class"`. The connect reading stays.
- Nori's `guard` value is false, so `connect()` reads
  `scorchingClass` and stops. The reading stays "Nori connect
  reached the missing class." `handleError` reports
  `Error connecting controller :: Error: Missing attribute "data-dryer-tray-scorching-class"`. Dulse and wing kelp still connect.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three trays, the fault list, importmap, and registration |
| [`dryer_tray_controller.js`](dryer_tray_controller.js) | Falls back when scorching is absent, and reads it anyway when unguarded |

**Try it**

Dulse opens "Dulse hasScorchingClass true. scorchingClass tray-scorch.
scorchingClasses ["tray-scorch"]. steadyClass tray-steady. Fallback
false. On the tray none." Wing kelp opens "Wing kelp
hasScorchingClass false. scorchingClass (not read). scorchingClasses
[]. steadyClass tray-steady. Fallback true. On the tray tray-steady."
Nori's reading is "Nori connect reached the missing class." The
handled list has one line: `Error connecting controller :: Error:
Missing attribute "data-dryer-tray-scorching-class"`. Read the
scorching class on wing kelp. The wing kelp reading does not change.
The handled list gains `Error invoking action "click->dryer-tray#readScorching" :: Error: Missing attribute "data-dryer-tray-scorching-class"`.
Read it on dulse. The dulse reading becomes "Dulse scorchingClass
tray-scorch."
