# Actions · 13 · Spreadsheet-style cell editing

The weekly harvest board at Cedar Hollow CSA. Each cell is a crate count
for a crop on a packing day. Click a cell to edit it, type a number, then
Tab, Enter, or an arrow key to move, Escape to cancel, or click elsewhere
to commit. Add a crop from the form, or pull in last week's extras; every
new cell arrives with the same `click` action already on it.

**What it teaches**

- A `<td>` has no default event, so every cell names `click` explicitly:
  `click->harvest-board#editCell`. The click usually starts on the number
  button inside the cell (`event.target`); `editCell` reads the cell from
  `event.currentTarget`.
- The same click then reaches `click@document->harvest-board#commitIfOutside`.
  By then that cell is already being edited, so the board doesn't commit
  it. A click on the heading, another cell, or "Add crop" is outside, and
  the open cell commits first. This is the same click order as
  [Menu that closes on outside click](../09-menu-that-closes-on-outside-click/).
- The editor is one `<input>` that moves from cell to cell. Its
  `keydown->harvest-board#editWithKeys` and
  `input->harvest-board#previewTotals` actions travel with it. Enter and
  the arrows commit and move; Escape restores the previous value; Tab and
  Shift+Tab walk the grid.
- Rows added from a `<template>` or fetched from last week carry the same
  `data-action` on every cell. Stimulus binds the new cells after the
  insert, the same way
  [Hotel booking date range](../10-hotel-booking-date-range/) binds new day
  buttons. `addCrop()` calls `startEdit()` directly instead of clicking,
  so the new row can be edited in the same turn.
- Totals update as you type, not only on commit, because `previewTotals`
  re-reads the editor.

**Stimulus behavior worth knowing**

- A cell clicked in the same synchronous turn it was inserted has no
  action yet. The board never clicks a brand-new cell; it calls
  `startEdit()`. Waiting a microtask is enough if you really need to
  dispatch a click to a new cell — see
  [Hotel booking date range](../10-hotel-booking-date-range/).
- The editor's `input` default event is `input`. `keydown` has to be named.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Harvest board markup with a `data-action` on every cell, importmap, and controller registration |
| [`harvest_board_controller.js`](harvest_board_controller.js) | Edits cells, moves the editor, totals the board, adds and removes crops |
| [`last-week/extra-crops/`](last-week/extra-crops/) | Last week's extra crops, as a server fragment |

**Try it**

Click Monday's kale and type `10`. The week total updates as you type.
Press Tab to Wednesday, then the down arrow onto the tomatoes. Click the
heading: the tomatoes cell commits. Add "Cilantro" and type a count in the
cell that opens. Press "Add last week's extras" for garlic scapes and
sugar snap peas, then edit one of those new cells. Remove the dill.
