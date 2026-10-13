# Error handling · 10 · Discovery Bay tile board

Tide, wind, and barometer on the Discovery Bay shed. One
thrown fault and one caught blank reading share an offline
state.

**What it teaches**

- `faultValueChanged` hides the live reading, shows the
  fallback sentence, and toggles `tile-offline` from
  `offlineClass`. The class token lives on the tile.
- `handleError` sets `detail.controller.faultValue` to
  `sensor tripped`. The tide fallback reads "Tide tile
  offline. Last good reading 6.4 ft." The clerk reads
  `Handled Tide.` plus the invoking message. Wind and
  barometer stay live.
- `readBlank` catches `Sensor blank.` and sets the same
  value. It dispatches `bay-tile:caught`. Handled stays 1.
  The barometer fallback reads "Barometer tile offline.
  Last good reading 30.12 in."
- `retry` sets `faultValue` to `""`. The tide live reading
  comes back and the offline class comes off.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three tiles and the clerk |
| [`bay_tile_controller.js`](bay_tile_controller.js) | Fault value and the offline class |
| [`clerk_controller.js`](clerk_controller.js) | The caught-fault note |

**Try it**

Tide live reads "Tide 6.4 ft." Wind live reads "Wind 12 kn."
Barometer live reads "Barometer 30.12 in." The fallbacks are
hidden. Handled 0. Trip the tide sensor. The tide live line
is hidden. The fallback reads "Tide tile offline. Last good
reading 6.4 ft." The tide article has class `tile-offline`.
The clerk reads
`Handled Tide. Error invoking action "click->bay-tile#failSensor"`.
Handled 1. Step the wind. Wind live reads "Wind 18 kn." Read
a blank sensor. The caught line reads "Caught in the action.
Barometer. Sensor blank." The barometer fallback reads
"Barometer tile offline. Last good reading 30.12 in."
Handled stays 1. Retry the tide. Tide live reads "Tide 6.4 ft."
and is shown. The tide article does not have `tile-offline`.
