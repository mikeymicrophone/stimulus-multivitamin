# Controllers · 10 · Podcast episode queue

A podcast app's library, Up Next queue, and playback controls. Each episode is an
`episode` controller. The `episode-queue` and `now-playing` controllers pass
episode instances back and forth through small public APIs and keep
everything else private.

**What it teaches**

- A controller is a plain JavaScript class, and an instance is an object
  other code can hold. The queue stores episode controller instances, not
  elements or ids, and hands them to the player.
- Design the public surface on purpose. `play()`, `enqueue()`, `takeNext()`,
  `title`, and `durationSeconds` are public because other controllers call
  them. The playback timer, elapsed time, queue array, and render helpers
  are `#private`, so no other controller can come to depend on them.
- `data-action` can only reach public methods. Every action handler is
  public, including `moveUp()`, `moveDown()`, and `remove()` on queue buttons
  that the queue renders itself with action params.
- Stimulus reads only its own static fields (`targets`, `values`, `classes`,
  `outlets`). Other statics, like the player's skip lengths and playback
  rates, are ordinary class configuration read through `this.constructor`.
- `disconnect()` stops the private playback timer, so a removed player
  leaves nothing running.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Library, queue, and playback markup, importmap, and controller registration |
| [`episode_controller.js`](episode_controller.js) | One instance per episode; exposes title, show, and duration |
| [`episode_queue_controller.js`](episode_queue_controller.js) | Holds episode instances in a private array; `enqueue()` and `takeNext()` |
| [`now_playing_controller.js`](now_playing_controller.js) | Playback controls with public `play()` and a private timer |

**Try it**

Queue three episodes, reorder them, and press "Play queue". Playback is
simulated: each real second plays a minute of the episode, faster at 1.5×
or 2×. Skip forward through the four-minute listener mail episode and the
player marks it played and starts the next queued episode by itself. Queue
the same episode twice and the queue refuses.
