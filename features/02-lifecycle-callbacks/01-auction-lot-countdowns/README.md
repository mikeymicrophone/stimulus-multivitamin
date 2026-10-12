# Lifecycle callbacks · 01 · Auction lot countdowns

The clerk's console for Hargrove & Finch's online sale of mid-century
furnishings. Every lot is a `lot-countdown` controller with its own clock and
anti-sniping rule. The `auction-catalog` controller around the lots filters,
withdraws, and relists them, and counts how many clocks are running.

**What it teaches**

- `initialize()` runs once per controller instance, and `connect()` runs every
  time the element enters the document. The server sends "closes in N
  seconds" (so a client with a wrong clock still counts down correctly), and
  each lot turns that into a deadline in `initialize()`. Doing it in
  `connect()` would restart the clock every time the lot is hidden and shown.
- `connect()` starts a `setInterval` and `disconnect()` clears it. Hidden,
  withdrawn, and closed lots stop ticking, and the "clocks ticking" count
  drops with them.
- Re-inserting an element reconnects its existing instance. "Closing within a
  minute" detaches lots and later puts the same elements back. Their
  instances resume with the correct time because every tick reads the
  deadline instead of decrementing a counter.
- New HTML gets a new instance. A relisted lot arrives as a server fragment,
  so `initialize()` runs again with the server's new closing time and opening
  bid.
- `connect()` decides what to start from the current state. A lot that closed
  while it was hidden comes back closed and does not start a clock.

**Stimulus behavior worth knowing**

- `disconnect()` runs after the element has left the document. An event
  dispatched from a detached element never bubbles to its old ancestors, and
  `this.element.closest()` can't find them either. Each lot keeps a
  reference to the catalog element from `connect()` and dispatches its
  `lot-countdown:clock-stopped` event there with `this.dispatch(name, { target })`.
  [Controllers · 05](../../01-controllers/05-recipe-card-collection/) has a
  related case: targets you can't look up in `disconnect()`.
- The catalog hears every lot's `clock-started` event on page load because
  parents connect before their children, so its actions are already bound
  when the lots connect.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Catalog markup, importmap, and controller registration |
| [`lot_countdown_controller.js`](lot_countdown_controller.js) | One instance per lot; sets the deadline once and ticks while connected |
| [`auction_catalog_controller.js`](auction_catalog_controller.js) | Filters, withdraws, and relists lots; counts running clocks |
| [`relisted/lot-101.html`](relisted/lot-101.html) … [`lot-105.html`](relisted/lot-105.html) | Server fragments for relisted lots |

**Try it**

Watch the chandelier (lot 103) close at 0:00. The count drops to four
clocks. Choose "Closing within a minute": the lots with more time left
disappear and the count drops again. Wait a few seconds, then choose "All
lots". The returning lots show the correct time immediately, because they
are the same instances with the same deadlines. Bid on the lamps in their
last 30 seconds to extend the lot. Withdraw the trolley, then relist it: it
comes back as a new instance with a fresh four-minute clock.
