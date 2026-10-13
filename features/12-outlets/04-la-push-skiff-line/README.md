# Outlets · 04 · La Push skiff line

First Beach. The line opens tied to Kestrel. Murrelet is a second
skiff. Gull is a hull with no controller until the line takes it.

**What it teaches**

- `data-skiff-line-skiff-outlet` is the selector. Changing it
  from `#skiff-kestrel` to `#skiff-murrelet` runs
  `skiffOutletDisconnected` for Kestrel and
  `skiffOutletConnected` for Murrelet. Kestrel's own controller
  stays connected. Paint on Murrelet is already set, because
  that skiff connected earlier.
- Removing the attribute disconnects the current outlet.
  `hasSkiffOutlet` is false afterward. The clear happens in
  the same action, and the getter already sees the missing
  attribute.
- Putting Gull on the line sets the selector, then adds
  `data-controller="skiff"`. The callback runs before Gull's
  `connect()`, so paint is still missing. Gull's status then
  says the paint is set.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three hulls, the line, importmap, and registration |
| [`skiff_line_controller.js`](skiff_line_controller.js) | Changes the selector and adds Gull's controller |
| [`skiff_controller.js`](skiff_controller.js) | Writes the paint flag in `connect()` |

**Try it**

Kestrel and Murrelet each open "paint set." The line opens
"Connected Kestrel. Paint set." then "Line connected.
hasSkiffOutlet true. Holding skiff-kestrel." Follow Murrelet.
The line adds "Disconnected Kestrel." and "Connected Murrelet.
Paint set." Clear the line. It adds "Line cleared. hasSkiffOutlet false."
and then "Disconnected Murrelet." Put Gull on the line.
It adds "Connected Gull. Paint missing." Gull's own line becomes
"Gull paint set."
