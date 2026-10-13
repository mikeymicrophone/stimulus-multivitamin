# Outlets · 01 · Port Townsend hoist log

Point Hudson haul-out. The Quincy drum and the Discovery drum sit
on the dock, outside the log cards. Each log names its own winch.

**What it teaches**

- `static outlets = ["winch"]` declares the other controller's
  identifier. Stimulus adds `winchOutlet`, `winchOutlets`,
  `winchOutletElement`, `winchOutletElements`, and `hasWinchOutlet`.
- The attribute is `data-hoist-log-winch-outlet`. Its value is a
  CSS selector (`#quincy-winch`, `#discovery-winch`). The winch
  does not have to sit inside the log.
- `this.winchOutlet.ease()` runs on the winch controller and
  returns the new strain. `strainValue` and `labelTarget` are
  read from that same outlet.
- With one id in the selector, the singular outlet, the plural
  list, and the element list all describe that one drum.
  `hasWinchOutlet` is true.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two drums, two logs, importmap, and registration |
| [`hoist_log_controller.js`](hoist_log_controller.js) | Declares the winch outlet and eases it |
| [`winch_controller.js`](winch_controller.js) | Holds the strain, the label, and `ease()` |

**Try it**

The Quincy log opens "Quincy drum strain 4. hasWinchOutlet true.
Outlet quincy-winch. Outlets 1. Elements 1. connected." The
Discovery log opens "Discovery drum strain 2. hasWinchOutlet true.
Outlet discovery-winch. Outlets 1. Elements 1. connected." Ease
the Quincy drum. Its reading says "Quincy drum strain 3." and
"eased to 3." The Discovery log still says strain 2.
