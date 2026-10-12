# Lifecycle callbacks · 02 · Session timeout warning

Riverbend Credit Union's online banking signs idle members out. The signed-in
area carries a `session-timeout` controller that watches for activity, warns
15 seconds before the deadline, and then signs the member out. The
`online-banking` controller swaps that area for server HTML on sign-out and
sign-in. The timeout is 45 seconds here so you can watch it happen.

**What it teaches**

- Listeners you add yourself are yours to remove. The activity listeners sit
  on `document`, outside the controller's element, so Stimulus doesn't know
  about them. They are added with an `AbortController`'s `signal`, and a
  single `abort()` in `disconnect()` removes every one.
- The listeners also come off while the warning is showing, because only
  "Stay signed in" should extend the session, and go back on afterward. That
  is why they are managed by hand rather than declared in `data-action`.
- Global listeners declared in `data-action` (`focus@window`,
  `visibilitychange@document`) are removed by Stimulus when the controller
  disconnects and re-added if it reconnects. You don't clean those up.
- `disconnect()` clears every timer. Signing out replaces the signed-in
  markup, and a timer left running would show a warning or sign out again
  on the signed-out page.
- Signing back in inserts new HTML, so a new instance starts a fresh
  session. Nothing carries over from the old one.
- Activity only updates a timestamp. The single pending timer checks that
  timestamp when it fires, so typing doesn't clear and reset a timeout on
  every keystroke.

**Behavior worth knowing**

- An `AbortController` aborts only once. Calling `addEventListener()` with an
  already-aborted signal silently adds nothing. If the controller made one
  `AbortController` in `initialize()`, the listeners would stop working after
  the first warning. It makes a new one each time it starts listening.
- Timers can fire late, or not at all, while a laptop sleeps. The controller
  also checks the deadline when the tab regains focus or becomes visible.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Banking page markup with the signed-in area rendered in, importmap, and controller registration |
| [`session_timeout_controller.js`](session_timeout_controller.js) | Watches for activity, warns, and signs out; cleans up every listener and timer |
| [`online_banking_controller.js`](online_banking_controller.js) | Swaps the session area for server HTML |
| [`sessions/signed-in.html`](sessions/signed-in.html), [`sessions/signed-out.html`](sessions/signed-out.html) | Server-rendered session areas |

**Try it**

Type in the transfer form now and then, and the warning never shows. Stop
for 30 seconds and the warning appears. Typing in the form no longer helps,
but "Stay signed in" does. Let the countdown run out and you're signed out
with a security message, and no warning follows. Sign back in and the new
session gets its own 45 seconds. Use "Sign out" to see the other message.
