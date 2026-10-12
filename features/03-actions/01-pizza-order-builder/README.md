# Actions · 01 · Pizza order builder

Pickup ordering for Forno Rosa, a neighborhood pizzeria. One `pizza-order`
controller sits on the form. Size, crust, toppings, quantity, a note for the
kitchen, a "Schedule for later" panel, an allergen link, and the form itself
all call it, and almost every descriptor leaves out the event name.

**What it teaches**

- A descriptor can leave out the event name, and Stimulus picks the
  element's default event. The defaults in Stimulus 3.2.2:

  | Element | Default event |
  | --- | --- |
  | `<a>` | `click` |
  | `<button>` | `click` |
  | `<details>` | `toggle` |
  | `<form>` | `submit` |
  | `<input type="submit">` | `click` |
  | any other `<input>` | `input` |
  | `<select>` | `change` |
  | `<textarea>` | `input` |

- Radios and checkboxes default to `input`, which fires on every check and
  uncheck, so the order ticket updates without a `change` listener.
- `<input type="button">` gets the `input` default too, and never fires
  `input`. A bare `pizza-order#repeatLastOrder` on it would do nothing, so
  "Repeat my last order" says `click->pizza-order#repeatLastOrder`.
- Setting `.value` or `.checked` from code fires no events, so repeating the
  last order runs none of the field actions. The method renders directly.
- The link's action calls `event.preventDefault()` so the page doesn't jump
  to `#allergen-guide`, and the form's `submit` action does the same so the
  order stays on this page.

**Stimulus behavior worth knowing**

- An element with no default event (`<div>`, `<li>`, `<td>`, `<label>`, and
  most others) needs an event name. Without one, Stimulus can't build the
  action and drops it without any console message.
- A `<details>` rendered with `open` fires its first `toggle` before
  Stimulus is listening, so the `toggle` action never sees the starting
  state. "Schedule for later" starts open (the pizzeria remembers that this
  customer schedules), and `connect()` reads `.open` itself.
- Only `type="submit"` maps to `click`, and the comparison is exact:
  `type="SUBMIT"` falls back to `input`.
- `HTMLFormElement.submit()` does not fire a `submit` event, so a
  `data-action` on the form never sees it. `requestSubmit()` and a clicked
  submit button do. This page always submits through the button.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Order form markup with every `data-action`, importmap, and controller registration |
| [`pizza_order_controller.js`](pizza_order_controller.js) | Prices the order, enforces the topping limit, schedules pickup, and places the order |

**Try it**

Pick a large pie and five toppings: the other toppings disable at the limit.
Change the crust and quantity and watch the ticket. Type a note and the
counter drops on every keystroke. Close "Schedule for later" and the ticket
switches to "Ready in about 25 minutes". Reopen it and try to place the
order without a pickup time. Press "Repeat my last order" to load a saved
order, then place it.
