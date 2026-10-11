# Controllers · 01 · Invoice line-item editor

A freelance designer is billing a bakery. Each invoice row is its own
`line-item` controller; the `invoice` controller around them adds rows, reads
the tax rate, and totals everything.

**What it teaches**

- A controller is a class registered under an identifier. `line_item_controller.js`
  is registered as `line-item`, and the markup only ever uses that identifier.
- Every `data-controller="line-item"` element gets its own controller instance,
  so each row keeps its own state.
- Controllers nest. The parent asks each child instance for its subtotal via
  `application.getControllerForElementAndIdentifier()` instead of reading the
  child's inputs.
- Parents connect before their children, so each row looks up its invoice
  instance on connect and asks it to recalculate when the row connects,
  changes, and disconnects.
- Rows cloned from a `<template>` after page load are connected to a new
  instance automatically, and removed rows are disconnected.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Markup, importmap, and controller registration |
| [`invoice_controller.js`](invoice_controller.js) | Owns the invoice, adds rows, and totals the invoice |
| [`line_item_controller.js`](line_item_controller.js) | One instance per row; computes that row's subtotal |

**Try it**

Change a quantity or price and watch the row subtotal and the invoice totals
update. Add a row, then remove one. Each row recalculates on its own, and the
invoice only reads totals from the row controllers.
