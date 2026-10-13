# Value change callbacks · 11 · Ferry sailing filters

Washington State Ferries crossings. The sailing board keeps the route,
the draft, and the day or night crossing in the query string. A second
card keeps a hash, and it reads that hash too late.

**What it teaches**

- `initialize()` runs before the value observer starts. Copying the
  query into the values there means the first callbacks see the query.
  There is no callback for the markup that was replaced. See
  [Restore persisted state in initialize(), before the callback writes it](../../../DISCOVERIES.md#restore-persisted-state-in-initialize-before-the-callback-writes-it).
- The callbacks write the query. The first of the three writes the
  whole query. The other two see that it already matches and do not
  write again. A board change sets a flag so that write is `pushState`.
  The opening write is `replaceState`.
- `popstate@window` reads the query and assigns the values with the
  flag clear, so the callbacks do not push another entry.
- With no query, night is the attribute `false`, so the first night
  callback is `(false, false)`. The previous value is the boolean
  default, not `undefined`.
- The late card's callbacks write its markup into the hash before
  `connect()`. `connect()` then "restores" Kingston–Edmonds, draft 10,
  day crossing, which is the markup, not the Anacortes hash the page
  was opened with.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The sailing board and the late hash card |
| [`sailing_filter_controller.js`](sailing_filter_controller.js) | Query string, history, and popstate |
| [`late_filter_controller.js`](late_filter_controller.js) | The hash read from connect() |

**Try it**

With no query, the summary is "Port Townsend–Coupeville, draft 12 ft,
day crossing." The log is route `"port-townsend-coupeville"` previous
`""`, draft 12 previous 0, and night false previous false. The query is
`?route=port-townsend-coupeville&draft=12&night=false`.

Open `?route=kingston-edmonds&draft=14&night=true`. The summary is
"Kingston–Edmonds, draft 14 ft, night crossing." The log is route
`"kingston-edmonds"` previous `""`, draft 14 previous 0, night true
previous false. The markup's draft 12 is not in the log.

Choose Kingston–Edmonds, draft 18, night. The summary updates, the query
becomes `?route=kingston-edmonds&draft=18&night=true`, and the log adds
those three lines with the previous sailing. Go back. The summary
returns to the sailing that was current before that choice.

The late card, opened with
`#route=anacortes-friday-harbor&draft=20&night=true`, logs `Hash written
from the markup: route=kingston-edmonds&draft=10&night=false` and then
"Restored from the hash: Kingston–Edmonds, draft 10 ft, day crossing."
