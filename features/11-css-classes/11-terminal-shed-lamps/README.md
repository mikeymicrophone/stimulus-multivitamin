# CSS classes · 11 · Terminal shed lamps

Fishermen's Terminal. The wharf and the shed share a timber. The
shed lamp was named twice. The pile lamps were not.

**What it teaches**

- A class attribute is `data-${identifier}-${kebab-name}-class`.
  `wharf`'s `shedLamp` and `wharf-shed`'s `lamp` both produce
  `data-wharf-shed-lamp-class`. Both getters return `shed-green`.
  See
  [A shorter identifier can share a longer identifier's class attribute](../../../DISCOVERIES.md#a-shorter-identifier-can-share-a-longer-identifiers-class-attribute).
- `pile` does not collide. The wharf's pile is
  `data-wharf-pile-class` (`pile-oak`). The shed's pile is
  `data-wharf-shed-pile-class` (`pile-cedar`).
- Copying `amberClass` into the shared attribute changes the next
  read of both controllers. There is no class-changed callback, so
  the action paints both. Swapping the piles writes `firClass` and
  `spruceClass` into the two pile attributes, and the shared lamp
  stays put.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The timber, both identifiers, importmap, and registration |
| [`wharf_controller.js`](wharf_controller.js) | Wharf shed lamp, wharf pile, amber, and fir |
| [`wharf_shed_controller.js`](wharf_shed_controller.js) | Shed lamp, shed pile, and spruce |

**Try it**

The wharf line opens "Wharf shed lamp shed-green. Wharf pile pile-oak.
Shared attribute shed-green. Pile attribute pile-oak." The shed line
opens "Shed lamp shed-green. Shed pile pile-cedar. Shared attribute
shed-green. Shed pile attribute pile-cedar." Amber the shared lamp.
Both lines say the shed lamp is `shed-amber` and the shared attribute
is `shed-amber`. The piles stay `pile-oak` and `pile-cedar`. Swap the
piles. The wharf line says "Wharf pile pile-fir. Pile attribute
pile-fir." The shed line says "Shed pile pile-spruce. Shed pile
attribute pile-spruce." Both still say the shed lamp is `shed-amber`.
