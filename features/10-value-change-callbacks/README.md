# Value change callbacks

[name]ValueChanged(value, previousValue): when it fires, the initial call on connect, and deriving the whole UI from a single source of truth.

Official reference: <https://stimulus.hotwired.dev/reference/values#change-callbacks>

## Examples (13 of 13 bottled)

01. [Tide staff reading](01-tide-staff-reading/) — available
02. [Bell buoy ledger](02-bell-buoy-ledger/) — available
03. [Wharf office chalk](03-wharf-office-chalk/) — available
04. [Cap Sante net loft](04-net-loft-mending/) — available
05. [Totten Inlet nursery](05-oyster-nursery-card/) — available
06. [New Dungeness range](06-range-light-board/) — available
07. [Dosewallips tide gate](07-tide-gate-current/) — available
08. [Coupled fog bells](08-coupled-fog-bells/) — available
09. [Lime Kiln hydrophone](09-lime-kiln-hydrophone/) — available
10. [Anacortes cannery retorts](10-cannery-retort-chart/) — available
11. [Ferry sailing filters](11-ferry-sailing-filters/) — available
12. [Keeper watch slate](12-keeper-watch-slate/) — available
13. [Admiralty Inlet board](13-admiralty-inlet-board/) — available

## What each scenario adds

| Slot | Value-callback technique |
| --- | --- |
| 01 | The first call, including a missing attribute. `previousValue` is the default when the attribute is present, and `undefined` when it is absent |
| 02 | `(false, false)` versus `(false, undefined)`, a guard that skips the first paint, and which callbacks run again when the element reconnects |
| 03 | A controller assignment and another script's `setAttribute` share one callback. The same strings do not run it |
| 04 | Attribute order, then absent values. The target is readable before `targetConnected`. A write inside `connect()` lands after `connect()` returns |
| 05 | String, Number, Boolean, Array, and Object. Mutating a returned array or object does not fire. The same JSON does not. Lot `08` fires as `(8, 8)`. A bad value throws before `connect()` |
| 06 | Removing an attribute falls back to the default. Clearing `0` is `(0, 0)`. Removing `""` does not fire |
| 07 | One callback writes another value. The getter is already new before the first callback returns. A later attribute can lose its chalked text |
| 08 | Two values that chase until a cap, and two that stop because they refuse to write the value they already have |
| 09 | The bearing paints immediately. The band plot is debounced across a burst of assignments |
| 10 | The figure, the meter, the hidden record, and the status sentence come only from the callback, including a missing temperature and an outside `setAttribute` |
| 11 | The query string is restored in `initialize()` and written from the callbacks. Reading it in `connect()` restores the markup instead |
| 12 | `localStorage` restored in `initialize()`, and a slate that stores the markup before `connect()` reads the key. Forgetting must not write the defaults back |
| 13 | Station, height, horn, watches, and the sounding note. Derived stream with a guard, a debounced pilot call, the query string, mute in `localStorage`, and an outside correction |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
