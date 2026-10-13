# Targets · 10 · Archive request desk

The Whatcom County reading room. The desk itself is the walk-up slip.
Deed 1842 is an ordinary slip. The probate request is marked rush, so
its attribute is two tokens. One slip still carries the old
`data-target` stamp as well as the current attribute. The card catalog
slip has only the old stamp. A nested desk holds a map request.

**What it teaches**

- `slipTargets` includes the controller element when that element
  matches, then descendants in document order, skipping a nested
  `request-desk`. `querySelectorAll` does not include the desk element
  and does not skip the nested map.
- An exact `[data-request-desk-target="slip"]` misses `slip rush`.
  Stimulus uses `~=`, a token match, so the probate slip is included.
- Legacy `data-target="request-desk.slip"` still matches. Those matches
  are appended after the modern ones, not merged into document order.
  A slip with both attributes appears twice. The first time it is found,
  Stimulus warns to replace `data-target` with `data-request-desk-target`.
- `querySelectorAll` returns a static list. The token list saved in
  `connect()` does not include the tax lien filed later. `slipTargets`,
  read in that same turn, does.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The desk, the nested desk, importmap, and registration |
| [`request_desk_controller.js`](request_desk_controller.js) | Compares target lookup with two selectors, then files a new slip |

**Try it**

Press "Compare lookups". Targets are Walk-up, Deed 1842, Probate rush,
Dual stamp, Dual stamp, Card catalog. The exact query is Deed 1842,
Dual stamp, Inner map. The token query is Deed 1842, Probate rush,
Dual stamp, Inner map. The console warns once each for the dual stamp
and the card catalog. File the tax lien. Targets become Walk-up,
Deed 1842, Probate rush, Dual stamp, Tax lien, Dual stamp, Card catalog.
The token list saved at connect is still Deed 1842, Probate rush,
Dual stamp, Inner map.
