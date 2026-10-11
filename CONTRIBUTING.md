# Contributing to Stimulus Multivitamin

Every scenario in this catalog follows the same conventions. The reference
scenario, [Controllers · 01 · Invoice line-item editor](features/01-controllers/01-invoice-line-items/),
follows all of them; copy its shape when you add a new one.

## The rules

### 1. Real names, always

This rule is not negotiable. Every controller, target, value, class, outlet,
action, method, parameter, event, variable, CSS class, file, and folder gets a
name that means something in the scenario's domain.

Never use `foo`, `bar`, `baz`, `qux`, `hello`, `helloWorld`, `example`,
`demo`, `test`, `thing`, `item1`, `myController`, `someValue`, `data`, `x`,
or similar stand-ins. If you are tempted to write one, the scenario is not
concrete enough yet.

| Instead of | Write |
| --- | --- |
| `data-controller="my-controller"` | `data-controller="seat-picker"` |
| `static targets = ["output"]` | `static targets = ["remainingSeats"]` |
| `static values = { count: Number }` | `static values = { servings: Number }` |
| `handleClick(event)` | `reserveSeat(event)` |
| `const result = a * b` | `const subtotalInCents = quantity * unitPriceInCents` |

Content counts too: use believable sample data (a bakery's invoice, a
theater's row letters), not lorem ipsum.

### 2. One believable scenario per scenario folder

Each folder is one real-world interface: an invoice line-item editor, a seat
picker, a recipe scaler. Pick a scenario where the feature is the natural
tool, not one bent to fit it. Within a feature, the thirteen scenarios should
each show the feature in a different shape rather than repeat one pattern.

### 3. Moderately complex to complex

Skip what the official docs already cover. A scenario should have enough
moving parts to show the feature under realistic pressure: several targets,
state that changes over time, interplay between controllers, edge cases like
empty or invalid input. Order the thirteen slots roughly from moderate to
complex. Other Stimulus features may appear when a real interface would use
them, but the folder's feature must be the star.

### 4. A short comment header that says what it teaches

- `index.html` opens with an HTML comment: the feature, slot number, and
  scenario title, followed by a short "Teaches:" list.
- Each controller file opens with a block comment naming the file, the
  identifier it is registered under, and what that controller demonstrates.
- The scenario's `README.md` repeats the "What it teaches" list for readers
  browsing on GitHub, plus a table of files and a "Try it" paragraph.

Inside the code, comment only on constraints the code cannot show. Do not
narrate what the next line does.

### 5. Pinned to a current stable Stimulus 3.x

Every page loads the same pinned version through its importmap:

```html
<script type="importmap">
  {
    "imports": {
      "@hotwired/stimulus": "https://cdn.jsdelivr.net/npm/@hotwired/stimulus@3.2.2/dist/stimulus.js"
    }
  }
</script>
```

Never use an unpinned URL like `@hotwired/stimulus/dist/stimulus.js` or a
`@3` range. When a new stable 3.x release ships, bump every page in one
commit: update the version in each importmap, in the "Supplement Facts" of
`README.md` and `index.html`, and in this file.

## Scenario layout

```
features/01-controllers/
  README.md                       feature summary and the 13 slots
  02-restaurant-seat-picker/
    index.html                    comment header, importmap, registration, markup
    seat_picker_controller.js     one file per controller
    dining_room_controller.js
    README.md                     what it teaches, files, try it
```

- Folder names are two-digit slot numbers plus a kebab-case scenario name.
- Controller files are `snake_case_controller.js` and are registered under the
  matching kebab-case identifier (`line_item_controller.js` → `line-item`),
  the same convention Rails and stimulus-loading use.
- Register controllers in a `<script type="module">` in `index.html` with
  `Application.start()` and `application.register()`, unless the scenario is
  itself about application setup.
- No build step, no bundler, no `package.json`. Anything beyond Stimulus must
  load as a pinned ES module from a CDN through the same importmap.
- Link `../../../assets/multivitamin.css` for the shared look, but the
  scenario must still work if the stylesheet fails to load.
- Include a breadcrumb back to `index.html` and links to each controller file.

## Adding a scenario

1. Pick the next open slot in the feature's `README.md`. The planned titles
   are proposals; replace one if you have a better scenario.
2. Create the scenario folder following the layout above.
3. In the feature's `README.md`, link the slot, mark it "available", and
   update the "N of 13 bottled" count.
4. In the root `index.html`, link the slot, remove its `planned` class, and
   update that feature's "N of 13 bottled" count. Link to the scenario folder
   with a trailing slash (`features/01-controllers/01-invoice-line-items/`);
   relative imports inside the page depend on it.
5. Serve the repository root (`npx serve .` or `python3 -m http.server`),
   open the scenario, and check the browser console for errors.
