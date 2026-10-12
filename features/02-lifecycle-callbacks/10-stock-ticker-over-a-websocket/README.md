# Lifecycle callbacks · 10 · Stock ticker over a WebSocket

A Northgate Brokerage watchlist with live prices. Every row is a `quote-row`
controller subscribed to one symbol on a single socket shared by the whole
page. The `watchlist` controller switches between server-rendered lists,
sorts by the day's change, and adds and removes rows. The `stream-status`
controller shows whether the socket is open, how many symbols it carries,
and how many times it has been opened.

**What it teaches**

- Subscribe in `connect()`, unsubscribe in `disconnect()`, and keep the
  function that undoes the subscription. `subscribe()` returns an
  `unsubscribe` function. The row stores it, and `disconnect()` calls it
  without looking anything up. `stream-status` follows the same pattern
  with `watchStatus()`.
- Shared resources belong to a module, not to one controller instance.
  `quote_stream.js` owns the socket, counts subscribers per symbol, opens the
  socket for the first subscriber, and closes it after the last one leaves.
- Moves and swaps unsubscribe and resubscribe within the same task. "Sort by
  change" moves every row, so each one disconnects and reconnects. Switching
  watchlists replaces every row, and the new rows subscribe to some of the
  same symbols the old ones just dropped. The stream waits one second
  before cleaning up, so neither closes and reopens the socket. The status
  line still says "socket opened once".
- New instances start blank. The stream keeps the last quote for each symbol
  and replays it on subscribe, so Microsoft has a price the moment the
  dividend list appears.

**Behavior worth knowing**

- Deferred cleanup must re-check, not be cancelled. An early version let
  `subscribe()` cancel the pending cleanup. A list switch then left the old
  list's symbols subscribed forever, because the cleanup that would have
  dropped them never ran. Now the cleanup always runs and only drops symbols
  that still have no listeners.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Watchlist markup with the first list rendered in, importmap, and controller registration |
| [`quote_row_controller.js`](quote_row_controller.js) | Subscribes on connect and calls its unsubscribe function on disconnect |
| [`watchlist_controller.js`](watchlist_controller.js) | Switches lists, sorts, adds, and removes rows |
| [`stream_status_controller.js`](stream_status_controller.js) | Watches the shared stream's status while connected |
| [`quote_stream.js`](quote_stream.js) | The shared, reference-counted stream with a cleanup grace period |
| [`simulated_quote_socket.js`](simulated_quote_socket.js) | Stands in for a real WebSocket so the page needs no server |
| [`watchlists/`](watchlists/) | Server-rendered watchlists |

**Try it**

Watch the prices tick green and red. Sort by change a few times and switch
to the dividend list and back: the status keeps saying "socket opened once"
while the symbol count follows the list. Remove every row and, a second
later, the socket disconnects. Add Costco and it reconnects: "opened 2
times".
