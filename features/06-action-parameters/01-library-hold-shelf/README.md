# Action parameters · 01 · Library hold shelf

East Branch circulation. A librarian pulls a hold, and the slip's button
carries the patron, the call number, and the pickup date as action params.

**What it teaches**

- `data-[identifier]-[name]-param` uses the controller identifier and a
  kebab-case param name: `data-hold-shelf-patron-name-param`.
- Stimulus camelizes that name on `-` and `_`. `patron-name` arrives as
  `event.params.patronName`, `call-number` as `callNumber`, and `pickup-by`
  as `pickupBy`.
- HTML lowercases attribute names before Stimulus sees them.
  `data-hold-shelf-patronName-param` is stored as
  `data-hold-shelf-patronname-param`, so the key is `patronname` and
  `event.params.patronName` is missing. Owen Hart's slip was imported that
  way.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Hold slips, importmap, and controller registration |
| [`hold_shelf_controller.js`](hold_shelf_controller.js) | Reads the camelCase keys off `event.params` |

**Try it**

Pull Marisol Keene's field guide. The slip lists `patronName`, `callNumber`,
and `pickupBy`. Pull Helen Cho's soup and the same keys carry her hold.
Pull Owen Hart's charts: `patronName` is missing and the value sits on
`patronname`, because the attribute was written in camelCase.
