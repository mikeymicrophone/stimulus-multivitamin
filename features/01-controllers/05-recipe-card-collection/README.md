# Controllers · 05 · Recipe card collection

Rosa's digital recipe box. Every card is a `recipe-card` controller that
scales its own servings. "Load community recipes" fetches more cards as a
server-rendered HTML fragment. "Edit" attaches a `recipe-editor` controller to
that one card for as long as the edit lasts.

**What it teaches**

- Controllers attach to markup however it arrives. The fetched
  `community-recipes.html` fragment is inserted as a string, and Stimulus
  connects a `recipe-card` instance for each card in it.
- `data-controller` is a live list. `recipe-card` appends `recipe-editor` to
  its own element to start editing, and `recipe-editor` removes its own
  token (`this.identifier`) to finish. Adding a token connects a new
  instance and removing it disconnects that instance, while the card's
  `recipe-card` instance keeps its state the whole time.
- `disconnect()` undoes `connect()`. The editor turns off `contenteditable`,
  hides its toolbar, and restores the Edit button whether you save or cancel.
- A controller detached by removing its token can't read its targets in
  `disconnect()`. The element no longer matches
  `[data-controller~="recipe-editor"]`, so target lookups come back empty.
  The editor keeps the elements it needs from `connect()` instead.
- Actions for an identifier with no connected instance do nothing. The
  editor's Save and Cancel buttons are in every card's markup but only work
  while that card has a `recipe-editor`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Recipe box markup, importmap, and controller registration |
| [`recipe_box_controller.js`](recipe_box_controller.js) | Counts cards and inserts the fetched fragment |
| [`recipe_card_controller.js`](recipe_card_controller.js) | One instance per card; scales servings and attaches the editor |
| [`recipe_editor_controller.js`](recipe_editor_controller.js) | Exists only while a card is being edited |
| [`community-recipes.html`](community-recipes.html) | Server-rendered fragment of two more cards |

**Try it**

Bump the cornbread to 12 servings, then click Edit on that card. The card
gains `recipe-editor` in its `data-controller` attribute (check the elements
panel), and the title and notes become editable while the servings stay at
12. Cancel to restore the text, or clear the title and try to save. Then load
the community recipes and scale the plum cake: the new cards work like the
originals.
