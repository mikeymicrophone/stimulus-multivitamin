# Controllers · 04 · Kanban board with independent columns

The Cyclepath bike-share team's sprint board. The board is one `kanban-board`
controller. Every column, plus the "Blocked" lane nested inside
"In progress", is its own `kanban-column` instance with its own card count
and work-in-progress limit.

**What it teaches**

- Controllers nest. The board's element contains every column's element, and
  each column is an independent instance.
- Scope follows the DOM, live. A column's `cardTargets` are whatever cards
  sit inside its element right now, so moving a card's element is all it
  takes to move it between columns. The old column re-counts through its
  `cardTargetDisconnected` callback without being told.
- Scope stops at a nested element with the same identifier. The "Blocked"
  lane is a `kanban-column` inside a `kanban-column`. Its `list`, `count`, and
  `card` targets belong to the lane, so blocked cards don't count against the
  "In progress" limit.
- One element can be a target of two controllers. Each card is a
  `kanban-board` card (the board sees all of them) and a `kanban-column`
  card (a column sees only its own).
- The board moves a card by calling `acceptCard()` on the destination's
  controller instance, found with
  `application.getControllerForElementAndIdentifier()`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Board markup, importmap, and controller registration |
| [`kanban_board_controller.js`](kanban_board_controller.js) | Sees every card; moves cards and keeps their buttons in sync |
| [`kanban_column_controller.js`](kanban_column_controller.js) | One instance per column and per nested lane; counts its cards and flags its limit |

**Try it**

Move "Show dock distance in the station list" forward into "In progress". The
column goes over its limit of 2. Now block one of its cards: the card drops
into the nested lane, "In progress" falls back to 2 / 2, and the lane's own
count goes up. Move a card forward from the lane and it leaves both.
