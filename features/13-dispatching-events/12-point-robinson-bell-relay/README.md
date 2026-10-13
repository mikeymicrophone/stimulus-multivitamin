# Dispatching custom events · 12 · Point Robinson bell relay

A strike at Point Robinson can echo. The log answers, and
the answer can strike again, before the first record is written.

**What it teaches**

- `dispatch` is synchronous. `answer` runs, dispatches
  `bell-relay:reply`, and that reply's listeners finish
  before `answer` continues. The nested `strike` then
  finishes, including its own `record`, before the outer
  `record` runs.
- `reply.defaultPrevented` is not the strike's
  `defaultPrevented`. The echo vetoes the reply. The
  strike still says `outerPrevented false`.
- Nothing in `dispatch` stops a listener from dispatching
  the same event again. The hop count is the guard.
  Limit 2 means the first strike echoes once.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Log wrapped around the bell |
| [`bell_relay_controller.js`](bell_relay_controller.js) | Starts the strike |
| [`relay_log_controller.js`](relay_log_controller.js) | Answers, files the reply, records |

**Try it**

The bell says "The bell is quiet." Strike once. The bell
says "tape answer record strike-open. outerPrevented
false." Strike and echo. The bell says "tape answer
file-reply reply-vetoed answer file-reply reply-vetoed
record strike-open record strike-open. outerPrevented
false." The inner `record` appears before the outer
`record`. The reply was vetoed. The strike was not.
