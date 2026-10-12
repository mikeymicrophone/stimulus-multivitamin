# Lifecycle callbacks · 11 · Insurance quote connect order

A Fairhaven Mutual home insurance quote. Each coverage (dwelling, personal
property, liability, and optional riders) is a `coverage-option` controller
nested inside the `insurance-quote` controller, which totals the premium.
The quote's controller is the heavy "rating engine", and by default it is
split into its own chunk and registered after the page starts. The lifecycle
log under the quote records every `connect()` and `disconnect()`, and two
links reload the page with the rating engine code-split or bundled.

**What it teaches**

- Make a parent/child handshake work in both orders. A coverage looks for
  its quote in `connect()` and joins it if the quote is there. The quote, in
  its own `connect()`, collects every coverage that is already connected.
  The quote keeps its coverages in a `Set`, so one found both ways counts
  once.
- Children may need to reach the parent after they've been cut off from it.
  A rider removed on its own is detached before its `disconnect()` runs, so
  `closest()` can no longer find the quote. Each coverage keeps the quote it
  joined and leaves through that reference.
- Batch work that many children trigger at once. Every join queues a
  recalculation with `queueMicrotask()`, so three coverages joining in one
  pass render the summary once.
- The summary is built from the quote's registry, not from the DOM, so a
  coverage that failed to join would visibly be missing from the line items.

**Stimulus behavior worth knowing**

- "Parents connect before children" holds only when both are registered
  before Stimulus starts. Stimulus then connects controllers in document
  order. A controller registered later (lazy loading, code splitting, a
  `register()` after an `await`) connects at registration time, after
  children that connected long before. Reload with the rating engine
  code-split and the log shows all three coverages connect, find no quote,
  and get collected 800 ms later.
- Teardown runs parent first too. When the whole quote is replaced, Stimulus
  disconnects `insurance-quote` and then each `coverage-option`, so a child's
  `disconnect()` can't count on its parent still being connected. The quote
  stops accepting calls in `disconnect()`, and `leaveQuote()` ignores calls
  that arrive afterward. "Quote renters insurance instead" shows this order
  in the log.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Quote markup, lifecycle log, importmap, and both ways of registering the rating engine |
| [`insurance_quote_controller.js`](insurance_quote_controller.js) | Collects coverages in either order and totals the premium |
| [`coverage_option_controller.js`](coverage_option_controller.js) | Joins the quote if it is there, and leaves through the reference it kept |
| [`lifecycle_log.js`](lifecycle_log.js) | Writes the lifecycle log |
| [`quotes/homeowners.html`](quotes/homeowners.html), [`quotes/renters.html`](quotes/renters.html) | Server-rendered quotes |

**Try it**

Load the page and read the log: three coverages connect with "no quote yet",
then the quote connects and finds all three. Reload with the rating engine
bundled and the order flips. Add water backup, raise its limit, and remove
it: the total follows, even though the removed rider could no longer find
the quote through the DOM. Then quote renters insurance instead. The log
shows the homeowners quote disconnect before its coverages, and the renters
quote connect before its own.
