# Outlets · 07 · New Dungeness lens desk

The first-order Fresnel and the keeper's slate. The desk outlets
to both. One identifier is kebab-case. The other is namespaced
with `--`.

**What it teaches**

- `static outlets = ["lens-cabinet", "keeper--slate"]` declares
  two identifiers. `lens-cabinet` becomes `lensCabinetOutlet`
  and `data-lens-desk-lens-cabinet-outlet`. `keeper--slate`
  becomes `keeperSlateOutlet` and
  `data-lens-desk-keeper--slate-outlet`. The double hyphen is
  collapsed only in the property name.
- The properties do not stand in for each other.
  `hasLensCabinetOutlet` and `hasKeeperSlateOutlet` are both
  true, for different elements.
- The desk reads `orderValue` and `legendTarget` on the cabinet
  and calls `advanceOrder()`. It reads `keeperValue` and
  `signedValue` on the slate and calls `signWatch()`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The cabinet, the slate, the desk |
| [`lens_desk_controller.js`](lens_desk_controller.js) | Two outlets, two actions |
| [`lens_cabinet_controller.js`](lens_cabinet_controller.js) | The `lens-cabinet` identifier |
| [`keeper_slate_controller.js`](keeper_slate_controller.js) | The `keeper--slate` identifier |

**Try it**

The desk opens "lensCabinetOutlet fresnel order 1. Legend First
order. keeperSlateOutlet slate keeper Mara. Signed false.
hasLensCabinetOutlet true. hasKeeperSlateOutlet true.
connected." Advance the order. The reading says "order 2" and
"order 2" at the end. Sign the slate. The reading says "Signed
true." and "signed by Mara." The legend is still "First order."
