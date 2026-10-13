# Action parameters · 10 · Courier dispatch slip

North Dock couriers. One card is a dispatch slip and a radio call. The
send button runs both controllers, and each reads only its own params.

**What it teaches**

- `data-dispatch-slip-route-code-param` and
  `data-dispatch-slip-stop-count-param` are visible to `dispatch-slip`
  only. `stop-count` arrives as the number `stopCount`.
- `data-courier-radio-channel-name-param` and
  `data-courier-radio-priority-param` are visible to `courier-radio`
  only. `priority` arrives as the boolean `true`.
- The identifiers `dispatch-slip` and `courier-radio` do not nest, so
  neither param pattern matches the other's attributes.
- Both actions are on the same button and run in `data-action` order.
  Each gets a params object built for its identifier.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The slip, importmap, and both registrations |
| [`dispatch_slip_controller.js`](dispatch_slip_controller.js) | Reads the route and the stop count |
| [`courier_radio_controller.js`](courier_radio_controller.js) | Reads the channel and the priority |

**Try it**

Send the slip. The slip log lists `routeCode` and `stopCount`, and says
the channel is missing. The radio log lists `channelName` and `priority`,
and says the route is missing.
