# Target callbacks · 05 · Smokehouse racks

The floor rack and the cold smoke cabinet are both smoke racks. Salmon
and mackerel start on the floor. Trout is already in the cabinet.

**What it teaches**

- A nested controller with the same identifier is a scope boundary, as
  in [the meter-bank case](../../../DISCOVERIES.md#a-nested-controller-with-the-same-identifier-is-a-scope-boundary-re-checked-on-every-read).
  Trout's `sideTargetConnected` runs on the cabinet. The floor chalk
  opens at 16 lb, salmon and mackerel, and the slip agrees.
- Moving the salmon into the cabinet runs `sideTargetDisconnected` on
  the floor and `sideTargetConnected` on the cabinet. The floor chalk
  drops to 4 lb. The cabinet chalk rises to 21 lb. Both slips name the
  same sides as the chalk, because the callbacks fired.
- The floor's `connect()` does not run again. Mackerel never leaves.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Floor rack, cold smoke cabinet, importmap, and registration |
| [`smoke_rack_controller.js`](smoke_rack_controller.js) | Keeps each rack's pounds from the side callbacks |

**Try it**

The floor reads 16 lb (Salmon, Mackerel) and the slip matches. Cold
smoke reads 9 lb (Trout). Move the salmon into the cold smoke. Salmon
is listed under the cabinet. The floor chalk is 4 lb (Mackerel). The
cabinet chalk is 21 lb (Trout, Salmon). Each slip matches its chalk.
