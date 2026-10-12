# Lifecycle callbacks · 13 · Reordered playlist that survives moves

Lorraine Pike's running order for Saturday Night Soul on WKRV 89.3. Every
track is a `playlist-track` controller. The on-air track runs a clock and,
when it ends, hands off to the first track in "Up next". Lorraine reorders
what plays next by dragging a track's handle: the list rearranges live as
she drags. The `running-order` controller moves and drops tracks, advances
to the next one, and reloads the producer's latest running order from the
studio.

**What it teaches**

- A move is a `disconnect()` followed by a `connect()` on the same instance,
  and inside `disconnect()` a moved element is already back in the document.
  The track checks `this.element.isConnected` and only tears down when it
  has really left. That is what lets one drag survive: the dragged row is
  moved, disconnected, and reconnected every time it passes a neighbor, and
  its drag session (three `document` listeners on one `AbortController`)
  carries on through all of it. Without the check, the drag would die at
  the first reorder.
- Everything that runs on reconnect must be safe to run twice. `connect()`
  only counts reconnects. `startClock()` and the drag session do nothing if
  they are already running.
- A real removal tears everything down. Dropping a track, or replacing the
  lists with the studio's running order, disconnects tracks that are no
  longer in the document, so their clocks and listeners stop.
- What must outlive a track lives on its parent. The running order keeps
  the on-air start time, keyed by track id. When the studio's HTML replaces
  the on-air track with a new element, the new instance asks for that time
  and the clock carries on from where it was.

**Stimulus behavior worth knowing**

- Value-changed callbacks run again on every reconnect, not only when the
  value changes. Each move during a drag calls `onAirValueChanged()` again
  with the same value, so it has to be idempotent. Here it starts or stops
  a clock, and both are no-ops when there's nothing to do.
- Value-changed callbacks run before `connect()`. `onAirValueChanged(true)`
  needs the running order to read the start time, but `connect()` hasn't
  run yet. So the track looks the running order up on first use, in a
  getter, and keeps it.
- `this.element.isConnected` is also `true` in `disconnect()` when the
  identifier is removed from `data-controller` while the element stays on
  the page. This page never does that. If yours might, check
  `this.element.matches('[data-controller~="…"]')` as well.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Running order markup, importmap, and controller registration |
| [`playlist_track_controller.js`](playlist_track_controller.js) | Tells moves from removals; keeps its drag session and clock through moves |
| [`running_order_controller.js`](running_order_controller.js) | Owns the on-air start time; moves, drops, advances, and reloads tracks |
| [`studio/running-order.html`](studio/running-order.html) | The producer's latest running order, as server HTML |

**Try it**

Drag "Cold Sweat" by its handle to the top of "Up next". The status line
reports how many times the track reconnected during that one drag. Use the
arrows to move "Use Me" around. Reload from the studio: the producer added a
station ID and cut "Tell Mama", and the on-air clock doesn't skip a beat even
though the on-air track is a brand-new element. Press "Next track", or wait
for the song to end, and the top of "Up next" goes on air.
