# Actions · 07 · API token copy button

The API tokens page in Parcelwise's developer settings. Each token is an
`api-token` controller that masks the secret, reveals it, copies it to the
clipboard, and rolls it for a new one from the API.

**What it teaches**

- Actions can be `async`. `copySecret` awaits `navigator.clipboard.writeText()`
  and `rollSecret` awaits a `fetch()`. Stimulus calls the method and moves
  on; it doesn't wait for the promise.
- Take what you need from the event before the first `await`. Both methods
  destructure `currentTarget` in their parameter list
  (`async rollSecret({ currentTarget: rollButton })`), so the button is
  still in hand when the response arrives.
- The event object is the browser's own event. `copy->api-token#copyFullSecret`
  gets a `ClipboardEvent`, cancels it, and writes the real token into
  `event.clipboardData`. Selecting the masked dots and pressing Ctrl+C
  still copies the token.
- Every async action catches its own failures. When the clipboard is
  blocked, the token is revealed and selected with instructions to copy it
  by hand. A failed roll explains itself in the token's status line.
- The Reveal and Copy buttons hold an SVG icon and a label. Clicks land on
  the `<svg>`, a `<path>`, or the `<span>`, which doesn't matter because no
  action reads `event.target`.

**Stimulus behavior worth knowing**

- `event.currentTarget` is `null` after an `await` that waits for a later
  task (a timer, a network response, most browser APIs). The browser sets
  it only while the event is being dispatched. It can still look right
  after `await Promise.resolve()`, which settles before dispatch moves on,
  so the bug shows up only once real work is awaited.
- A rejected promise from an action does not go through
  `application.handleError()`. Stimulus catches errors thrown while it
  calls the method, but an `async` method returns before its body fails, so
  the rejection becomes an `unhandledrejection` on `window` instead.
  [Error handling](../../15-error-handling/) has a planned scenario on this.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Token markup, importmap, and controller registration |
| [`api_token_controller.js`](api_token_controller.js) | Reveals, copies, and rolls one token |
| [`rolled/order-sync.json`](rolled/order-sync.json), [`rolled/staging-webhooks.json`](rolled/staging-webhooks.json) | The API's responses when a token is rolled |

**Try it**

Press Copy on "Order sync" and paste somewhere: the full token arrives even
though it is masked. Select the masked dots with the mouse and press Ctrl+C:
the real token is copied again. Reveal the staging token, then roll it: the
button disables while the request is out and the last four characters
change. If your browser blocks clipboard access for this page, Copy selects
the token for you instead.
