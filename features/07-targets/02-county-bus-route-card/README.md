# Targets · 02 · County bus route card

Kitsap Transit route 7, Southworth to Port Orchard. The last stop in the
card is both a stop and the end of the line: one element, two target
names.

**What it teaches**

- Target names are tokens. `data-route-card-target="stop terminus"` puts
  that element in `stopTargets` and makes it available as
  `terminusTarget`. It is one node, so renaming the end of the line
  changes the stop list too.
- A stop with only the `stop` token is not a terminus.
- `terminusTarget` is the first match in the document. Flagging Harper,
  which is printed above Port Orchard, moves the singular end of the
  line to Harper. Stimulus does not warn that two elements now carry
  `terminus`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Route card markup, importmap, and registration |
| [`route_card_controller.js`](route_card_controller.js) | Reads stops and the end of the line from the two target names |

**Try it**

The summary lists Southworth, Harper, and Port Orchard, and names Port
Orchard as the end of the line, shared with the stop list. Rename the
end of the line: both the summary and the stop list say Port Orchard
Transit Center, because they are the same element. Flag Harper as an
end too. The stop list is unchanged, and the end of the line becomes
Harper, the earlier flag in the card.
