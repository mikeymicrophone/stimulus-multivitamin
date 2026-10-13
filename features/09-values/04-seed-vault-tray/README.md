# Values · 04 · Seed vault tray

The Fort Collins seed vault is logging two trays. The north tray
already holds NSGC-1834 and NSGC-2201. The south tray's drawer card
has no list yet.

**What it teaches**

- `accessions` is an `Array`. The attribute is JSON. The north tray
  reads those two accession numbers and `hasAccessionsValue` is true.
  The south tray has no attribute, so the value is `[]` and
  `hasAccessionsValue` is false.
- The getter parses the attribute on every read. `push` changes an
  array that the next read throws away, and the attribute is
  unchanged. A missing attribute's default `[]` is a new array each
  read, so a push there disappears too.
- Assigning `this.accessionsValue = this.accessionsValue.concat(...)`
  writes `JSON.stringify` of the new list back to
  `data-vault-tray-accessions-value`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | North and south trays, importmap, and registration |
| [`vault_tray_controller.js`](vault_tray_controller.js) | Reads the lists and records an accession |

**Try it**

The north tray opens "North tray accessions NSGC-1834, NSGC-2201.
hasAccessionsValue true. Attribute [\"NSGC-1834\",\"NSGC-2201\"]."
Push NSGC-4410 without recording. The list is unchanged and the note
says the attribute was unchanged. Record NSGC-4410. The list is
"NSGC-1834, NSGC-2201, NSGC-4410" and the attribute is
`["NSGC-1834","NSGC-2201","NSGC-4410"]`. The south tray opens
"accessions (none). hasAccessionsValue false. Attribute absent."
Pushing there leaves it empty. Recording writes
`["NSGC-4410"]` and `hasAccessionsValue` becomes true.
