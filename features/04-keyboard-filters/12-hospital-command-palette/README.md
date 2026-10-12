# Keyboard filters · 12 · Hospital command palette

Mercy Harbor's charting desk for Marisol Keene. Ctrl+K or ⌘K opens a
command palette from the notes field. Arrows move the listbox; Enter
runs the highlighted command; Escape closes.

**What it teaches**

- A command palette is a global shortcut plus a listbox.
  `keydown.meta+k@window` and `keydown.ctrl+k@window` open it from the
  chart notes `<textarea>` or anywhere else — unlike the pub-quiz
  buzzers, this shortcut must win while a clinician is typing.
- Once open, the search field owns `keydown.down` / `up` / `home` /
  `end` (listbox active descendant), `keydown.enter` (run), and
  `keydown.esc` (close). The listbox itself is not focused;
  `aria-activedescendant` points at the active option.
- Ctrl+K while the palette is open toggles it closed. The same
  descriptor calls `togglePalette()` in both states.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Chart notes, palette dialog, filters, importmap, and registration |
| [`command_palette_controller.js`](command_palette_controller.js) | Global Ctrl/Meta+K, listbox arrows, Enter, Escape |

**Try it**

Click in the chart notes and press Ctrl+K: the palette opens on top of
the note. Type `lab` to leave "New lab order", press Arrow Down if you
need to, then Enter. Open it again, press End, then Escape to close
without running anything.
