# Target callbacks · 11 · Municipal compost scale

Parks crew brings 2 tons of leaf carts. Market crew brings 1 ton of
crate waste. Each truck has a reweigh button that exists only while
that truck is a target.

**What it teaches**

- `truckTargetConnected` adds that truck's tons and listens on its
  reweigh button. The chalk opens at 3 tons and 2 listeners. Reweighing
  Parks crew writes "Last reweigh: Parks crew, reweigh 1."
- `truckTargetDisconnected` subtracts the tons and removes the listener.
  Voiding Parks crew leaves 1 ton and 1 listener. Ghost reweighs stay
  0, because the removed button's listener was detached and then marked
  dead.
- Replacing the day's slip is one `innerHTML` write. Every truck still
  on the slip is disconnected before School kitchens is connected. After
  Parks crew has been voided, the tape subtracts Market crew and then
  adds School kitchens. The chalk ends at 3 tons and 1 listener.
  Reweighing School kitchens works.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Morning slip, importmap, and registration |
| [`compost_scale_controller.js`](compost_scale_controller.js) | Tons, listeners, and the tape |

**Try it**

The tally reads "Tons on the chalk: 3. Listeners: 2. Ghost reweighs: 0."
Reweigh Parks crew. The last reweigh names Parks crew. Void the parks
crew. The card is gone, the tally is 1 ton and 1 listener, and ghost
reweighs are still 0. Replace the day's slip. The tape subtracts Market
crew and then adds School kitchens. The tally is 3 tons and 1 listener.
Reweigh School kitchens. The last reweigh names that crew, and ghost
reweighs are still 0.
