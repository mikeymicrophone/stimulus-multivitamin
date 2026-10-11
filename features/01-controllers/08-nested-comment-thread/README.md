# Controllers · 08 · Nested comment thread

A community garden's discussion board, where Marisol asks why her tomatoes
split after heavy rain. Every comment, reply, and reply to a reply is its own
`comment` controller nested inside its parent's. The `comment-thread`
controller around them counts them all and builds new ones.

**What it teaches**

- A controller can nest inside itself. Each `comment` instance's scope ends
  at the nested comments inside it, so `this.repliesTarget` and
  `this.repliesToggleTarget` always mean this comment's own, never a
  descendant's.
- Actions respect the same boundary. Every comment has a
  `comment#toggleReplyForm` button, and clicking one runs only the
  innermost comment that contains it.
- The same elements look different from another scope. Each comment element
  is also a `comment-thread` target, and the thread, which isn't nested in
  itself, sees every comment at every depth.
- Parents connect before their children. Each comment looks up its parent
  instance on connect with `application.getControllerForElementAndIdentifier()`
  and reports reply counts up the chain as replies connect and disconnect.
- Comments cloned from the `<template>` get fresh instances, and their depth
  comes from the parent they were inserted under.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Thread markup, comment template, importmap, and controller registration |
| [`comment_thread_controller.js`](comment_thread_controller.js) | Sees every comment; counts them and builds new ones from the template |
| [`comment_controller.js`](comment_controller.js) | One instance per comment at any depth; replies, collapses, and counts its own branch |

**Try it**

Reply to Dev's comment, then hide Hollis's first comment's replies: the
button counts the whole branch, including the reply you just added. Reply to
Beatriz's deepest comment ("Good tip…"). It is already four levels deep, so
your reply joins Hollis's replies with an @mention instead of nesting
further. Delete one of your replies and watch every ancestor's count and the
thread total update.
