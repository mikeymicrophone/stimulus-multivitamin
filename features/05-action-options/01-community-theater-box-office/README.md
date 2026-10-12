# Action options · 01 · Community theater box office

Harbor Lights Players' online window for *Night Heron*. The visitor picks a
section, a quantity, and add-ons. Charge card is a link to a receipt page
whose descriptor is `click->box-office#charge:prevent:once`.

**What it teaches**

- `:prevent` calls `event.preventDefault()` before the method. The link does
  not navigate, so `charge()` can write the receipt on this page.
- `:once` is a native `addEventListener` option, `{ once: true }`. After the
  first click the browser removes that listener. A second click never
  reaches `charge()`, even while the link stays enabled.
- Options chain on one descriptor: `:prevent:once`. Stimulus runs the
  built-in `:prevent` filter, then the method. `:once` is not a Stimulus
  filter; it is handed to the browser.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Box office markup, the Charge card link, importmap, and registration |
| [`box_office_controller.js`](box_office_controller.js) | Prices tickets and writes a one-time receipt |

**Try it**

Leave the two orchestra tickets, tick the printed program, and press
"Charge card". The receipt stays on this page (`:prevent`) and names order
HL-1842. Press "Charge card" again: the receipt and the charge count do not
change, because `:once` already dropped the listener. Change the section to
balcony after that — the total updates, but charging still does nothing.
