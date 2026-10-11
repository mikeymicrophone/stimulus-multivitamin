# Controllers · 06 · Phone plan comparison table

Northline Wireless's plan picker. The comparison table is a
`plans--comparison` controller. Nested inside it are a usage estimator from
the same `plans/` folder and an autopay toggle from a `billing/` folder.
Together they total the account and highlight the cheapest plan that fits.

**What it teaches**

- Controllers in subfolders get namespaced identifiers. `--` stands for the
  folder separator and `-` for underscores:

  | File | Identifier |
  | --- | --- |
  | `plans/comparison_controller.js` | `plans--comparison` |
  | `plans/usage_estimator_controller.js` | `plans--usage-estimator` |
  | `billing/autopay_discount_controller.js` | `billing--autopay-discount` |

- This is the mapping Rails and stimulus-loading use. With explicit
  `register()` calls you pick the identifier yourself, so follow the path
  to keep identifiers predictable.
- Every attribute spells the full identifier: targets
  (`data-plans--usage-estimator-target`), actions
  (`plans--usage-estimator#estimate`), and values
  (`data-billing--autopay-discount-per-line-value`).
- A `[data-controller~="plans--comparison"]` selector matches whole tokens,
  so the namespaced identifier must be spelled exactly.
- Controllers from different namespaces still cooperate: both nested
  controllers find the surrounding comparison instance and hand it their
  numbers.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Plan table markup, importmap, and controller registration |
| [`plans/comparison_controller.js`](plans/comparison_controller.js) | Totals each plan for the account and highlights the recommendation |
| [`plans/usage_estimator_controller.js`](plans/usage_estimator_controller.js) | Turns monthly usage into a recommended plan |
| [`billing/autopay_discount_controller.js`](billing/autopay_discount_controller.js) | Applies the per-line autopay discount |

**Try it**

Change the hotspot usage to 20 GB and the recommendation jumps to Unlimited
Premium. Set it to 60 GB and no plan fits. Switch to 4 lines and enroll in
autopay to watch every total drop by $20. Inspect the page to see the
double-dash identifiers in each attribute.
