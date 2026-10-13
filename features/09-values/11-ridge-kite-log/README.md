# Values · 11 · Ridge kite log

A box kite on the Cape Flattery ridge, gusting 22 knots. The valley
form's station name is still on the card, stamped with the parent
identifier.

**What it teaches**

- `static values` is inherited. `ridge-log` declares `gustKnots` and
  still has `stationNameValue` and `launchedValue` from `kite-log`.
  The base controller is registered. No element uses `kite-log`.
- The attribute uses the identifier on the element.
  `data-ridge-log-station-name-value` is Cape Flattery.
  `data-kite-log-station-name-value` says "Copied from the valley
  form" and is not the station. See
  [Inherited values use the subclass identifier](../../../DISCOVERIES.md#inherited-values-use-the-subclass-identifier).
- `launched` is a bare `Boolean`. It is missing, so the value is
  false and `hasLaunchedValue` is false. Marking the kite launched
  assigns `true` and writes `data-ridge-log-launched-value="true"`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The ridge card, importmap, and both registrations |
| [`kite_log_controller.js`](kite_log_controller.js) | Station name and launched |
| [`ridge_log_controller.js`](ridge_log_controller.js) | Gusts, and the reading that ignores the valley attribute |

**Try it**

The card opens "Station Cape Flattery. hasStationNameValue true. Own
attribute Cape Flattery. Stray attribute Copied from the valley form.
Launched false. hasLaunchedValue false. Launched attribute absent.
Gust 22. hasGustKnotsValue true. Gust attribute 22." Mark the kite
launched. The reading becomes "Launched true. hasLaunchedValue true.
Launched attribute true." The station is still Cape Flattery.
