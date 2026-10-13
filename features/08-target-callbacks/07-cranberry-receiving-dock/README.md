# Target callbacks · 07 · Cranberry receiving dock

The weigh shed opens with Scarlet Knight loose on the slip. Crimson
Queen is drawn in the standard-box blueprint and is not on the dock.
Four intakes put berries on the slip in different ways.

**What it teaches**

- A document fragment (the morning tote), `insertAdjacentHTML` (the
  late truck), `innerHTML` (the reprinted slip), and a cloned
  `<template>` (the standard box) each run `berryTargetConnected`
  after the action returns to the notice. The notice keeps the
  sentence it wrote while the ledger had not stamped the new berries,
  which is the same gap as
  [target getters querying the DOM when you read them](../../../DISCOVERIES.md#target-getters-query-the-dom-when-you-read-them).
  The callbacks themselves are batched after the DOM change, as in
  [lifecycle callbacks](../../../DISCOVERIES.md#lifecycle-callbacks-are-batched-after-the-dom-change).
- Nodes inside the blueprint are not berries until the clone is
  appended. See
  [Nodes inside a `<template>` are not targets](../../../DISCOVERIES.md#nodes-inside-a-template-are-not-targets).
  Dock openings stays 1.
- Reprinting the slip disconnects every current berry before it
  connects Stevens and Mullica Queen. Early Black and Howes were inside
  the morning tote: they have left the dock and are still packed in
  that tote. Scarlet Knight and Ben Lear were direct children: they
  left the dock and are not in a tote.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Slip, blueprint, importmap, and registration |
| [`receiving_dock_controller.js`](receiving_dock_controller.js) | Tips, reprints, and stamps, and writes the ledger |

**Try it**

The ledger shows `connected Scarlet Knight` and `dock open`. The notice
says Crimson Queen is still in the blueprint. Dock openings is 1. Tip
the morning tote. The notice says the getter already listed Early Black
and Howes and the ledger had not stamped them; the ledger now has both
connected lines. Log the late truck. Ben Lear is connected, and the
notice still says the ledger had not stamped Ben Lear yet. Reprint the
slip. The ledger disconnects Scarlet Knight as "not in a tote", Early
Black and Howes as "still packed in Morning tote", and Ben Lear as
"not in a tote", then connects Stevens and Mullica Queen. Stamp a standard box.
Crimson Queen is connected. Dock openings is still 1.
