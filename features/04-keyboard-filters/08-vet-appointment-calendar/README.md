# Keyboard filters · 08 · Vet appointment calendar

Cedar Ridge Veterinary Clinic's surgery board. Dr. Inés Valcourt is
holding a spay slot for Mochi, a two-year-old rabbit. Arrows move by
day, Page Up and Page Down by month, Alt+Page Up by year.

**What it teaches**

- `keydown.up` / `down` / `left` / `right` move the focus by week or day.
- `keydown.page_up` and `keydown.page_down` change the month. The filter
  names use an underscore (`page_up`), matching the schema. `page-up` is
  not a built-in name and would throw as an unknown filter.
- `keydown.alt+page_up` and `keydown.alt+page_down` change the year.
  Alt+PageDown does not match `page_down`, because every modifier flag
  has to match.
- `keydown.home` and `keydown.end` jump to the first and last day of the
  visible month. `keydown.enter` books the focused day; `keydown.esc`
  clears the booking.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Surgery board, the full set of filters, importmap, and registration |
| [`appointment_calendar_controller.js`](appointment_calendar_controller.js) | Day, month, and year moves plus Enter and Escape |

**Try it**

The calendar opens on October 2026 with the 12th focused. Press Right to
the 13th, then Enter to hold that morning for Mochi. Press Escape to
clear it. Page Down moves to November; Alt+Page Down moves to 2027.
Home always lands on the 1st of the month you are looking at.
