# Keyboard filters · 09 · Kitchen expo menubar

Hearth & Rye's expo screen. Recall, Bump, Rush, and Print are a menubar
over the rail. Arrows, Home, End, Enter, Space, and Escape move through
it; Alt+R / Alt+B / Alt+U / Alt+P open a menu from anywhere on the board.

**What it teaches**

- A menubar's keyboard map, declared as filters. Left and right move
  between the menus. Down / Enter / Space open the focused menu; up opens
  on the last item. Home / End jump to the first or last item (or menu).
  Escape closes.
- `keydown.alt+r@window` and the other mnemonics compare `event.key`, so
  on macOS Option+R may produce a different character and miss the filter.
- `keydown@window->kitchen-menubar#openFromCode` matches `event.code`
  (`KeyR`) instead, which stays stable when Option rewrites `event.key`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Menubar, tickets, filters, importmap, and registration |
| [`kitchen_menubar_controller.js`](kitchen_menubar_controller.js) | Menubar navigation, Alt mnemonics, and the `event.code` fallback |

**Try it**

Tab to Recall, press Down, then Down again, then Enter to recall the 86
list for the selected ticket. Press Right while a menu is open to switch
to Bump. Press Escape to close. Alt+U should open Rush; if this is a Mac
and Option+U types a character instead, the `event.code` fallback still
opens it.
