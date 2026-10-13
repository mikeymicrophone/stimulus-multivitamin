# Target callbacks · 09 · Grain elevator ledger

Hard red winter and durum are on the pit when the window opens. Soft
white is checked in later. Reprinting the ticket replaces every load
with rye and malting barley.

**What it teaches**

- The chalk tally changes only by the bushels on the load passed into
  `loadTargetConnected` or `loadTargetDisconnected`. It ends equal to
  the grain that is actually on the pit.
- `loadTargets` already includes every load in the mutation. On open,
  the first tape line chalks 800 while the board already reads 1250.
  After the soft white is checked in, one new load is the whole
  mutation, so that line's chalk and board match at 1550.
- Reprinting is one `innerHTML` write. The first erasure still has a
  chalk of 750 and a board of 720, because rye and malting barley are
  already the list while hard red, durum, and soft white are still
  being subtracted. The chalk then walks down to 0 and back up to 720.
  Copying the board on that first erasure, and then letting the new
  loads add themselves, would double the ticket.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Pit, ticket buttons, importmap, and registration |
| [`elevator_ledger_controller.js`](elevator_ledger_controller.js) | Chalk, board, and the weighmaster's tape |

**Try it**

The tape opens with hard red at chalk 800 and board 1250, then durum
at chalk 1250 and board 1250, then "Window open". The tally reads
"Chalk tally 1250 bu." Check in the soft white. The new line is chalk
1550 and board 1550. Reprint the ticket. The hard red line reads
"chalk 750 · board 720". The pit shows rye and malting barley, and the
tally ends at "Chalk tally 720 bu."
