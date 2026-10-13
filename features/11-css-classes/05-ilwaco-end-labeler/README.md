# CSS classes · 05 · Ilwaco end labeler

Pilchard line at Ilwaco. Line 1 named its jam class. Line 2 left the
slip blank. Line 3 left only spaces.

**What it teaches**

- A present `end-jam` attribute reads `jammedClass` `end-jam` and
  `jammedClasses` `["end-jam"]`. `hasJammedClass` is true.
- An empty attribute is present. `hasJammedClass` is true,
  `jammedClasses` is `[]`, and `jammedClass` is `undefined`. It does
  not throw. A whitespace-only attribute tokenizes to the same empty
  list. See
  [An empty class attribute is present and the singular value is undefined](../../../DISCOVERIES.md#an-empty-class-attribute-is-present-and-the-singular-value-is-undefined).
- `classList.add(this.jammedClass)` on a blank slip adds the token
  `undefined`, because the DOM stringifies that value. Spreading
  `jammedClasses` into `classList.add` adds nothing.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three labelers, importmap, and registration |
| [`end_labeler_controller.js`](end_labeler_controller.js) | Stamps the singular class or the list onto the label |

**Try it**

Line 1 opens `Line 1 connect. hasJammedClass true. jammedClass end-jam. jammedClasses ["end-jam"]. Label class "tin".`
Line 2 opens `Line 2 connect. hasJammedClass true. jammedClass undefined. jammedClasses []. Label class "tin".`
Line 3 opens the same three facts as line 2, with the name Line 3.
Stamp the class on line 2. The reading says `Label class "tin undefined".`
Stamp the list on line 3. The reading says `Label class "tin".`
Stamp the class on line 1. The reading says `Label class "tin end-jam".`
