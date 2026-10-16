# CSS classes · 01 · Icehouse brine tags

Ballard icehouse, before the boats unload. The sockeye tote and the
coho tote share one controller. Each tote names its own hold class.

**What it teaches**

- `static classes = ["coldHold"]` declares the logical name.
  Stimulus adds `coldHoldClass`, `coldHoldClasses`, and
  `hasColdHoldClass`.
- The attribute is `data-brine-tag-cold-hold-class`. The logical
  name `coldHold` is kebab-case `cold-hold` in the markup.
- `this.coldHoldClass` is the token in that attribute.
  `hasColdHoldClass` is true because the attribute is on the
  controller element.
- Hold and release both call `classList.toggle(this.coldHoldClass, force)`.
  The force flag makes each button idempotent: hold twice and the tote
  still wears the token once. Sockeye's token is `brine-cold`. Coho's token is
  `brine-warming`. Those strings are not in the controller.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two totes, importmap, and registration |
| [`brine_tag_controller.js`](brine_tag_controller.js) | Reads `coldHoldClass` and holds or releases the tote |

**Try it**

Sockeye opens "Sockeye coldHoldClass brine-cold. On the tote false.
hasColdHoldClass true." Coho opens "Coho coldHoldClass brine-warming.
On the tote false. hasColdHoldClass true." Hold the sockeye tote.
The card picks up the cold background and the reading says "On the
tote true." Release it and the reading says "On the tote false."
Hold the coho tote. Its reading still says "coldHoldClass
brine-warming" and "On the tote true." The sockeye tote stays
released.
