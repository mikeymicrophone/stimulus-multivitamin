# Dispatching custom events

`this.dispatch()` names an event `identifier:name`, passes `detail`, and can set `prefix`, `target`, `bubbles`, and `cancelable`. Other controllers listen with `data-action`. The call returns the event, so a listener can veto the work.

Official reference: <https://stimulus.hotwired.dev/reference/controllers#cross-controller-coordination-with-events>

## Examples (13 of 13 bottled)

01. [Port Gamble tide staff](01-port-gamble-tide-staff/) — available
02. [Coupeville landing slip](02-coupeville-landing-slip/) — available
03. [Samish shellfish ticket](03-samish-shellfish-ticket/) — available
04. [Lopez freight bell](04-lopez-freight-bell/) — available
05. [Point Wilson signal flags](05-point-wilson-signal-flags/) — available
06. [Orcas departure board](06-orcas-departure-board/) — available
07. [Lime Kiln keeper slate](07-lime-kiln-keeper-slate/) — available
08. [Goose Point retort tickets](08-goose-point-retort-tickets/) — available
09. [La Conner cannery pass](09-la-conner-cannery-pass/) — available
10. [Admiralty pilot orders](10-admiralty-pilot-orders/) — available
11. [Smith Island tide drum](11-smith-island-tide-drum/) — available
12. [Point Robinson bell relay](12-point-robinson-bell-relay/) — available
13. [Edmonds ramp pitfalls](13-edmonds-ramp-pitfalls/) — available

## What each scenario adds

| Slot | Dispatch technique |
| --- | --- |
| 01 | Default `identifier:name`. A hyphenated name stays hyphenated. Another controller's `posted` is a different event |
| 02 | `prefix`: a custom string, `false`, `""`, `null`, `0`, and the string `"false"` |
| 03 | `detail` objects, a fresh `{}` when detail is omitted, and `detail: null` |
| 04 | `target` on the controller element, another element, `document`, and `window`. `bubbles: false` stops at the target |
| 05 | Defaults for `bubbles`, `cancelable`, and `composed`. String `"false"` stays true. A shadow boundary |
| 06 | The returned event, `defaultPrevented` as a veto, later listeners, and a throw that does not reject the call |
| 07 | `data-action` on the element, `@document`, and `@window`. `keeper--slate` keeps `--`. Params beside detail |
| 08 | `event.params` typecast beside `event.detail`. The returned params are the last binding's, even when `:self` declines |
| 09 | An ancestor hears the bubble. A sibling does not. An outlet returns a value after the event is already filed |
| 10 | Order: element, ancestor, `@document`, `@window`. Window bindings sort by action index. `stopPropagation` and `stopImmediatePropagation` |
| 11 | Dispatch from `connect()` and `disconnect()`. A detached bubble is lost. The parent disconnects first |
| 12 | A listener dispatches again before the outer list finishes. `defaultPrevented` belongs to one event. A hop limit |
| 13 | Siblings stay quiet. `prefix: false` collides with `click` and `change`. `detail` is shared by reference |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
