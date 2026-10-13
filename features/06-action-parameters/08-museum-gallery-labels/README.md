# Action parameters · 08 · Museum gallery labels

Two walls at the Lantern Museum. One puts the action and the params on each
plaque. The other listens on the room and leaves the params on the paintings.

**What it teaches**

- `event.params` is built from the element that declares the action, not
  from `event.target`. Clicking the title span inside a plaque leaves
  `event.target` as the `SPAN`, and `accessionNumber` still comes from the
  button.
- An action on the room does not see `data-gallery-wall-*-param` on the
  painting that was clicked. `accessionNumber` is missing.
- A `<div>` has no default event, so the room names `click->` explicitly.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Both walls, importmap, and controller registration |
| [`gallery_wall_controller.js`](gallery_wall_controller.js) | Reports the accession, or its absence |

**Try it**

On the plaque wall, click the words Harbor at Dusk, not the button's
padding. The status names accession E-1942-18 and says the target was
SPAN. On the other wall, click Winter Orchard. The room action has no
accessionNumber, even though that painting's markup carries one.
