# Action options · 02 · Vacation rental cards

Cedar & Tide Stays' search results in Brookhaven. Each listing is a card
the visitor can open. Save and Share sit on the card and must not open it.

**What it teaches**

- `:stop` calls `event.stopPropagation()` before the method. The Save and
  Share buttons declare `click->rental-search#saveListing:stop` (and
  `copyListingLink:stop`) so the click never bubbles to the card's
  `openListing` action.
- The card is an `<article>`, which has no default event. It names `click`
  explicitly. A bare `rental-search#openListing` on it would be dropped.
- `:stop` is not `stopImmediatePropagation()`. A second action on the same
  Save button would still run; only ancestors, `@document`, and `@window`
  are hidden from the event.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three listing cards, importmap, and registration |
| [`rental_search_controller.js`](rental_search_controller.js) | Opens a listing, saves it to the trip, or copies a link |

**Try it**

Press Save on Cedar Loft: the trip list gains Cedar Loft and the detail
panel stays closed. Press Share on Tide Cottage: the status says the link
was copied, and the detail panel is still closed. Then click the Pilot
House card body (not its buttons): the detail panel opens with the
breakwater copy.
