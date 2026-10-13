# Dispatching custom events · 06 · Orcas departure board

The Chelan asks to leave Orcas. The harbor master can veto.
The wharf hand is a later listener. The winch can throw.

**What it teaches**

- `dispatch` returns the `CustomEvent` after listeners have
  run. `type` is `departure-board:departed`. The board
  holds the boat only when `defaultPrevented` is true.
- The master calls `preventDefault()`. The wharf, listening
  at `@window`, still runs and already sees
  `defaultPrevented` true. `preventDefault` does not stop
  later listeners.
- `cancelable: false` lets the master call
  `preventDefault()`, and `defaultPrevented` stays false.
  The board lets the boat go.
- When the winch throws, Stimulus reports
  `Error invoking action "departure-board:departed->jammed-winch#seize"`.
  The master and the wharf still run. `dispatch` still
  returns the event.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Master, board, winch, and wharf |
| [`departure_board_controller.js`](departure_board_controller.js) | Checks the returned event |
| [`harbor_master_controller.js`](harbor_master_controller.js) | The veto |
| [`wharf_hand_controller.js`](wharf_hand_controller.js) | A later listener |
| [`jammed_winch_controller.js`](jammed_winch_controller.js) | Throws on a jammed departure |

**Try it**

The board says "Chelan is alongside." The master says
"Master is on watch." The wharf says "Wharf is clear."
The fault line is hidden. Depart. The master says "Master
allowed. defaultPrevented false." The wharf says "Wharf
saw defaultPrevented false. vessel Chelan." The board
says "Let go Chelan. defaultPrevented false. cancelable
true. type departure-board:departed." Check Refuse
departure. The master says "Master will refuse." Depart.
The master says "Master refused. defaultPrevented true."
The wharf saw true. The board says "Held Chelan.
defaultPrevented true. cancelable true. type
departure-board:departed." Depart fixed. The master says
"Master refused. defaultPrevented false." The wharf saw
false. The board says "Let go Chelan. defaultPrevented
false. cancelable false. type departure-board:departed."
Jam and depart. The fault says `Error invoking action
"departure-board:departed->jammed-winch#seize" :: Error:
winch pawl skipped`. The master still refused and the
wharf still saw true. The board says "Held Chelan.
defaultPrevented true. cancelable true. type
departure-board:departed."
