# Application setup and registration · 06 · Bay Center ticket load

The oyster buyer at Bay Center loads controllers from
definition objects. The shape of the argument decides who
actually gets a module.

**What it teaches**

- `application.load(definition)` and
  `application.load(first, second)` load every argument.
  `application.load([first, second])` loads the array.
- If the first argument is an array, the rest are ignored.
  `load([buyer], extra)` does not load `extra`.
- A definition with `shouldLoad === false` is skipped. The
  other entries in that array still load. `afterLoad` does
  not run for the skipped one.
- `load([[definition]])` throws `TypeError`. The inner array
  is treated as a definition, and it has no
  `controllerConstructor`. Nothing in that call is loaded.
- `unload` uses the same rule. `unload(["scale-house"],
  "buyer-board")` unloads the scale and leaves the buyer.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The loads, the unload, and the nested list |
| [`buyer_board_controller.js`](buyer_board_controller.js) | Loaded from the array |
| [`scale_house_controller.js`](scale_house_controller.js) | Loaded as a bare argument |
| [`ice_hold_controller.js`](ice_hold_controller.js) | Skipped by `shouldLoad` |
| [`extra_slip_controller.js`](extra_slip_controller.js) | Dropped, then loaded as a pair |

**Try it**

The roster reads "buyer-board". The buyer reads "Buyer board
connected." The scale reads "Scale house is not connected."
The ice hold reads "Ice hold is not connected." The extra slip
reads "Extra slip is not connected." Load the scale and the
extra slip. The roster reads "buyer-board scale-house
extra-slip". The scale reads "Scale house connected." The
extra slip reads "Extra slip connected." Unload the scale. The
roster reads "buyer-board extra-slip". The scale reads "Scale
house disconnected." The buyer stays "Buyer board connected."
Nest a list. The note reads "Nested load threw TypeError." The
roster stays "buyer-board extra-slip".
