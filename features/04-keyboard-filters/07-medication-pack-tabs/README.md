# Keyboard filters · 07 · Medication pack tabs

Harold Quimby's 7-day blister pack at Oakridge Pharmacy. Morning, Noon,
Evening, and Bedtime are tabs. Left and right move between them; Home
and End jump to the ends. Only the selected tab is in the tab order.

**What it teaches**

- A tablist with roving tabindex. `keydown.left` and `keydown.right` move
  between the times of day. The selected tab is `tabindex="0"`; the others
  are `-1`, so Tab leaves the list in one stop.
- `keydown.home` and `keydown.end` jump to the first and last tab. The
  filter names are `home` and `end`, matching `event.key` `"Home"` and
  `"End"`.
- `keydown.space` and `keydown.enter` activate the focused tab. The arrows
  already activate (automatic activation). Space still needs
  `preventDefault()` so a focused tab does not scroll the page.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Tablist, four panels, filters, importmap, and registration |
| [`medication_pack_controller.js`](medication_pack_controller.js) | Roving tabindex, Home/End, left/right, Space/Enter |

**Try it**

Click Morning, then press Right until Bedtime, then Home to return to
Morning. Press End for Bedtime. Tab from the heading into the tablist:
only the selected tab takes focus, then Tab leaves for the rest of the
page.
