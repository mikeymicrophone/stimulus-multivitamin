# Actions · 09 · Menu that closes on outside click

The toolbar above a team's issue list in Tallyboard, a bug tracker. "Sort",
"Assignee", and "More" are `dropdown-menu` controllers, and "More" holds an
"Export" submenu that is another `dropdown-menu`. Every menu closes on a
click outside it, on Escape, and when focus moves away. The `issue-list`
controller does what the items say.

**What it teaches**

- `click@document->dropdown-menu#closeIfOutside` closes a menu when a click
  lands anywhere outside it. Opening one menu closes any other open menu for
  free, because to that menu the click is outside.
- One click runs actions in this order:
  1. actions on the clicked element, in `data-action` order;
  2. actions on its ancestors, innermost first;
  3. `@document` actions;
  4. `@window` actions.

  So `toggle()` has already opened the menu by the time `closeIfOutside()`
  runs for the same click, and sees the click was inside.
- Don't stop propagation in a toggle. `event.stopPropagation()` in `toggle()`
  would keep the click from reaching `document`, and the other open menus
  would never hear it.
- Menu items call two controllers in a deliberate order:
  `issue-list#sortIssues dropdown-menu#closeMenuTree`. The list changes, then
  the menus close and focus returns to the toolbar button.
- A submenu's opener ("Export ▸") is an item of the outer menu, outside the
  submenu's element, so it calls the outer menu's `openSubmenu()`, which
  opens the submenu controller directly. The opener's click then reaches the
  submenu's own `click@document` action, so the submenu counts its opener as
  inside.

**Stimulus behavior worth knowing**

- A controller's actions skip events that start inside a nested element
  with the same identifier. That includes `@document` and `@window` actions,
  and actions on the controller's own element. Stimulus treats the nested
  element as someone else's scope. Here that is exactly right: Escape
  pressed inside "Export" reaches only the submenu, so each Escape closes
  one level. Focus moving into the submenu never reaches the outer menu's
  `focusin@document` action, so the outer menu stays open. A click inside
  the submenu isn't seen by the outer menu at all, which is why choosing an
  export format closes the tree through `closeMenuTree()` instead.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Toolbar, menus, and issue list markup, importmap, and controller registration |
| [`dropdown_menu_controller.js`](dropdown_menu_controller.js) | Opens, closes, and nests menus; closes on outside clicks, focus leaving, and Escape |
| [`issue_list_controller.js`](issue_list_controller.js) | Sorts, filters, exports, and archives issues |

**Try it**

Open "Sort", then click "Assignee": the first menu closes as the second
opens. Filter to Priya's issues. Open "More", then "Export": both stay open
while focus moves into the submenu. Press Escape twice and watch the menus
close one level at a time. Open them again and pick "PDF report": everything
closes and the export starts. Open a menu and click the page heading, or
Tab out of it: it closes.
