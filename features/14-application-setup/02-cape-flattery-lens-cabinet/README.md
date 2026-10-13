# Application setup and registration · 02 · Cape Flattery lens cabinet

The working Fresnel and the spare at Cape Flattery are one
controller class, registered twice.

**What it teaches**

- `application.register(identifier, constructor)` binds that
  constructor to one identifier. Calling it again with another
  identifier builds a second module. `this.identifier` is the
  one written on the element.
- `static afterLoad(identifier, application)` runs once for
  each `register`. `this` is the constructor you passed, so
  static fields are visible. The identifier argument is the
  name you registered, not a property of the class.
- These registrations happen in the same turn as
  `Application.start()`, so `afterLoad` runs before either
  cabinet connects. The tape shows the load lines first.
- `getControllerForElementAndIdentifier` returns the instance
  for that element and that identifier. The other identifier
  on the same element is `null`.
- The instance is `instanceof` the constructor you registered.
  `instance.constructor ===` that constructor is false.
  Stimulus blesses a subclass so targets and values can be
  installed per module.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two cabinets, one class, the identity line |
| [`lens_drawer_controller.js`](lens_drawer_controller.js) | Drawers, `afterLoad`, and `fileDrawer` |

**Try it**

The load tape reads "lens-cabinet Fresnel HTML. spare-cabinet
Fresnel HTML." The working cabinet reads "lens-cabinet is open."
The spare reads "spare-cabinet is open." The identity line reads
"instanceof true. sameConstructor false. spare instanceof true.
crossed null." File the north drawer. The working cabinet reads
"lens-cabinet filed the north drawer." File the spare drawer.
The spare reads "spare-cabinet filed the north drawer."
