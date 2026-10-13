# Outlets · 13 · Rosario watch floor

Rosario Strait. The desk rings a sector bell and reads a night
order that lives on a `meta` element in `head`. A lane slip
after the desk throws from its outlet callback. The bell book
after the slip does not connect.

**What it teaches**

- The sector bell is earlier in the body than the desk.
  `sectorBellOutletConnected` runs before the desk's
  `connect()`, and the bell's own `connect()` has already
  run. `ring()` and `patternValue` are the outlet's.
- The night order is in `head`. `hasNightOrderOutlet` is
  true and `nightOrderOutlet.watchValue` is `forenoon`. The
  tag is `META`. `nightOrderOutletConnected` does not run,
  so the night callback count stays 0. The selector observer
  is rooted at `document.body`.
- The lane bell is before the lane slip, so the slip's
  callback runs during the slip's startup. It throws
  `Error: lane slip lost the bell`. That throw is not
  `handleError`. The slip's `connect()` does not run. The
  bell book, later in the same scan, does not connect. The
  desk, earlier in the scan, stays up.
- Filing `[` into the sector-bell selector after the desk
  has connected throws `SyntaxError` from `Element.matches`
  inside the mutation observer. `handleError` stays quiet.
  The desk element stays connected. See
  [A throw from an outlet callback skips the rest of the connect scan](../../../DISCOVERIES.md#a-throw-from-an-outlet-callback-skips-the-rest-of-the-connect-scan)
  and
  [An outlet in head is readable and never calls back](../../../DISCOVERIES.md#an-outlet-in-head-is-readable-and-never-calls-back).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Night order, desk, bells, slip, and bell book |
| [`rosario_desk_controller.js`](rosario_desk_controller.js) | Sector bell, night order, bracket selector |
| [`sector_bell_controller.js`](sector_bell_controller.js) | Pattern and `ring()` |
| [`night_order_controller.js`](night_order_controller.js) | The meta element in head |
| [`lane_slip_controller.js`](lane_slip_controller.js) | Throws from the outlet callback |
| [`lane_bell_controller.js`](lane_bell_controller.js) | The bell already connected |
| [`bell_book_controller.js`](bell_book_controller.js) | The controller after the slip |

**Try it**

The sector bell says "Sector bell two short." The desk says
"Sector bell two short. Sector callbacks 1. Night watch
forenoon. Night callbacks 0. Night tag META.
hasNightOrderOutlet true." The lane bell says "Lane bell
connected." The lane slip still says "Lane slip has not
connected." The bell book still says "Bell book has not
connected." The fault line is `Error: lane slip lost the
bell`. The handled line stays "handleError quiet." Ring the
sector bell. The note says "Rang two short." and the bell
says "Sector bell sounded two short." File a bracket
selector. The fault line becomes `SyntaxError: Failed to
execute 'matches' on 'Element': '[' is not a valid selector.`
The handled line stays "handleError quiet."
