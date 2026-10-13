# Action parameters · 03 · Trail kitchen batch card

Cedar Loop's field kitchen. A dinner preset passes ingredients and allergens
as JSON arrays and nutrition as a JSON object. The whiteboard copy is not
valid JSON, so it stays a string.

**What it teaches**

- A param whose text is a JSON array becomes an array. A JSON object
  becomes an object.
- Keys inside that object are left alone. `serve_count` does not become
  `serveCount`. Only the param attribute's own name is camelized.
- `{calories: 380}` is not JSON. `JSON.parse` throws, the param stays a
  string, and there is no calorie count to read.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Dinner presets, importmap, and controller registration |
| [`trail_kitchen_controller.js`](trail_kitchen_controller.js) | Renders the batch from the cast params |

**Try it**

Load chili night. The card lists kidney beans, tomato, and cumin, then
420 calories for 8, and the allergen gluten. Load the whiteboard stew.
The ingredients still list, the allergen list is empty, and the nutrition
line says it stayed a string.
