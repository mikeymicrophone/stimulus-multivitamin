# CSS classes · 10 · Lummi reefnet tally

Legoe Bay, sockeye week. The gillnet tally declares `overLimit`.
The reefnet gear inherits it and adds `soaked`. The setnet skiff
inherits it and declares no classes of its own.

**What it teaches**

- `static classes` is collected from the class and its ancestors.
  `ReefnetTally` declares `soaked` and inherits `overLimit`, so
  both getters exist. `SetnetTally` declares nothing and still has
  `overLimitClass`. `soakedClass` is not a property on the gillnet
  or the setnet, so reading it is `undefined` and does not throw.
- The attribute is the instance's identifier.
  `data-reefnet-tally-over-limit-class` is the reefnet's over-limit
  class. `data-gillnet-tally-over-limit-class` is on that element
  and is not read. The setnet's attribute is
  `data-setnet-tally-over-limit-class`. See
  [Inherited class names use the subclass identifier](../../../DISCOVERIES.md#inherited-class-names-use-the-subclass-identifier).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three gears, importmap, and registration |
| [`gillnet_tally_controller.js`](gillnet_tally_controller.js) | Declares `overLimit` |
| [`reefnet_tally_controller.js`](reefnet_tally_controller.js) | Inherits `overLimit` and adds `soaked` |
| [`setnet_tally_controller.js`](setnet_tally_controller.js) | Inherits `overLimit` and declares none |

**Try it**

The Francis Lee opens "Francis Lee overLimitClass net-over.
hasOverLimitClass true. soakedClass in false. soakedClass undefined.
Over the limit false." The Lummi Bay gear opens "Lummi Bay gear
overLimitClass net-over. soakedClass net-soaked. Own attribute
net-over. Stray attribute parent-over. Wearing none." The Cherry
Point skiff opens "Cherry Point skiff overLimitClass net-over.
hasOverLimitClass true. soakedClass in false. soakedClass undefined.
Over the limit false." Mark the reefnet over the limit, then mark
it soaked. The reading says "Wearing net-over net-soaked." The
Francis Lee still says "Over the limit false."
