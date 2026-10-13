# Action options · 03 · County archives viewer

Westridge County Archives' scan viewer for Ordinance 1974-12, the Harbor
Street paving file. The overlay fills the window. A click on the dimmed
backdrop should close it; a click on the scan or the caption should not.

**What it teaches**

- `:self` only invokes the method when `event.target` is the element that
  declared the action. The overlay's
  `click->archives-viewer#dismiss:self` runs for the backdrop and skips
  clicks that started on a child.
- The comparison is to `event.target`, not `event.currentTarget`.
  `currentTarget` is already the overlay for every click inside it, so
  that check would never filter children.
- `:!self` is a no-op. The built-in `self` filter returns `true` whenever
  its `value` is `false`, so it does not mean "only children".
- Close omits `:self` and calls `dismiss()` directly, so a child control
  can still shut the viewer.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Shelf, overlay, importmap, and registration |
| [`archives_viewer_controller.js`](archives_viewer_controller.js) | Opens the scan and dismisses from the backdrop or Close |

**Try it**

Press "Open the scan". Click the beige scan or the gift line: the viewer
stays open and the status names the child. Click the dimmed area around
the frame: the viewer closes because that click's `event.target` is the
overlay. Open it again and press Close: that button has no `:self`, so
it dismisses too.
