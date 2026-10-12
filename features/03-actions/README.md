# Actions

data-action descriptors, default events per element, several actions on one
element, global @window and @document listeners, and working with the event
object.

Official reference: <https://stimulus.hotwired.dev/reference/actions>

## Examples (13 of 13 bottled)

01. [Pizza order builder](01-pizza-order-builder/) — available
02. [Newsletter signup with live validation](02-newsletter-signup-with-live-validation/) — available
03. [Photo lightbox](03-photo-lightbox/) — available
04. [Cart quantity steppers](04-cart-quantity-steppers/) — available
05. [Responsive navigation drawer](05-responsive-navigation-drawer/) — available
06. [Unsaved-changes guard](06-unsaved-changes-guard/) — available
07. [API token copy button](07-api-token-copy-button/) — available
08. [Product star rating](08-product-star-rating/) — available
09. [Menu that closes on outside click](09-menu-that-closes-on-outside-click/) — available
10. [Hotel booking date range](10-hotel-booking-date-range/) — available
11. [Offline connection banner](11-offline-connection-banner/) — available
12. [Branching customer survey](12-branching-customer-survey/) — available
13. [Spreadsheet-style cell editing](13-spreadsheet-style-cell-editing/) — available

## What each scenario adds

| Slot | Actions technique |
| --- | --- |
| 01 | Default events per element (`click`, `input`, `change`, `toggle`, `submit`) |
| 02 | Several actions on one element; order; `stopImmediatePropagation()` |
| 03 | `event.target` vs `currentTarget` vs `this.element`; `@document` and `@window` |
| 04 | Two controllers on one control, in a deliberate order; removing the element |
| 05 | Actions inside vs outside the controller's element; `@window` / `@document` only |
| 06 | Method names that say what they do; bubbling to the form; `beforeunload` |
| 07 | Async actions; `currentTarget` after `await`; the event is the browser's own |
| 08 | Bubbling vs not; `focusin` / `focusout`; one row serving many stars |
| 09 | `click@document` outside-close; click order; nested same-identifier scope |
| 10 | Actions on elements the controller builds; they bind after the insert |
| 11 | Window-only events (`online`, `offline`); two controllers, one global event |
| 12 | Composition: branching steps, hidden fields that stay bound, cloned inputs |
| 13 | Composition: a grid of cells, a moving editor, fetched rows with actions |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
