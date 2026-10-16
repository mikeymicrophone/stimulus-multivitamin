# Targets · 08 · Bakery oven queue

Hearth and Rye's morning peel. Rye, brioche, and ciabatta leave the
oven in document order. Moving a loaf in the markup changes that order.
Painting ciabatta at the front of the rack does not.

**What it teaches**

- `loafTargets` is document order: the controller element first if it
  is itself a loaf, then descendants in tree order. These loaves are
  descendants, so the pull order is the order of the nodes.
- `previousElementSibling?.before(loaf)` changes the document. The next `loafTargets` read, in
  the same turn, follows the new order. The queue does not sort.
- CSS `order` changes paint order only. After the visual swap, ciabatta
  is painted first and the target order is unchanged.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The rack, move buttons, importmap, and registration |
| [`oven_queue_controller.js`](oven_queue_controller.js) | Reads pull order from `loafTargets` after a move or a visual swap |

**Try it**

The pull order starts Rye, Brioche, Ciabatta. Move Brioche earlier. The
pull order is Brioche, Rye, Ciabatta. Show Ciabatta at the front of the
rack. The note says the rack paints Ciabatta first, and the target order
is still Brioche, Rye, Ciabatta.
