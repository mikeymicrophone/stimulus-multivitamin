# Dispatching custom events · 08 · Goose Point retort tickets

Batch 14 at Goose Point. The cook's detail is the same for
every listener. Each listener's params are its own.

**What it teaches**

- `event.detail` is `{ batch: 14, psi: 15 }`.
  `event.params` comes from
  `data-[identifier]-[name]-param` on the element that
  owns the action. Detail does not replace params.
- Typecast still applies on a custom event. `3` is a
  number, `true` and `false` are booleans, and `03`
  stays the string `"03"` because it is not JSON.
- Each binding assigns `event.params` before its method
  runs. The floor sees belt 3. The clerk sees belt 7.
  `dispatch` returns after the last binding, so the
  retort sees belt 9, the late self's params.
- The late self action is `retort:cooked@window->late-self#take:self`.
  The event target is the retort, not the late self, so
  the method does not run. The params were already
  stamped. "Late self has not run." stays on the page.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Floor, retort, clerk, and late self |
| [`retort_controller.js`](retort_controller.js) | Dispatches and reads the returned params |
| [`cook_floor_controller.js`](cook_floor_controller.js) | Ancestor listener, belt 3, lot `03` |
| [`belt_clerk_controller.js`](belt_clerk_controller.js) | Window listener, belt 7 |
| [`late_self_controller.js`](late_self_controller.js) | `:self` filter that declines |

**Try it**

The floor says "Floor has no ticket." The retort says
"Retort is cold." The clerk says "Clerk has no ticket."
The late self says "Late self has not run." Cook batch
14. The floor says "Floor batch 14 psi 15. belt 3 number.
hold true boolean. lot 03 string." The clerk says "Clerk
batch 14 psi 15. belt 7 number. hold false boolean. lot
03 string." The late self still says "Late self has not
run." The retort says "type retort:cooked. psi 15.
returned belt 9. returned hold false. returned lot 08
string."
