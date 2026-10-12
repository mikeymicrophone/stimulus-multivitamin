# Action options

The built-in :once, :prevent, :stop, :passive, :capture, and :self options, and custom options registered with application.registerActionOption().

Official reference: <https://stimulus.hotwired.dev/reference/actions#options>

## Examples (13 of 13 bottled)

01. [Community theater box office](01-community-theater-box-office/) — available
02. [Vacation rental cards](02-vacation-rental-cards/) — available
03. [County archives viewer](03-county-archives-viewer/) — available
04. [Literary essay progress](04-literary-essay-progress/) — available
05. [Farmers market stall analytics](05-farmers-market-stall-analytics/) — available
06. [Botanical garden map](06-botanical-garden-map/) — available
07. [CSA share signup](07-csa-share-signup/) — available
08. [Clerk minutes editor](08-clerk-minutes-editor/) — available
09. [Hotel key encoder](09-hotel-key-encoder/) — available
10. [Community radio request](10-community-radio-request/) — available
11. [Metro fare FAQ](11-metro-fare-faq/) — available
12. [Community solar cancel](12-community-solar-cancel/) — available
13. [Permit photo uploader](13-permit-photo-uploader/) — available

## What each scenario adds

| Slot | Action-options technique |
| --- | --- |
| 01 | `:prevent:once` on a charge link; `:once` is a native listener option |
| 02 | `:stop` on nested Save / Share so a clickable card does not open |
| 03 | `:self` backdrop dismiss; `:!self` is a no-op; `event.target` vs `currentTarget` |
| 04 | `:passive` scroll on an essay column |
| 05 | `:capture` visit log versus a child `:stop` |
| 06 | `:!passive:prevent` so a wheel can zoom; `:passive` cannot cancel |
| 07 | Chaining several options; `:prevent:self` vs `:self:prevent`; mixed listeners |
| 08 | Keyboard filters with `:prevent` on `@window` and `@document` |
| 09 | `:once` on `keydown.enter` is spent by the first keydown of any key |
| 10 | `@window` capture, element `:stop`, `@document`, `@window` bubble |
| 11 | `registerActionOption("open")`; callback `{ name, value, event, element, controller }` |
| 12 | Custom `:confirmed` returning `false` to block; `:!confirmed` skips the check |
| 13 | Mixing `:prevent:stop:online:accepted` and `:prevent:once` |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
