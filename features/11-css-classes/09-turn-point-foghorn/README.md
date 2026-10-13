# CSS classes · 09 · Turn Point foghorn

Three horns along the boundary passage. Point Wilson has one
sounding class. Patos and Stuart Island have two.

**What it teaches**

- `classList.toggle(...this.soundingClasses)` toggles when the list
  has one token. Point Wilson's first press sets `horn-on`. The
  second press clears it.
- With two tokens, the call is `toggle("horn-on", "horn-pulse")`.
  The second string is the DOM `force` flag, and a non-empty string
  is true, so `horn-on` is forced on. `horn-pulse` is never toggled.
  A second press stays `horn-on`. See
  [Spreading class lists into classList.toggle forces the first class on](../../../DISCOVERIES.md#spreading-class-lists-into-classlisttoggle-forces-the-first-class-on).
- Looping `this.soundingClasses` and toggling each token clears
  Stuart Island's stack, then brings both tokens back.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three horns, importmap, and registration |
| [`foghorn_key_controller.js`](foghorn_key_controller.js) | Spread toggle and loop toggle |

**Try it**

Point Wilson opens "Point Wilson connect. soundingClass horn-on.
soundingClasses ["horn-on"]. Horn class (none)." Patos opens
"soundingClass horn-on. soundingClasses ["horn-on","horn-pulse"].
Horn class (none)." Stuart Island opens "Horn class horn-on
horn-pulse." Spread toggle on Point Wilson. It says "Horn class
horn-on." Spread toggle again. It says "Horn class (none)." Spread
toggle on Patos. It says "Horn class horn-on." Spread toggle again.
It still says "Horn class horn-on." Loop toggle on Stuart Island.
It says "Horn class (none)." Loop toggle again. It says "Horn class
horn-on horn-pulse."
