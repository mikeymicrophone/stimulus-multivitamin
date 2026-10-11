# Controllers · 12 · Warehouse pick list

A picker's handheld screen at an outdoor-gear fulfillment center. Luis walks
the aisles for order SO-55821. He scans a bin label to confirm the location,
scans each item into tote T-37, and marks a line short when the shelf comes
up empty.

**What it teaches**

- Composing a page from small controllers: `pick-list`, `barcode-scanner`,
  one `pick-line` per order line, and a `tote`.
- Two controllers can split one job on one element.
  `data-controller="pick-list barcode-scanner"` puts both on the same
  `<section>`, and the scanner reaches its partner with
  `application.getControllerForElementAndIdentifier(this.element, "pick-list")`.
  The scanner knows how codes arrive; the pick list knows what they mean.
- An element can be a target of one controller and the host of another. The
  tote is `data-pick-list-target="tote"` and `data-controller="tote"`.
- Each controller sticks to its own job and markup and talks to the others
  only through public methods: `recordScan()`, `activate()`, `recordPick()`,
  `addItem()`, and `lineChanged()`.
- Lines connect after the pick list, so the list filters out lines whose
  controllers aren't ready yet, and each line calls `lineChanged()` when it
  connects.
- Action params typecast their values, so the simulator buttons keep UPCs in
  `value=""`, where a code like `084271003318` keeps its leading zero.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Pick screen markup, importmap, and controller registration |
| [`pick_list_controller.js`](pick_list_controller.js) | The hub; enforces bin-then-item scanning and tracks progress |
| [`barcode_scanner_controller.js`](barcode_scanner_controller.js) | Shares the pick list's element; turns scanner input into scans |
| [`pick_line_controller.js`](pick_line_controller.js) | One instance per order line; counts picks and handles short picks |
| [`tote_controller.js`](tote_controller.js) | Tracks the tote's contents and weight limit |

**Try it**

Scan "Item 084271003318" before its bin and the pick list asks for bin
A-03-2 first. Scan the bin, then the item three times. Try the stray UPC
shelved next to the mugs. Short-pick the headlamp, then finish the rest.
The tote goes over its 3.5 kg limit near the end, and the completion
message flags the short line. You can also type a code into the scan field
and press Enter, the way a handheld scanner does.
