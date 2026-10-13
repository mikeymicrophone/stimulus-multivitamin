# Action options · 06 · Botanical garden map

Linnea Conservatory's visitor plan. Wheel over the glass houses should
zoom the plan, not scroll the page. Wheel over the trail notes should
scroll the notes as usual.

**What it teaches**

- `:!passive` sets `{ passive: false }` on the native listener. The plan
  declares `wheel->garden-map#zoomPlan:!passive:prevent` so `:prevent` can
  cancel the wheel and `zoomPlan()` can change the scale instead.
- Chrome treats `wheel` (and `touchstart` / `touchmove`) listeners on
  `window`, `document`, and `body` as passive by default. A descriptor that
  omits `:!passive` on those targets cannot `preventDefault()`.
- `:passive` on the trail notes is the opposite: the listener must not
  cancel the event, so the notes keep scrolling.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Plan, trail notes, importmap, and registration |
| [`garden_map_controller.js`](garden_map_controller.js) | Zooms the plan and reports whether the wheel was cancelled |

**Try it**

Wheel over the palm court: the scale readout changes and the status says
`defaultPrevented=true`. Wheel over the trail notes: the notes scroll and
their status says `defaultPrevented=false`. The `!` on `:!passive` is the
same negation custom options use; here it flips a native listener flag.
