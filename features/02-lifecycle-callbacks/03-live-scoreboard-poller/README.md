# Lifecycle callbacks · 03 · Live scoreboard poller

Friday night in the Tri-County girls' basketball league. Every game tile is a
`score-poller` controller that fetches the next update from the league feed
every ten seconds while it is on the page. Each update names the URL to ask
next, like a cursor. The `scoreboard` controller pins games to the top and
unfollows them.

**What it teaches**

- `connect()` starts polling and `disconnect()` stops it. Stopping means
  clearing the pending timer and aborting the request in flight with an
  `AbortController`, so a reply that arrives after the tile is gone never
  writes into it.
- Poll with a `setTimeout` chain instead of `setInterval`. Each poll schedules
  the next one only after it finishes, so a slow feed never piles up
  overlapping requests.
- Moving an element disconnects and reconnects the same instance. Pinning a
  game moves its tile to the top: Stimulus calls `disconnect()` (the poll in
  flight is aborted) and then `connect()` (a new poll starts). The cursor
  was set in `initialize()` and lives on the instance, so polling resumes
  where it left off instead of replaying the game from the first update.
- `visibilitychange@document->score-poller#visibilityChanged` pauses polling
  while the tab is hidden and polls right away when it comes back. Stimulus
  attaches that global listener when the controller connects and removes it
  when it disconnects.
- `connect()` checks state before starting work. A finished game never polls
  again, even if its tile is moved.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Scoreboard markup, importmap, and controller registration |
| [`score_poller_controller.js`](score_poller_controller.js) | One instance per game; polls while connected and aborts on disconnect |
| [`scoreboard_controller.js`](scoreboard_controller.js) | Pins and unfollows games |
| [`feeds/`](feeds/) | Feed updates for each game; each names the next one to ask for |

**Try it**

Open the network panel and watch each game ask for its next update every ten
seconds. Lakeside at North Ridge goes final after three more updates and stops
asking. Pin Westfield at Cedar Grove: the tile jumps to the top and keeps its
score, and the next request continues from the same update. Unfollow a game
while its request is pending, and the request shows as cancelled. Switch to
another tab for a while: no requests go out until you come back.
