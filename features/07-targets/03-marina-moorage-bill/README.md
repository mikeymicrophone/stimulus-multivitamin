# Targets · 03 · Marina moorage bill

October at the Boat Haven marina. The moorage bill and the harbor
ledger sit on the same slip form. The slip fee is one input that both
controllers read. Power is only on the bill. The posted date is only
on the ledger. A $999 field is stamped for the ledger identifier alone.

**What it teaches**

- Two controllers on one element do not share a target attribute. The
  slip fee input has both `data-moorage-bill-target="slipFee"` and
  `data-moorage-bill-ledger-target="charge"`. Each controller finds it
  under its own name.
- The attribute name is exactly `data-${identifier}-target`.
  `data-moorage-bill-ledger-target` does not count as a
  `moorage-bill` target, even though `moorage-bill` is a hyphen-prefix
  of `moorage-bill-ledger`. Action parameters do leak across that
  prefix; targets do not.
- A field that belongs to one controller (power, the posted date) only
  carries that controller's attribute.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Shared slip form, importmap, and registration |
| [`moorage_bill_controller.js`](moorage_bill_controller.js) | Adds slip fee and power, and counts slip-fee targets |
| [`moorage_bill_ledger_controller.js`](moorage_bill_ledger_controller.js) | Reads the same slip fee as a ledger charge |

**Try it**

Press "Post October". The bill due is $228.00 (slip $186.00 plus power
$42.00) and it reports one slip-fee field. The ledger charge is
$186.00 posted 2026-10-01, the slip fee alone, not the $999 field and
not the power. Change the slip fee to 200 and post again: the bill due
is $242.00 and the ledger charge is $200.00. The count stays 1.
