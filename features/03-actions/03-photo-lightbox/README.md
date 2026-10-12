# Actions · 03 · Photo lightbox

The Tidewater Camera Club's spring exhibition. Each thumbnail opens the
photo in a lightbox that fits the window, steps through the set with the
arrow buttons or keys, and closes from the close button, the Escape key, or
a click on the dark backdrop.

**What it teaches**

- Three different elements are in play when an action runs:

  | Expression | In `open()` | In `closeFromBackdrop()` |
  | --- | --- | --- |
  | `event.target` | The `<img>` or caption span you clicked | The backdrop, the photo, or a button's icon |
  | `event.currentTarget` | The thumbnail `<button>` with the `data-action` | Always the overlay |
  | `this.element` | The gallery `<section>` | The gallery `<section>` |

- `open()` reads the thumbnail button from `event.currentTarget`. Reading
  `event.target` would give the `<img>` most of the time and the button
  only when the click lands on its padding.
- Comparing `event.target` with `event.currentTarget` tells a click on the
  backdrop from a click on what sits in front of it. The overlay closes only
  when they match.
- `keydown@document->photo-lightbox#navigateWithKeys` and
  `resize@window->photo-lightbox#fitPhoto` are declared on the gallery
  element. Stimulus adds the listeners when the controller connects and
  removes them when it disconnects. Both run while the lightbox is closed,
  so both check `isOpen` first. Inside them, `event.currentTarget` is the
  document or the window.
- Focus goes back to the thumbnail that opened the lightbox, saved from
  `event.currentTarget` when it opened.

[Keyboard filters](../../04-keyboard-filters/) could split the key handling
into `keydown.left`, `keydown.right`, and `keydown.esc` descriptors. One
method reading `event.key` keeps the "only while open" check in one place.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Exhibition markup, overlay, global actions, importmap, and controller registration |
| [`photo_lightbox_controller.js`](photo_lightbox_controller.js) | Opens, steps through, fits, and closes the lightbox |
| [`photos/`](photos/heron-at-first-light.svg) | The six exhibition photos |

**Try it**

Click the middle of a thumbnail's image, then its caption: both open the
right photo. Press the right arrow key to step through the set and Escape
to close. Reopen, click the photo itself (nothing happens), then the dark
area around it (the lightbox closes). Open the panorama and resize the
window: the "Shown at" percentage follows the window.
