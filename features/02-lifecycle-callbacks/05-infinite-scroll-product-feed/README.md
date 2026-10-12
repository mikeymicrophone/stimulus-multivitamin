# Lifecycle callbacks · 05 · Infinite-scroll product feed

Switchback Outfitters lists its tents and sleeping bags in a scrolling
feed. The `product-feed` controller watches a sentinel element at the end of
the list with an `IntersectionObserver`, and when the sentinel scrolls into
view it fetches the next page of results as server HTML. Each page ends with
a new sentinel, or with an end marker on the last page.

**What it teaches**

- Observe and unobserve in target callbacks when the observed elements come
  and go. Each new page replaces the old sentinel, so
  `sentinelTargetDisconnected()` unobserves the old one and
  `sentinelTargetConnected()` observes the new one. The observer always
  watches exactly the sentinels on the page.
- `disconnect()` only aborts the page request in flight. Stimulus calls
  `sentinelTargetDisconnected()` for each sentinel right after
  `disconnect()`, and that unobserves it.
- Switching categories aborts the request in flight, so a late page of tents
  can never land in the sleeping-bag list.
- `IntersectionObserver` reports every element once when `observe()` is
  called, visible or not. When a page is short enough that its new sentinel
  is already in view, the next page loads without any scrolling.

**Stimulus behavior worth knowing**

- Target callbacks run before `connect()`. For targets already in the
  markup, Stimulus calls `sentinelTargetConnected()` and then `connect()`, on
  page load and again every time the controller reconnects. An observer
  created in `connect()` wouldn't exist yet when the first sentinel arrives,
  so it is created once in `initialize()`. The full order is `initialize()`,
  value-changed callbacks, target-connected callbacks, then `connect()`.
  Teardown runs in reverse: `disconnect()`, then target-disconnected
  callbacks.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Feed markup with the first page rendered in, importmap, and controller registration |
| [`product_feed_controller.js`](product_feed_controller.js) | Observes sentinels as they arrive and leave, and fetches the next page |
| [`catalog/`](catalog/) | Server fragments for each page of tents and sleeping bags |

**Try it**

Scroll the tent list. Near the bottom, "More tents below" changes to
"Loading more…" and six more tents appear, then the last four with "That's
every tent we carry." Switch to sleeping bags mid-scroll: the list starts
over at the top, and the count follows the new category. Open the network
panel and switch categories quickly while a page is loading: the old
request is cancelled.
