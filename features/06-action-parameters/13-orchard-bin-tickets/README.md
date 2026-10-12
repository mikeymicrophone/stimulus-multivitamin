# Action parameters · 13 · Orchard bin tickets

North packing at Red Barn Orchard. The shed is both a bin ticket and a
printer. Bin tags carry variety, bushels, a lot code, and the crew. New
bins are tagged from the form.

**What it teaches**

- `bin-ticket` is a hyphen-prefix of `bin-ticket-printer`. The shed slip
  action therefore also matches `data-bin-ticket-printer-copies-param`
  and `data-bin-ticket-printer-tray-name-param`, and reports them as
  `printerCopies` and `printerTrayName`. `copies` is missing on
  `bin-ticket`.
- `keydown.ctrl+p@window->bin-ticket-printer#printBatch:prevent` (and the
  matching `meta+p` action) reads `copies` and `trayName` from the shed.
  `shedName` is missing on the printer. `:prevent` keeps the browser from
  opening its print dialog.
- A bin button uses `click->bin-ticket#select:stop`, so the shed's click
  action does not run. Params come from the button. The variety span can
  be the target. Bushels is a number, organic is a boolean, and the crew
  is a JSON array.
- Lot `01428` keeps its leading zero and matches the stamped label. Lot
  `77021` becomes a number and does not match. See
  [Action params turn all-digit strings into numbers](../../../DISCOVERIES.md#action-params-turn-all-digit-strings-into-numbers).
- Tagging a bin inserts a button with the same param shape. A later click
  reads it.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Shed, bins, tag form, importmap, and both registrations |
| [`bin_ticket_controller.js`](bin_ticket_controller.js) | Reads the shed slip, selects a bin, and tags a new one |
| [`bin_ticket_printer_controller.js`](bin_ticket_printer_controller.js) | Prints a batch from the printer's params |

**Try it**

Read the shed slip: the keys include `printerCopies` and `printerTrayName`
beside `shedName`, and `copies` is missing. Press Ctrl+P or Cmd+P: the
batch names `copies` and `trayName`, and `shedName` is missing. Click the
word Honeycrisp: lot 01428 arrives as a string and matches, and the target
was SPAN. Click Cortland: lot 77021 arrives as a number and does not match.
Tag the McIntosh bin, then claim it from its new tag.
