# CSS classes · 08 · Fresnel lens cabinets

Three cabinets in the depot loft. Admiralty Head, Cattle Point, and
Marrowstone share one controller and name different class stacks for
lit and dark.

**What it teaches**

- `lit` and `dark` are logical classes. Each cabinet's
  `data-lens-cabinet-lit-class` is its own stack.
  `this.litClass` is the first token. `this.litClasses` is the
  whole stack.
- Put on watch removes `darkClasses` and adds `litClasses` on that
  element. Secure does the reverse. Admiralty Head wears
  `lens-white beam-wide`. Cattle Point wears `lens-red beam-narrow`.
  Marrowstone wears `lens-green beam-occult`. Those strings are not
  in the controller.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three cabinets, importmap, and registration |
| [`lens_cabinet_controller.js`](lens_cabinet_controller.js) | Applies the cabinet's own lit or dark stack |

**Try it**

Admiralty Head opens "Admiralty Head litClass lens-white. litClasses
["lens-white","beam-wide"]. darkClasses ["lens-dark"]. Wearing none."
Cattle Point opens with `litClass lens-red` and `litClasses
["lens-red","beam-narrow"]`. Marrowstone opens with `litClass
lens-green`. Put Admiralty Head on watch. Its reading says "Wearing
lens-white beam-wide." Cattle Point still says "Wearing none."
Secure Admiralty Head. It says "Wearing lens-dark."
