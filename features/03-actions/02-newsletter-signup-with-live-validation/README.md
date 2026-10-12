# Actions · 02 · Newsletter signup with live validation

The signup form for The Saturday Larder's three newsletters. One
`newsletter-signup` controller cleans up and checks the email address as it
is typed, suggests a fix for common domain typos, requires at least one
newsletter, and subscribes only when everything checks out.

**What it teaches**

- One element can list several actions, for one event or several. The email
  field has `input->newsletter-signup#normalizeEmail`,
  `input->newsletter-signup#validateEmail`, and
  `blur->newsletter-signup#revealEmailError`.
- Actions for the same event on the same element run in the order they are
  written. `normalizeEmail` strips spaces and lowercases the domain before
  `validateEmail` looks at the address.
- Order is how one action guards another. The form lists
  `submit->newsletter-signup#validateSignup` before
  `submit->newsletter-signup#subscribe`. When something is wrong,
  `validateSignup` calls `event.preventDefault()` and
  `event.stopImmediatePropagation()`, and `subscribe` never runs.
- Bubbling events can be handled on a container. The topics `<fieldset>`
  has no default event, so it names `change` and hears every checkbox in it.
- Code that sets `.value` has to dispatch the event itself. "Use this
  address" fills in the corrected email and dispatches `input`, so both
  email actions run in their usual order.
- Errors appear after the first blur, then update live while you type.

**Stimulus behavior worth knowing**

- `event.stopPropagation()` does not stop the next action on the same
  element. All of an element's actions for one event share one native
  listener, so only `event.stopImmediatePropagation()` skips the rest.
  Both also keep the event from reaching ancestors, `@document`, and
  `@window`.
- The browser's built-in validation runs before `submit`. With
  `type="email"` or `required` on a field and no `novalidate`, an invalid
  form never fires `submit`, so no `submit` action runs. This form sets
  `novalidate` and does the checking in its own action.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Signup form markup with ordered `data-action` lists, importmap, and controller registration |
| [`newsletter_signup_controller.js`](newsletter_signup_controller.js) | Normalizes, validates, suggests corrections, and subscribes |

**Try it**

Type ` Rosa@FastMail.COM ` and watch the spaces disappear and the domain
lowercase as you type. Type `rosa@gmial.com` and choose "Use this address".
Clear the field and tab away: the error appears. Uncheck every newsletter
and press Subscribe: nothing is sent, and focus moves to the first problem.
Fix both and subscribe.
