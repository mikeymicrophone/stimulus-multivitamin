# Value change callbacks · 12 · Keeper watch slate

A watch slate for Point No Point and New Dungeness. One card reads
`localStorage` before its callbacks. The other reads it in `connect()`.

**What it teaches**

- The early slate's `initialize()` copies the saved station, bell, and
  bearing onto the values before the observer starts. The first
  callbacks store that watch. The markup bearing 90 is not the bearing
  in the log. See
  [Restore persisted state in initialize(), before the callback writes it](../../../DISCOVERIES.md#restore-persisted-state-in-initialize-before-the-callback-writes-it).
- The callbacks are what write the key. Aiming south runs
  `bearingValueChanged(180, previous)` and stores 180. Sounding the
  bell assigns `true`.
- Forgetting removes the key, then assigns `undefined` so the attributes
  drop. A flag stops those callbacks from writing the defaults back
  into the key. The string default is `""`, so the summary says blank.
- The late slate's callbacks store "New Dungeness, sound on, bearing
  90" before `connect()`. `connect()` reports that markup even when the
  key held Point No Point when the page opened.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Both slates |
| [`watch_slate_controller.js`](watch_slate_controller.js) | The early slate |
| [`late_slate_controller.js`](late_slate_controller.js) | The late slate |

**Try it**

Seed `point-no-point-slate` and `point-no-point-late-slate` with
`{"station":"Point No Point","soundOn":false,"bearing":240}`.

The early summary is "Point No Point, sound off, bearing 240." The log
is "Bearing 240, previous 0." The key still holds Point No Point. Aim
the bearing south. The summary bearing is 180, the log adds "Bearing
180, previous 240.", and the key's bearing is 180. Sound the bell. The
summary says sound on, and the key's `soundOn` is true. Forget the
watch. The log adds "Forgot the watch." then "Bearing 0, previous 180."
The key is gone. The summary is "blank, sound off, bearing 0."

The late summary is "Restored in connect: New Dungeness, sound on,
bearing 90." The log is "Stored New Dungeness, sound on, bearing 90."
Its key is that markup, not Point No Point.
