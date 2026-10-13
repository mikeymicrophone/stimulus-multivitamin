# Outlets · 08 · Marrowstone fog desk

Fort Flagler. The desk outlets to the Marrowstone horn and can
also dispatch a sound. Kilisut is not an outlet. It listens on
the window.

**What it teaches**

- `foghornOutlet.blast()` returns `"two blasts"`. The desk
  reads `localHeard` on that same controller. An outlet call
  is a method call: it returns a value, and it throws if the
  outlet is missing.
- `this.dispatch("sound")` fires `fog-desk:sound` on the desk
  element and lets it bubble. Marrowstone is a sibling, so
  `fog-desk:sound->foghorn#hearLocal` does not run. Kilisut's
  `fog-desk:sound@window->foghorn#hearWindow` does. Kilisut
  cannot return the pattern to the desk.
- Dropping the outlet attribute makes the next call throw
  `Missing outlet element "foghorn"…` before `dispatch`. Kilisut
  stays quiet because the throw happens first. A listener that
  is not there does not throw. A missing outlet does.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Two horns and the desk |
| [`fog_desk_controller.js`](fog_desk_controller.js) | Calls the outlet, then dispatches |
| [`foghorn_controller.js`](foghorn_controller.js) | `blast()`, a local hear, and a window hear |

**Try it**

The desk opens "Returned not called. Dispatched no. Marrowstone
local false. hasFoghornOutlet true. connected." Marrowstone
says "Marrowstone is quiet." Kilisut says "Kilisut is quiet."
Call the horn. The desk says "Returned two blasts. Dispatched
yes. Marrowstone local false." Marrowstone still says it is
quiet. Kilisut says "Kilisut heard the desk on the window."
Drop the outlet. The desk says "hasFoghornOutlet false." and
the fault says "Outlet attribute removed." Call the horn
again. The fault is `Error: Missing outlet element "foghorn"
for host controller "fog-desk". Stimulus couldn't find a
matching outlet element using selector "null".` The desk says
"Returned not called. Dispatched no." Kilisut still says it
heard the window once, and does not hear a second sound.
