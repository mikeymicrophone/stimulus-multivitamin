# Values · 08 · Apiary super stack

Two hives at the Skagit Valley apiary, Langstroth and Warre, open on
the same unwritten stack: brood under honey. A package hive in the
shed has no frame list.

**What it teaches**

- `frames: { type: Array, default: ["brood", "honey"] }` returns that
  array when the attribute is missing. It is one array for every
  controller still using the default, and `hasFramesValue` is true.
  See
  [A custom Array or Object default is one shared value](../../../DISCOVERIES.md#a-custom-array-or-object-default-is-one-shared-value).
- `push("pollen")` mutates that array and does not write
  `data-hive-stack-frames-value`. The next read of the Warre lists
  pollen too.
- Assigning `this.framesValue = this.framesValue.slice()` writes JSON
  on the Langstroth only. The Warre still has no attribute and still
  reads the shared default, pollen included.
- `frames: Array` on the package hive is a new `[]` every read.
  `hasFramesValue` is false. A push is gone by the time the reading
  paints.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Langstroth, Warre, and the package hive |
| [`hive_stack_controller.js`](hive_stack_controller.js) | The shared default stack |
| [`empty_super_controller.js`](empty_super_controller.js) | The bare array |

**Try it**

Both hives open "frames brood, honey. hasFramesValue true. Attribute
absent." Drop a pollen frame on the Langstroth. Its reading lists
"brood, honey, pollen" and the attribute is still absent. Read the
Warre. It lists pollen too, attribute absent. Write the stack on the
Langstroth lid. Its attribute is `["brood","honey","pollen"]`. Read the
Warre again. It still lists pollen and the attribute is still absent.
The package hive opens "frames (none). hasFramesValue false. Attribute
absent." Drop a pollen frame there. The reading is still "(none)" and
the attribute is still absent.
