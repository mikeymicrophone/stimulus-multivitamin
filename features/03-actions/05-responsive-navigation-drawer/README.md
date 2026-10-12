# Actions · 05 · Responsive navigation drawer

Fernhill Hardware's department menu. On a wide screen it is a sidebar; on a
narrow one it slides out from the menu button in the header. The store's
promo strip, which a marketing tool drops in above the page shell, links to
it as well.

**What it teaches**

- An action only reaches a controller whose element contains the action's
  element. The menu button is in the header and the drawer is in the body,
  so `navigation-drawer` goes on the page shell that holds both. The
  footer's "All departments" button is inside it too and calls
  `navigation-drawer#open` directly.
- Markup outside the controller's element can't call it. The promo strip is
  above the shell. A `data-action="navigation-drawer#open"` there would do
  nothing, and no message would say why.
- A global event can carry the request instead. The promo is an ordinary
  `<a href="#departments">`, and the shell declares
  `hashchange@window->navigation-drawer#openForHash`. The promo needs no
  Stimulus at all, and the same link works when someone shares
  `…/#departments`, because `connect()` checks the hash too.
- `@window` and `@document` are the only global targets a descriptor can
  name. A `MediaQueryList` change can't be declared, so
  `resize@window->navigation-drawer#adaptToWidth` reads `matchMedia()` and
  acts only when the layout actually flips.
- Department links call `navigation-drawer#chooseDepartment` and don't call
  `preventDefault()`, so the link still navigates while the drawer closes.

**Stimulus behavior worth knowing**

- Writing any other target after `@` doesn't fail loudly.
  `change@matchMedia->…` or `resize@visualViewport->…` doesn't match the
  `@window|@document` part of the descriptor syntax, so the whole string
  before `->` becomes the event name. Stimulus listens on the element for an
  event literally named `resize@visualViewport`, which never fires.
- Setting `location.hash` to the value it already has fires no
  `hashchange`. After the drawer answers `#departments`, it removes the hash
  with `history.replaceState()` so the promo link works a second time.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Store markup, the promo outside the controller, global actions, importmap, and controller registration |
| [`navigation_drawer_controller.js`](navigation_drawer_controller.js) | Opens, closes, and adapts the drawer; answers the promo's hash |

**Try it**

Make the window narrow. Open the drawer from the header, then press Escape.
Press "Browse departments" in the green promo strip: the drawer opens even
though the promo is outside the controller. Close it by clicking the dark
scrim and use the promo again. Choose "Plumbing": the page jumps there and
the drawer closes. Open the drawer and widen the window: it becomes the
sidebar.
