# Target callbacks · 04 · Canal lock queue

The upper chamber is holding a grain barge, a sand barge, and an empty
butty. The lockkeeper can move a boat up the queue, lay the grain barge
by, or shift the whole lock to the lower pier.

**What it teaches**

- Moving the sand barge earlier runs `boatTargetDisconnected` and then
  `boatTargetConnected`. The note says the barge is still in this lock,
  because the node is already in its new place. `connect` stays at 1.
  The passage count goes from 1 to 2 because the connected callback
  runs again.
- Laying by the grain barge runs only the disconnected callback, and
  the note says it left this lock. The barge is still on the page, in
  the lay-by. This is a target moving, not the controller move in
  [A move is `disconnect()` then `connect()` on the same instance](../../../DISCOVERIES.md#a-move-is-disconnect-then-connect-on-the-same-instance-and-isconnected-is-true-inside-disconnect).
- Shifting the lock element runs the way-out pair and then the way-in
  pair on the same instance: `disconnect boats=3`, each boat
  disconnected, each boat connected, `connect 2`. `initialize` stays
  one line. Every passage count goes up again.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Upper pier, lay-by, lower pier, importmap, and registration |
| [`lock_queue_controller.js`](lock_queue_controller.js) | Notes boat callbacks and lock connections |

**Try it**

The log starts with `initialize`, three boats connected, and
`connect 1`. Each boat has one passage. Move the sand barge earlier.
The log adds a disconnected line that says it is still in this lock,
then a connected line, and the lock is still on `connect 1`. The sand
barge shows two passages and stands ahead of the grain barge. Shift
the lock. The chamber is under Lower pier, the log shows
`disconnect boats=3` before the boat lines and then `connect 2`, and
`initialize` is still a single line. Every passage count has gone up.
Lay by the grain barge. It sits under Lay-by on the upper pier, and
the log says it left this lock, with no new connected line.
