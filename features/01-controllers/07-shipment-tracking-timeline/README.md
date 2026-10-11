# Controllers · 07 · Shipment tracking timeline

Hearth & Kiln, a small home-goods shop, tracks everything it has in transit:
a certified letter, a customer's parcel, inbound stock from Iceland, and a
wholesale freight order. Every shipment is a timeline. Parcels, international
packages, and freight extend one base controller class with their own
details.

**What it teaches**

- Controllers are classes, so they share behavior through inheritance.
  `tracking-timeline` is a complete controller (the certified letter uses
  it directly) that also exports its class as a base.
- `parcel-tracking` and `freight-tracking` extend it, and
  `international-tracking` extends `parcel-tracking`, two levels down.
- Static `targets` and `values` are merged up the class chain. Each subclass
  keeps the base's `timeline`, `status`, and `scans` and adds its own, but
  the attributes always use the subclass's identifier
  (`data-international-tracking-target="timeline"`).
- Subclasses override small hook methods (`describeScan()`,
  `renderDetails()`, `canAdvance()`) and call `super` instead of copying the
  base's `render()`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Shipment markup with scan data, importmap, and controller registration |
| [`tracking_timeline_controller.js`](tracking_timeline_controller.js) | Base class: renders scans and advances to the next one |
| [`parcel_tracking_controller.js`](parcel_tracking_controller.js) | Adds a delivery window |
| [`international_tracking_controller.js`](international_tracking_controller.js) | Extends the parcel controller with a customs hold and import duties |
| [`freight_tracking_controller.js`](freight_tracking_controller.js) | Adds pallet counts and a dock appointment |

**Try it**

Click "Next scan" on each shipment. The sweaters stop at customs. "Next scan"
is disabled until you pay the duties, and the parcel delivery window still
shows because the subclass calls `super`. Play the freight order through to
delivery and the final scan reports 5 of 6 pallets, a short shipment.
