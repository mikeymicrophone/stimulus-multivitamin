# Dispatching custom events · 03 · Samish shellfish ticket

A buyer board on the Samish flats files a sack. The ticket
puts the bed, the weight, and the grade on the event.

**What it teaches**

- `detail` is the payload. The listener reads
  `event.detail.bed`, `pounds`, `grade`, and `tags`.
- The object the caller passed is the object on the
  returned event. `event.detail === detail` is true.
- Omitting `detail` supplies a new `{}` for that call.
  A second call gets a different object. The key count is 0.
- `detail: null` stays `null`. It is not turned into `{}`.
  A listener that reads `event.detail.bed` without a check
  would throw. This board checks first.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The board and the ticket |
| [`bed_ticket_controller.js`](bed_ticket_controller.js) | Three ways to pass detail |
| [`buyer_board_controller.js`](buyer_board_controller.js) | Reads the payload, including null |

**Try it**

The board opens "Board is clear." The ticket says "No sack
yet." Sack 42 lb. The ticket says "Returned bed Samish.
Same object true." The board says "Board bed-ticket:sacked
bed Samish. pounds 42. grade A. tags ice, same-day." Post
without detail. The ticket says "Omitted keys 0. Fresh
true. Null false." The board ends on "Board
bed-ticket:cleared keys 0." because the second dispatch is
`cleared`. Post a null detail. The ticket says "Null detail
null." The board says "Board saw null detail."
