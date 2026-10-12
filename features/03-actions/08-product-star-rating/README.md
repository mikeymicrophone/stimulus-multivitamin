# Actions · 08 · Product star rating

The review form at Bramble & Birch, an outdoor gear shop. A customer rates
a tent overall and on three aspects, in half stars, with the mouse or the
keyboard. Each row of stars is a `star-rating` controller. The
`product-review` controller on the form highlights the aspect being worked
on, sums up the ratings, and posts the review.

**What it teaches**

- One element's actions can serve many children when the events bubble.
  Each row says `pointermove->star-rating#showPreview` and
  `click->star-rating#chooseRating`. The five stars have no actions of
  their own; the controller builds them in `connect()`.
- The element you need isn't always `target` or `currentTarget`. A click
  usually starts on an SVG `<path>` (`event.target`), and the action belongs
  to the row (`event.currentTarget`). The star is
  `event.target.closest("[data-star-position]")`, and the half-star test
  measures that star's box.
- Non-bubbling events only reach the element they fire on.
  `pointerleave->star-rating#endPreview`, `focus->…`, and `blur->…` work
  because the row itself is what the pointer leaves and what takes focus.
  The same descriptors on the form would never fire.
- For an ancestor, use the bubbling twin. The form wants to know which
  aspect has focus, so it listens for `focusin` and `focusout`, which fire at
  the same moments as `focus` and `blur` and bubble. `focusout`'s
  `relatedTarget` says where focus is going.
- Custom events from a child controller bubble like any other:
  `star-rating:rated->product-review#updateSummary`.

| Doesn't bubble | Bubbling twin |
| --- | --- |
| `focus`, `blur` | `focusin`, `focusout` |
| `pointerenter`, `pointerleave` | `pointerover`, `pointerout` |
| `mouseenter`, `mouseleave` | `mouseover`, `mouseout` |
| `toggle` on `<details>`, `load` and `error` on `<img>`, `scroll` on an element | none; put the action on the element |

**Stimulus behavior worth knowing**

- A value's changed callback runs after the method that set the value has
  returned. The data attribute changes at once, but Stimulus hears about it
  from a `MutationObserver`. `rate()` sets `ratingValue`, and anything it
  dispatched on the next line would arrive before `ratingValueChanged()` had
  updated the hidden field. So the `rated` event is dispatched from
  `ratingValueChanged()`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Review form markup with row-level actions, importmap, and controller registration |
| [`star_rating_controller.js`](star_rating_controller.js) | One row of stars; previews, chooses, and steps half-star ratings |
| [`product_review_controller.js`](product_review_controller.js) | Highlights the focused aspect, sums up ratings, and posts the review |

**Try it**

Move the pointer slowly across the Overall stars: the preview fills half a
star at a time and clears when the pointer leaves the row. Click the left
half of the fourth star for 3.5. Click it again to clear it. Tab to
"Weather protection" and press the right arrow key a few times: the row
highlights and the hint appears while it has focus. Rate Overall to enable
"Post review".
