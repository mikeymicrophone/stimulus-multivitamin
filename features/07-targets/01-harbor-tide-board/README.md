# Targets · 01 · Harbor tide board

The Port Townsend and Kingston boards at the ferry terminal. Each board
is a `tide-board`. Port Townsend has a small-craft advisory. Kingston
does not. Neither board has a filing slip.

**What it teaches**

- `static targets` declares the names. The markup token is
  `data-tide-board-target="reading"` (and `stationName`, `advisory`,
  `report`). Stimulus builds three properties for each name.
- `stationNameTarget` is the one heading. `readingTargets` is every
  reading on that board, in document order.
- `hasAdvisoryTarget` is how you ask whether the optional advisory
  element is present. Kingston never has one. Dismissing Port Townsend's
  advisory removes the element, and the next read is false. The singular
  `advisoryTarget` is only used when the check passes.
- `slipTarget` throws `Missing target element "slip" for "tide-board"
  controller` at the moment it is read. `slipTargets` is an empty array
  and `hasSlipTarget` is false. The boards still connect and render
  without a slip.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two tide boards, importmap, and registration |
| [`tide_board_controller.js`](tide_board_controller.js) | Renders a board from its targets and reports the missing slip |

**Try it**

Read Port Townsend: two readings and the small-craft advisory. Dismiss
the advisory and the report changes to "No advisory posted" while the
readings stay. Kingston already says that, because the advisory element
was never there. "File the missing slip" on either board reports
`hasSlipTarget false`, an empty `slipTargets` list, and the missing-target
error. The other board is unchanged.
