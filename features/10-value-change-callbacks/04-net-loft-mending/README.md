# Value change callbacks · 04 · Cap Sante net loft

A gillnet on the loft floor in Anacortes. The card records the order
`mending-card` actually uses when it connects.

**What it teaches**

- `initialize()` runs first.
- Present values run in attribute order, not in `static values` order.
  The tag writes `needle-count` before `mesh-size`, so needles log
  before mesh, even though `static values` declares `meshSize` first.
  See
  [Present values run in attribute order, then absent ones](../../../DISCOVERIES.md#present-values-run-in-attribute-order-then-absent-ones).
- `twine` is declared first and has no attribute, so it logs last among
  the values, with previous `undefined`.
- Inside the needle callback the mesh target already reads "4 in mesh,
  hung and waiting." `meshTargetConnected` has not run yet. The order
  initialize, value callbacks, target callbacks, then `connect()` is the
  one in
  [Callback order is initialize, value-changed, target-connected, then connect](../../../DISCOVERIES.md#callback-order-is-initialize-value-changed-target-connected-then-connect).
- `connect()` assigns the next needle and logs "connect returned." The
  needle callback for 13 is the line after that. A value written in
  `connect()` does not run until the connect scan has finished. See
  [A value's changed callback runs after the method that set the value has returned](../../../DISCOVERIES.md#a-values-changed-callback-runs-after-the-method-that-set-the-value-has-returned).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Gillnet 14, with needle count ahead of mesh size in the tag |
| [`mending_card_controller.js`](mending_card_controller.js) | The log of the connect sequence |

**Try it**

The log is eight lines:

1. initialize.
2. Needles 12, previous 0. Mesh target says "4 in mesh, hung and waiting."
3. Mesh 4, previous 0.
4. Twine "", previous undefined.
5. meshTargetConnected, text "4 in mesh, hung and waiting."
6. connect assigned the next needle.
7. connect returned.
8. Needles 13, previous 12. Mesh target says "4 in mesh, hung and waiting."
