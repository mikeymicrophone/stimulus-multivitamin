# Action parameters · 05 · Campus mail tray

North Campus mail room. One button routes a parcel and weighs it. Both
methods read that button's params. A second button only routes, and it
carries a different route code.

**What it teaches**

- Several actions on one element share that element's
  `data-mail-tray-*-param` attributes. `route` and `weigh` both see
  `routeCode`, `postageCents`, and `fragile`. You cannot attach a second
  param set to the second method on the same element.
- Each action builds a new object when it runs. `route` tags
  `event.params`, and `weigh` does not see that tag.
- A button with only `mail-tray#route` does not run `weigh`, and its
  params are its own attributes.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two parcels, importmap, and controller registration |
| [`mail_tray_controller.js`](mail_tray_controller.js) | Routes and weighs from `event.params` |

**Try it**

Send the east dorm parcel. The log routes EAST at 168 cents with fragile
`true`, then weighs the same numbers and says the weigh action got a fresh
params object. Route the west lab parcel. The log adds a WEST line and does
not weigh it.
