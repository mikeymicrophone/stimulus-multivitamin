# Outlets · 02 · Friday Harbor fuel dock

The Union dock at Friday Harbor. One selector names every fuel
pump. The empty housing wears the same class and a different
controller.

**What it teaches**

- `static outlets = ["fuel-pump"]` is a multi-word identifier.
  The properties are `fuelPumpOutlet`, `fuelPumpOutlets`,
  `fuelPumpOutletElement`, `fuelPumpOutletElements`, and
  `hasFuelPumpOutlet`. The attribute is
  `data-fuel-dock-fuel-pump-outlet=".fuel-pump"`.
- Several elements can match one selector. The singular outlet
  is the first in document order (`pump-diesel`). The plural
  list is diesel then gasoline.
- An element that matches the selector and does not carry the
  `fuel-pump` controller token is not an outlet. The housing's
  token is `pump-housing`, so it stays out of both lists.
- `closeHose()` and `openValue` are used on each outlet
  controller.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two pumps, the housing, the dock board, importmap, and registration |
| [`fuel_dock_controller.js`](fuel_dock_controller.js) | Reads the singular pump and closes every hose |
| [`fuel_pump_controller.js`](fuel_pump_controller.js) | Grade, open value, and `closeHose()` |
| [`pump_housing_controller.js`](pump_housing_controller.js) | The painted housing that is not a pump |

**Try it**

The board opens "Singular pump-diesel. Outlets pump-diesel
pump-gas. Elements pump-diesel pump-gas. hasFuelPumpOutlet true.
Housing pump-housing excluded. Diesel open true. Gas open true.
connected." Close every hose. The reading says "Diesel open
false. Gas open false. closed Diesel Gas." The singular pump is
still pump-diesel.
