# Targets · 09 · Apartment meter bank

The building's meter closet, and Unit 2's closet inside it. Both are
`meter-bank` controllers. The laundry water heater is a different
controller sitting in the building's closet.

**What it teaches**

- A target is in scope when the nearest element with this identifier is
  this controller's element. Unit 2 is also `meter-bank`, so its kitchen
  meter, and the unit element itself (it is marked as a meter), are out
  of the building's `meterTargets`.
- The water heater is `water-heater`, not `meter-bank`. The laundry
  meter inside it is still a building meter.
- Each bank reads `meterTargets` when "Read the meters" runs. The
  boundary is applied at that read. The building total is Lobby lights
  plus Laundry heater, 55 kWh. Unit 2 is its own panel plus the kitchen,
  102 kWh.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Building bank, water heater, Unit 2, importmap, and registration |
| [`meter_bank_controller.js`](meter_bank_controller.js) | Sums the meters in this bank's scope |
| [`water_heater_controller.js`](water_heater_controller.js) | Reads the heater model and does not own the laundry meter |

**Try it**

On load, the building line is "Lobby lights, Laundry heater = 55 kWh"
and Unit 2 is "Unit panel, Kitchen = 102 kWh". The heater note names
the Rheem. Read the meters again: the same totals. Unit 2's kitchen is
not in the building line, and the laundry meter is not in Unit 2's line.
