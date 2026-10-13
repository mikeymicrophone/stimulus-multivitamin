# CSS classes · 12 · Strait chart locker

Corrections for the Strait of Juan de Fuca. Plate 18465 is filed in
kebab-case. Plate 18423 uses an object. Plate 18400 uses a string.
Plate 18441 writes camelCase. Plate 18484 writes an underscore.

**What it teaches**

- `staleClass` reads the attribute every time. `this.staleClasses ===
  this.staleClasses` is false. Pushing `freshClass` onto the array
  leaves the next read as the attribute text. Rewriting
  `data-chart-correction-stale-class` does not run a callback, so
  `Reads` stays `1`, and the next `staleClass` is `chart-fresh`. See
  [Class properties are getters, and nothing watches the attribute](../../../DISCOVERIES.md#class-properties-are-getters-and-nothing-watches-the-attribute).
- `this.staleClass = this.freshClass` throws `TypeError: Cannot set
  property staleClass of #<extended> which has only a getter`. The
  instance in that message is the blessed constructor, not
  `ChartCorrection`.
- `static classes = { stale: "chart-stale" }` and
  `static classes = "stale"` define no properties. `staleClass` is
  `undefined` and does not throw. The attribute sits unread. See
  [A classes object or a classes string is ignored](../../../DISCOVERIES.md#a-classes-object-or-a-classes-string-is-ignored).
- `data-chart-correction-staleClass` is stored lowercased as
  `data-chart-correction-staleclass` and does not match
  `data-chart-correction-stale-class`. `data-chart-correction-stale_class`
  does not match either. The singular getter throws `Missing
  attribute "data-chart-correction-stale-class"`. `freshClass`, in
  kebab-case on the same element, still reads. See
  [A class attribute has to be the exact kebab-case name](../../../DISCOVERIES.md#a-class-attribute-has-to-be-the-exact-kebab-case-name).
- The camelCase plate's button reads `staleClass` with no guard.
  `handleError` reports `Error invoking action "click->chart-correction#readUnguarded"`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Five plates, the fault list, importmap, and registration |
| [`chart_correction_controller.js`](chart_correction_controller.js) | Live read, assignment, and the kebab-case miss |
| [`plate_object_controller.js`](plate_object_controller.js) | `static classes` as an object |
| [`plate_string_controller.js`](plate_string_controller.js) | `static classes` as a string |

**Try it**

Plate 18465 opens "Plate 18465 staleClass chart-stale. Reads 1. Same
list false. freshClass chart-fresh." Correct the plate. It says
"Plate 18465 staleClass chart-fresh. Reads 1. Pushed list
["chart-stale","chart-fresh"]. Next classes ["chart-fresh"]." Assign
the class property. The fault line is "Assign threw TypeError: Cannot
set property staleClass of #<extended> which has only a getter."
Plate 18423 opens "Plate 18423 staleClass in false. hasStaleClass
undefined. staleClass undefined. Attribute chart-stale." Plate 18400
opens the same shape with its own name and attribute. Plate 18441
opens "Plate 18441 threw Error: Missing attribute
"data-chart-correction-stale-class". Kebab attribute absent.
Lowercased attribute chart-stale. Underscore attribute absent.
freshClass chart-fresh." Plate 18484 names the underscore attribute
`chart-stale` and the lowercased attribute absent. Read the stale
class on plate 18441. The handled list says `Error invoking action
"click->chart-correction#readUnguarded" :: Error: Missing attribute
"data-chart-correction-stale-class"`. The plate reading does not
change.
