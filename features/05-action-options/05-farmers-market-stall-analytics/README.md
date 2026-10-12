# Action options · 05 · Farmers market stall analytics

Saturday market at Brookhaven Green. The directory wants a visit log for
every stall interaction, including "Text the stall", which must not also
open the stall card.

**What it teaches**

- `:capture` is `{ capture: true }`. The directory's
  `click->market-directory#recordVisit:capture` runs while the event is
  traveling down, before any child action.
- `:stop` on "Text the stall" calls `stopPropagation()` when that action
  runs, in the bubble phase. Capture-phase ancestors have already run.
  Bubble-phase ancestors, including the directory's second action and the
  card's `openStall`, never see the event.
- Two actions on the directory therefore disagree after a stopped click:
  the capture log names the stall, the bubble log does not.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Stall cards, visit logs, importmap, and registration |
| [`market_directory_controller.js`](market_directory_controller.js) | Capture/bubble logs, composer, and stall detail |

**Try it**

Press "Text the stall" on Honey & Hickory. The composer opens, the capture
log lists Honey & Hickory, and the bubble log stays empty — `:stop` hid
the click from the card and from the bubble recorder. Then click the Mill
Loaf card body (not its button): both logs gain a line and the stall
detail opens.
