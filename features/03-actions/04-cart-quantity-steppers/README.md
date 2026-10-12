# Actions · 04 · Cart quantity steppers

The cart at Larkspur Seed Co., a mail-order seed company. Every line is a
`cart-line` controller with a − / + stepper, a quantity field, and a stock
limit. The `shopping-cart` controller around them adds up the lines, tracks
progress toward free shipping, and removes lines.

**What it teaches**

- An action reaches the nearest element with its identifier. All four lines
  use the same `cart-line#increment` descriptor, and each click reaches only
  the instance whose element contains the button.
- One element can call two controllers. The steppers say
  `cart-line#increment shopping-cart#recalculate`. The cart can be called
  from inside a line because the line is inside the cart's element.
- Actions on one element run in the order they are written, whatever
  controller they belong to and whichever connected first. The cart
  connects before the lines, but the line's action is listed first, so the
  quantity is already updated when the cart adds up. Swap the two and the
  totals trail one click behind.
- One field, two events. `input->cart-line#typeQuantity` updates the cart on
  every keystroke and ignores an empty or invalid field;
  `change->cart-line#settleQuantity` puts the last good quantity back when
  the shopper leaves the field.
- The cart reads each line's quantity from its `data-cart-line-quantity-value`
  attribute, which the line's value setter keeps current, so it doesn't
  depend on whether the lines have connected yet.

**Stimulus behavior worth knowing**

- An action that removes its own element stops later actions on that
  element for controllers outside the removed part of the page. With
  `cart-line#remove shopping-cart#recalculate` on the Remove button, and a
  `remove()` that detaches the line, the cart's action would be skipped:
  Stimulus only runs an action whose element is still inside its
  controller, and the button has left the cart. A later `cart-line` action
  in the same list would still run, because the button is still inside the
  detached line. That is why Remove calls `shopping-cart#removeLine`, and
  the cart removes the line and then recalculates in one method.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Cart markup with two-controller `data-action` lists, importmap, and controller registration |
| [`cart_line_controller.js`](cart_line_controller.js) | One instance per line; steps, types, and clamps its quantity |
| [`shopping_cart_controller.js`](shopping_cart_controller.js) | Adds up the lines, tracks free shipping, and removes lines |

**Try it**

Press + on the sunflowers until it stops at the stock limit. Press + on the
basil until the cart crosses $35 and shipping turns free. Type `12` in the
basil field: the totals follow as you type. Clear the field and click
elsewhere: the last good quantity comes back. Remove every line and the
checkout button disables.
