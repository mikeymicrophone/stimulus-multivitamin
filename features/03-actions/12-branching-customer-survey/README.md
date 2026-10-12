# Actions · 12 · Branching customer survey

The departure survey at Pinecone Lodge, a lakeside inn. One `stay-survey`
controller walks a guest through five steps. The follow-up questions change
with the overall rating: a disappointing stay asks what went wrong, a
great one asks what stood out and whether they'd recommend the lodge.
Breakfast only appears as a follow-up if they used it.

**What it teaches**

- Action patterns from the earlier scenarios composed on one form. The cabin `<select>`
  defaults to `change`, the radios and checkboxes to `input`, the form to
  `submit`, and "Next" / "Back" / "Add another reason" to `click`.
- Follow-up questions are revealed, not rebuilt. Their `data-action`
  attributes are in the markup from the start, so Stimulus binds them
  while they are hidden. Showing a field is enough for it to start working.
- Answers on a hidden branch are kept. Changing the overall rating from 1
  to 5 hides the disappointment questions without clearing them, so a guest
  who goes back and forth doesn't lose a comment.
- "Add another reason" clones a `<template>` after the page loads. The new
  field and its Remove button carry `data-action`, and Stimulus binds them
  on its own, the same way
  [Hotel booking date range](../10-hotel-booking-date-range/) binds new day
  buttons.
- Pressing Enter in a field submits the form. `submitSurvey()` treats that
  as Next until the review step, so a required question can't be skipped
  by accident.

**Stimulus behavior worth knowing**

- A hidden element's actions stay bound. `[hidden]` only affects display.
  The breakfast rating's `<select>` has no `data-action` of its own because
  the review is rebuilt when the guest reaches it, but the recommend radios
  keep listening while they're hidden, so a guest who already chose "Yes"
  and then changes their overall rating still has that choice when the
  question comes back.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Survey markup with every question's `data-action`, importmap, and controller registration |
| [`stay_survey_controller.js`](stay_survey_controller.js) | Steps, branches, cloned reasons, and the review |

**Try it**

Leave the cabin blank and press Next. Choose Hemlock and rate the stay a 1,
then add your own reason and remove it. Go back, rate a 5, say you'd
recommend the lodge, and type a name for the website quote. On the extras
step, check breakfast and a rating appears. Review the answers and send
them.
