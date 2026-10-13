# Dispatching custom events · 09 · La Conner cannery pass

The basket cooks inside the floor. The inspector is a
sibling. The floor hears the event, then asks the
inspector through an outlet.

**What it teaches**

- `retort-basket:cooked` bubbles to the floor. The floor
  files the basket and the jar count without holding a
  reference to the basket controller.
- The inspector's `retort-basket:cooked->batch-inspector#missed`
  does not run. A sibling is not up the bubble. The
  Marrowstone fog desk shows the same shape with a window
  listener; here the working path is the ancestor.
- `batchInspectorOutlet.accept(detail)` returns
  `"accepted"`. The event cannot hand a return value back.
- The outlet is read after the event is filed. Dropping
  the attribute makes the next cook throw
  `Missing outlet element "batch-inspector"… selector "null"`,
  and the floor line still starts with "Floor heard
  retort-basket:cooked."

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Floor around the basket, inspector beside it |
| [`retort_basket_controller.js`](retort_basket_controller.js) | Dispatches `cooked` |
| [`cannery_floor_controller.js`](cannery_floor_controller.js) | Ancestor listener and the outlet host |
| [`batch_inspector_controller.js`](batch_inspector_controller.js) | Outlet that returns a value |

**Try it**

The floor says "Floor is waiting for a basket." The
basket says "Basket is empty." The inspector says
"Inspector has not been asked." Cook the basket. The
basket says "Dispatched retort-basket:cooked. jars 240."
The floor says "Floor heard retort-basket:cooked. LC-14
240. Inspector returned accepted. No fault." The
inspector says "Inspector accepted LC-14 by outlet." It
does not say it heard the event. Drop the outlet. The
floor says "Outlet attribute removed." Cook the basket
again. The floor says "Floor heard retort-basket:cooked.
LC-14 240. Inspector returned not asked. Error: Missing
outlet element "batch-inspector" for host controller
"cannery-floor". Stimulus couldn't find a matching outlet
element using selector "null"." The inspector still says
"Inspector accepted LC-14 by outlet."
