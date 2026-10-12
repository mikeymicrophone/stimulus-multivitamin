# Actions · 10 · Hotel booking date range

The booking calendar for The Saltmarsh Inn. A guest picks a check-in and a
check-out from two months of days, or types the dates, or takes the winter
offer. The `stay-dates` controller previews the stay while the pointer
moves, enforces the two-night minimum and sold-out nights, and prices
weeknights and weekend nights separately.

**What it teaches**

- Elements added after the page loads get their actions automatically. The
  controller creates every day button with
  `data-action="stay-dates#chooseDay pointerenter->stay-dates#previewCheckOut focus->stay-dates#previewCheckOut"`,
  and rebuilds all of them on every month change. Stimulus binds the new
  buttons and forgets the removed ones; there is no `addEventListener` and no
  cleanup in the controller.
- Generated elements can use any event. `pointerenter` and `focus` don't
  bubble, so they can't be delegated to the calendar, but each day button
  carries them itself.
- The preview only toggles classes on the existing buttons. Rebuilding the
  calendar from `focus->stay-dates#previewCheckOut` would remove the button
  that just took focus.
- The calendar container ends the preview with
  `pointerleave->stay-dates#endPreview`.
- The date fields would default to `input`. They name `change` instead, so a
  half-typed date isn't applied on every keystroke.

**Stimulus behavior worth knowing**

- A new element has no actions until Stimulus has seen it, and Stimulus sees
  it from a `MutationObserver` after the code that inserted it returns.
  `button.click()` on the line after the render runs nothing. "Use these
  dates" renders January and then calls `chooseDate()` directly. Waiting a
  microtask (`await Promise.resolve()`) is enough if you really need to
  dispatch an event to a brand-new element.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Booking form with the season, rates, and sold-out nights as values, importmap, and controller registration |
| [`stay_dates_controller.js`](stay_dates_controller.js) | Draws the calendar, chooses and previews the stay, and prices it |

**Try it**

Click Friday, November 6, then move over the following days to see the
preview. Click Saturday the 7th: stays are at least two nights. Click Monday
the 9th and read the price. Go "Later ›" twice and try February 12 to 15,
across a sold-out Saturday. Press "Use these dates" to jump to the winter
offer. Type dates into the fields and the calendar follows.
