# Targets · 04 · Seed packet label press

Two packets on the glasshouse press. The Lacinato kale packet uses the
target names the controller declares. The Provider bean packet was set
from a value-attribute habit: kebab-case tokens, plus a botanical line
the controller never declared.

**What it teaches**

- The token in `data-label-press-target` must equal the `static targets`
  entry, including case. `varietyName` matches. `variety-name` does not.
  Stimulus camelizes values, classes, outlets, and action parameters. It
  does not camelize target names.
- `hasVarietyNameTarget` is `has` plus the declared name with its first
  character capitalized. The kale packet has the target. The bean packet
  does not, so printing it reads `varietyNameTarget` and catches
  `Missing target element "varietyName" for "label-press" controller`.
- `botanical` is not in `static targets`. `this.botanicalTarget` is
  `undefined` on both packets. It does not throw the missing-target
  error, whether or not an element carries that token.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Kale and bean packets, importmap, and registration |
| [`label_press_controller.js`](label_press_controller.js) | Prints a label, or the missing-target error |

**Try it**

Print the kale label: "Lacinato kale · 60 days. Sow after last frost."
and a botanical getter of `undefined`. Print the bean label. The fields
are on the page, but the press reports the missing `varietyName` target
and the same undefined botanical getter.
