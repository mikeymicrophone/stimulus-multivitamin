# Lifecycle callbacks · 08 · Live support chat transcript

Ana is chatting with Priya from Brightline Internet about slow evening
speeds. A push channel appends Priya's messages to the transcript the way
Turbo Streams would, without telling any controller. The `chat-transcript`
controller watches the message list with a `MutationObserver`: it scrolls
new messages into view while Ana is following along, and counts them as
unread (in a pill and in the tab title) when she has scrolled up or
minimized the chat. The `support-chat` controller pops the chat out to the
corner of the window, sends Ana's messages, and ends the chat.

**What it teaches**

- A `MutationObserver` watches content that something else changes. The
  observer is created once in `initialize()`; `connect()` starts observing
  the message list and `disconnect()` stops.
- `disconnect()` must undo `connect()` exactly. "Pop out" moves the panel,
  which disconnects and reconnects the transcript. If the observer were left
  running there would be two after the move, and every message would be
  counted twice.
- Undo global side effects. The unread count goes in `document.title`,
  which belongs to the whole page. `connect()` remembers the title and
  `disconnect()` restores it, so ending the chat with unread messages doesn't
  leave "(1)" in the tab.
- Server HTML that replaces the panel ("End chat") disconnects it for good.
  The push channel finds no message list and stops too.

**Behavior worth knowing**

- A moved element loses its scroll position, and it is already reset by the
  time `disconnect()` runs, because Stimulus reacts to the move after it has
  happened. The transcript records its position on every scroll and restores
  it in `connect()`. If you need a value in `disconnect()`, capture it before
  it can change, as in
  [Controllers · 05](../../01-controllers/05-recipe-card-collection/).
- A `MutationObserver` only reports changes made while it is observing.
  Anything that happens to the list while the controller is disconnected
  goes unnoticed, so `connect()` works from the current DOM instead of
  assuming it saw everything.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Account page and chat markup, importmap, controller registration, and the stream's script |
| [`chat_transcript_controller.js`](chat_transcript_controller.js) | Observes the message list, scrolls or counts unread, and restores the page title |
| [`support_chat_controller.js`](support_chat_controller.js) | Pops the chat out, sends messages, and ends the chat |
| [`chat_stream.js`](chat_stream.js) | Stands in for the server's push channel; appends messages by element id |
| [`chat-ended.html`](chat-ended.html) | The server's summary that replaces the chat |

**Try it**

Priya sends a message every five seconds. Stay at the bottom and each one
scrolls into view. Scroll up a little: the next message shows "1 new
message ↓" and the tab title gets a count. Pop the chat out. It keeps your
reading position, and the next message makes it "2 new messages", not 3.
Click the pill to catch up. Minimize the chat and the header counts what you
missed. Send a message, then scroll up, wait for an unread count, and end
the chat: the summary replaces it and the tab title goes back to normal.
