# Action options · 10 · Community radio request

WPOV 91.7's evening request desk. Opening the request sheet should not
immediately close it. Clicks inside the sheet must stay there. Clicks on
the studio clock should close it. A phase log shows which listeners ran.

**What it teaches**

- Native click order is capture (window → document → target) then bubble
  (target → document → window). These descriptors pick a target and a
  phase:
  1. `click@window->request-desk#recordWindowCapture:capture`
  2. `click->request-desk#keepSheetOpen:stop` on the form
  3. `click@document->request-desk#closeIfOutside`
  4. `click@window->request-desk#recordWindowBubble`
- `:stop` on the form runs in the bubble phase. Document and window
  bubble actions never see an inside click. Window capture already ran,
  so the log still starts with "window capture".
- `closeIfOutside` therefore only closes the sheet for clicks that were
  not stopped — the studio clock, the now-playing card, the rest of the
  page.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Studio, request sheet, phase log, importmap, and registration |
| [`request_desk_controller.js`](request_desk_controller.js) | Opens, queues, closes, and logs phases |

**Try it**

Press "Request the next song", then click the Song field. The phase log
should read `window capture`, then `form bubble (:stop)` — no document or
window bubble, and the sheet stays open. Click the studio clock: the log
gains `window capture`, `document bubble`, `window bubble`, the sheet
closes, and the clock stamps the interaction.
