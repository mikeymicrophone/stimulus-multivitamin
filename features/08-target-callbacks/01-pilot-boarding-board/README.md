# Target callbacks · 01 · Pilot boarding board

Morning watch at the pilot station. North Star and Cape Mercy are
already on the boarding board. Taking the board down removes the
controller and leaves the ships on the wall.

**What it teaches**

- Targets that are already in the markup run `[name]TargetConnected`
  after `[name]ValueChanged` and before `connect()`. That order is
  [Callback order is initialize, value-changed, target-connected, then connect](../../../DISCOVERIES.md#callback-order-is-initialize-value-changed-target-connected-then-connect).
- `disconnect()` runs before any `shipTargetDisconnected`. The
  transcript shows `disconnect ships=0` first.
- Removing the identifier empties the getters during `disconnect()`,
  the same rule as
  [Targets vanish in `disconnect()` after the identifier is removed](../../../DISCOVERIES.md#targets-vanish-in-disconnect-after-the-identifier-is-removed).
  `shipTargetDisconnected` still receives each ship, which is still on
  the wall. The transcript element is saved from
  `transcriptTargetConnected` so the later lines have somewhere to go.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The morning board, importmap, and registration |
| [`pilot_board_controller.js`](pilot_board_controller.js) | Writes the transcript from the callbacks |

**Try it**

The transcript opens with `initialize`, `watchName Morning`,
`transcript connected`, both ships, then `connect`. North Star and
Cape Mercy are still listed under the transcript. Take the board down.
The transcript continues with `disconnect ships=0`, then
`transcript disconnected`, then each ship by name. Both vessel cards
are still on the page.
