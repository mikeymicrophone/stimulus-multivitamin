# Action parameters

data-[identifier]-[name]-param attributes, automatic typecasting to numbers, booleans, objects, and strings, and reading them from event.params.

Official reference: <https://stimulus.hotwired.dev/reference/actions#action-parameters>

## Examples (13 of 13 bottled)

01. [Library hold shelf](01-library-hold-shelf/) — available
02. [Bakery preorder window](02-bakery-preorder-window/) — available
03. [Trail kitchen batch card](03-trail-kitchen-batch-card/) — available
04. [Concert hall coat check](04-concert-hall-coat-check/) — available
05. [Campus mail tray](05-campus-mail-tray/) — available
06. [Neighborhood potluck board](06-neighborhood-potluck-board/) — available
07. [Field recording chapters](07-field-recording-chapters/) — available
08. [Museum gallery labels](08-museum-gallery-labels/) — available
09. [Greenhouse watering round](09-greenhouse-watering-round/) — available
10. [Courier dispatch slip](10-courier-dispatch-slip/) — available
11. [Lighthouse watch log](11-lighthouse-watch-log/) — available
12. [Repertory seat holds](12-repertory-seat-holds/) — available
13. [Orchard bin tickets](13-orchard-bin-tickets/) — available

## What each scenario adds

| Slot | Action-parameter technique |
| --- | --- |
| 01 | `data-[identifier]-[name]-param`; kebab-case becomes camelCase; HTML lowercases a camelCase attribute |
| 02 | `JSON.parse` casts numbers, booleans, `null`, and strings; `"FALSE"` and `"2e1"` |
| 03 | JSON arrays and objects; keys inside an object are not camelized; invalid JSON stays a string |
| 04 | Bare digit strings become numbers; a leading zero stays a string; JSON quotes; unsafe integers |
| 05 | Several actions on one element share its params; each action gets a fresh object |
| 06 | Params on elements added later; attributes are read when the action runs |
| 07 | Params with `keydown.enter` and `:prevent`, and with arrow filters on a different element |
| 08 | Params come from the action element, not `event.target` |
| 09 | Params versus values versus `dataset` |
| 10 | Two identifiers on one element; each action sees only its own params |
| 11 | An `@document` keyboard action reads the declaring element's params, not the focused field |
| 12 | A later action replaces `event.params` on the shared event; `:stop` keeps the original |
| 13 | A shorter identifier swallows a longer one's params; bins combine the casts above |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
