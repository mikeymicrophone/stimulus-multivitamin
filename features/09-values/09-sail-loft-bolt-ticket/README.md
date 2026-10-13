# Values · 09 · Sail loft bolt ticket

Three bolts of Oceanus cloth on the Port Townsend loft table. The mesh
is 4 inches. The tickets do not agree on how to spell the attributes.

**What it teaches**

- `meshSize` and `clothName` are read from
  `data-bolt-ticket-mesh-size-value` and
  `data-bolt-ticket-cloth-name-value`. The kebab bolt has both, so
  `hasMeshSizeValue` and `hasClothNameValue` are true.
- HTML lowercases attribute names. `data-bolt-ticket-meshSize-value`
  is stored as `data-bolt-ticket-meshsize-value`. That is not the name
  Stimulus looks up. The camel bolt reads `""` and
  `hasMeshSizeValue` is false. See
  [Value attributes are the exact kebab-case name](../../../DISCOVERIES.md#value-attributes-are-the-exact-kebab-case-name).
- `data-bolt-ticket-mesh_size-value` is not camelized to `meshSize`.
  Action parameters do camelize underscores. Value lookup does not.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three bolts, importmap, and registration |
| [`bolt_ticket_controller.js`](bolt_ticket_controller.js) | Reads mesh and cloth, and lists the attributes the DOM kept |

**Try it**

The kebab bolt reads `mesh "4 in". hasMeshSizeValue true. Cloth
"Oceanus". hasClothNameValue true.` and lists
`data-bolt-ticket-mesh-size-value` and
`data-bolt-ticket-cloth-name-value`. The camel bolt reads `mesh "".
hasMeshSizeValue false. Cloth "". hasClothNameValue false.` and lists
`data-bolt-ticket-meshsize-value` and
`data-bolt-ticket-clothname-value`. The underscore bolt is the same
empty reading, listing `data-bolt-ticket-mesh_size-value` and
`data-bolt-ticket-cloth_name-value`.
