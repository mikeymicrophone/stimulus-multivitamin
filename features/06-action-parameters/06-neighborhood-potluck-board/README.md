# Action parameters · 06 · Neighborhood potluck board

Maple Court's Saturday potluck. Turkey chili is already on the board. New
dishes are added from the form, and each card signs the cook up through
action params.

**What it teaches**

- A card inserted with `data-action` and `data-potluck-board-*-param`
  works once Stimulus has bound the action.
- `button.click()` in the same turn the card was inserted does not run
  `signUp`. The binding arrives on a later microtask. See
  [Actions on a brand-new element are not bound in the same turn](../../../DISCOVERIES.md#actions-on-a-brand-new-element-are-not-bound-in-the-same-turn).
- Param attributes are read when the action runs. Doubling the chili
  servings attribute changes the next signup without reconnecting.
- Dish names are stored with `JSON.stringify`, so they stay strings.
  Servings are stored as raw digits, so `"8"` becomes the number `8` and
  `"true"` / `"false"` become booleans.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Chili card, add form, importmap, and controller registration |
| [`potluck_board_controller.js`](potluck_board_controller.js) | Signs up from params and inserts new cards |

**Try it**

Bring the turkey chili: servings are the number 8, vegetarian is the
boolean false, and the dish name is a string. Double the chili, then bring
it again: servings are 16. Add apple crumble and claim it from the new
card. Add and claim immediately: the new card does not claim in that same
turn. Claim it from the card afterward.
