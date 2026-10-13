# Targets · 07 · Costume shop pull list

The Salt Line opens Friday. Wardrobe, wigs, and props share one rack.
The lantern is in storage, covered with the `hidden` attribute, and it
is still a piece target.

**What it teaches**

- `pieceTargets` is every piece element. Hiding a piece, or covering it
  with `hidden` from the start, does not take it out of the list.
  `pieceTarget`, the singular, is the first piece in the document: the
  Act I coat, even while a wig filter has hidden the coat.
- Filtering is `pieceTargets.filter(...)`. The wigs come back in
  document order, Gray bob then Storm wig, not in the order the boxes
  were checked.
- "Pull checked pieces" walks that same list. A checked lantern is
  pulled even though the row is covered, and it is named after the
  pocket watch because that is their order on the page.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The rack, department buttons, importmap, and registration |
| [`pull_list_controller.js`](pull_list_controller.js) | Filters, counts, and pulls from `pieceTargets` |

**Try it**

The opening status names all five pieces, including the lantern, and
says the first piece on the page is the Act I coat. The lantern row is
covered. Show wigs: the status lists Gray bob, Storm wig, the first
piece is still the Act I coat, and the list length is still 5. Check
the pocket watch and the lantern, then pull checked pieces. The status
says "Pulling Pocket watch, Lantern."
