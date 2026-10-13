# Action options · 12 · Community solar cancel

South Ridge Solar Co-op. Evelyn Cho's 2.4 kW share is active. Cancelling
it has to be deliberate: the method must not run until the acknowledgement
box is checked. A custom `:confirmed` option is what blocks it.

**What it teaches**

- A custom option blocks the action by returning `false`.
  `click->solar-share#cancelShare:confirmed` only invokes `cancelShare()`
  when the callback returns `true`. Here that means the acknowledgement
  box is checked. Returning `false` leaves the subscription line
  untouched — the method never runs.
- The callback uses `controller` (the `solar-share` instance, which
  exposes the box) and `element` (the Cancel button that declared the
  action).
- `:!confirmed` sets `value` to `false`. The same callback returns `true`
  in that branch without reading the box, so Keep my share always runs.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Share card, acknowledgement box, `registerActionOption("confirmed")` |
| [`solar_share_controller.js`](solar_share_controller.js) | Cancels or keeps the share after the option allows it |

**Try it**

Press "Cancel my share" with the box empty: the option log shows
`returned=false`, the status says the cancellation was blocked, and the
share is still active. Check the box and press Cancel again: the share
line becomes "No active share." Press "Keep my share" at any time: that
button uses `:!confirmed` and always runs.
