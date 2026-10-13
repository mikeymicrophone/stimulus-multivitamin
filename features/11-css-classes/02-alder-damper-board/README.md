# CSS classes · 02 · Alder damper board

Port Townsend smokehouse. The alder room is banked. The maple room
has not been lit. Each room can be drawing, banked, or shut, and
only one of those classes stays on the room.

**What it teaches**

- `static classes = ["drawnOpen", "banked", "shut"]` declares three
  logical names. `drawnOpen` is the attribute
  `data-damper-board-drawn-open-class`.
- `this.drawnOpenClass`, `this.bankedClass`, and `this.shutClass`
  are the tokens from those attributes.
- Draw, bank, and shut remove the other two tokens and add one, on
  the controller element. The strings `room-drawing`, `room-banked`,
  and `room-shut` are only in the markup.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Alder and maple rooms, importmap, and registration |
| [`damper_board_controller.js`](damper_board_controller.js) | Swaps the three classes on the room |

**Try it**

The alder room opens "Alder room drawnOpenClass room-drawing.
bankedClass room-banked. shutClass room-shut. Showing banked." The
maple room opens with the same three tokens and "Showing none."
Draw the alder fire. The reading says "Showing drawing." Shut the
maple damper. The maple reading says "Showing shut." The alder room
still says "Showing drawing."
