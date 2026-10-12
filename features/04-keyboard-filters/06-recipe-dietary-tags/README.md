# Keyboard filters · 06 · Recipe dietary tags

Millet & Sage's recipe lab. The card for "Charred broccoli with chili
crisp" already has vegetarian and gluten-free. Enter, Tab, or comma
commits another tag; Escape clears the draft; Backspace on an empty
field removes the last chip.

**What it teaches**

- Keyboard filters on an `<input>`. `keydown.enter` commits a tag.
  `preventDefault()` stops the wrapping form from submitting.
- `keydown.tab` commits a non-empty draft and moves focus to Save. Tab
  with an empty draft is left alone so the browser can move on.
- `keydown.esc` clears the draft without touching the chips.
- `comma` and `Backspace` are not in the default `keyMappings`. A plain
  `keydown` action reads `event.key` for those. Writing `keydown.comma`
  would throw `contains unknown key filter: comma` the first time any key
  reached that action.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Recipe card, chips, tag field filters, importmap, and registration |
| [`dietary_tags_controller.js`](dietary_tags_controller.js) | Commits on Enter, Tab, and comma; Backspace removes the last chip |

**Try it**

Type `nut-free` and press Enter: a chip appears. Type `vegan,` including
the comma: that commits too. Press Escape while a half-typed tag is in
the field to clear it. Click the field, delete any draft, and press
Backspace to remove vegan. Tab from a new draft moves to "Save recipe
card" instead of submitting the form.
