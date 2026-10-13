# Dispatching custom events · 07 · Lime Kiln keeper slate

The slate at Lime Kiln is a namespaced controller. The
watch book listens locally, on the document, and on the
window. The lens cabinet uses a multi-word identifier.

**What it teaches**

- `keeper--slate` dispatching `"signed"` fires
  `keeper--slate:signed`. The double hyphen stays in the
  event name. `keeper-slate:signed` is a different string
  and the decoy action stays at zero.
- The same element can listen with no global target, with
  `@document`, and with `@window`. For one bubbling event
  the order is the element, then document, then window.
- `event.params.station` is the book's
  `data-watch-book-station-param`. `event.detail.keeper`
  is the slate's payload. They sit side by side.
- `lens-cabinet` dispatching `"rotated"` fires
  `lens-cabinet:rotated`. `"watch-relieved"` on the slate
  fires `keeper--slate:watch-relieved`, heard at window.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Book, slate, and cabinet |
| [`keeper_slate_controller.js`](keeper_slate_controller.js) | Registered as `keeper--slate` |
| [`lens_cabinet_controller.js`](lens_cabinet_controller.js) | Registered as `lens-cabinet` |
| [`watch_book_controller.js`](watch_book_controller.js) | The listeners, including the one-hyphen decoy |

**Try it**

The book opens "Book is open. Wrong hyphen 0." The slate
says "Slate is blank." The cabinet says "Lens is at first
order." Sign the forenoon watch. The slate says
"Dispatched keeper--slate:signed." The book says "local
keeper--slate:signed keeper Mara station Lime Kiln.
document keeper--slate:signed. window keeper--slate:signed.
Wrong hyphen 0." Relieve the watch. The slate says
"Dispatched keeper--slate:watch-relieved." The book adds
"window keeper--slate:watch-relieved keeper Mara." Rotate
the lens. The cabinet says "Dispatched lens-cabinet:rotated."
The book adds "local lens-cabinet:rotated order 2." Wrong
hyphen stays 0.
