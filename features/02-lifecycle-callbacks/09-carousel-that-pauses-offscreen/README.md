# Lifecycle callbacks · 09 · Carousel that pauses offscreen

Hearthstone Realty's listing page for 214 Orchard Lane, with three similar
homes further down. Every photo carousel is a `photo-carousel` controller
that advances every five seconds, but only while nothing gives it a reason
to stop. The status line under each carousel lists the current reasons. The
`listing-page` controller moves similar homes into a favorites strip and
hides the ones you don't want.

**What it teaches**

- One timer, many reasons to stop it. Autoplay runs only while the set of
  pause reasons is empty: off screen (an `IntersectionObserver`), hidden tab
  (`visibilitychange@document`), pointer or keyboard focus on the photos,
  a reduced-motion preference (a `MediaQueryList` listener), or the
  visitor's Pause button. A single `updatePlayback()` starts or stops the one
  interval.
- Each kind of listener is cleaned up in its own way. Stimulus removes the
  `data-action` listeners itself. `disconnect()` unobserves the
  `IntersectionObserver`, aborts the `MediaQueryList` listener, and clears
  the interval. The media query listener is added by hand because
  `data-action` can only listen on elements, `window`, and `document`.
- `connect()` rebuilds connection-dependent state from scratch. The current
  photo and the visitor's Pause choice live on the instance and survive a
  move to favorites. Hover, focus, and visibility are worked out fresh on
  every connection.
- A carousel starts out assuming it is off screen.
  `IntersectionObserver` reports right after `observe()`, so a carousel
  below the fold never starts, and one in view starts on that first report.

**Behavior worth knowing**

- An element moved or removed from under the pointer never receives
  `pointerleave`. Click "♡ Save" and the carousel moves to favorites with
  the pointer still "inside" as far as it knows. If the hover pause were kept
  across the reconnect, that carousel would stay paused forever.
- Moving an element takes focus off it, so focus pauses are also stale
  after a move.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Listing markup, importmap, and controller registration |
| [`photo_carousel_controller.js`](photo_carousel_controller.js) | Advances photos only while nothing pauses it; cleans up its observer, listener, and timer |
| [`listing_page_controller.js`](listing_page_controller.js) | Moves homes into favorites and hides them |

**Try it**

The main carousel plays while the similar homes, below the fold, say
"Paused: off screen". Hover the photos or tab to the arrows to pause. Scroll
down: the main carousel pauses and the similar homes start. Pause Kessler
Avenue, then save it and Birch Street. Scroll back up: Birch Street plays
with the same photo showing, and Kessler stays paused only because you asked
it to. Turn on "reduce motion" in your OS or in the browser's rendering
tools and every carousel stops.
