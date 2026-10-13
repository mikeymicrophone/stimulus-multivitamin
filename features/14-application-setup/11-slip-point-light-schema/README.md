# Application setup and registration · 11 · Slip Point light schema

Slip Point runs on a renamed schema. The practice board
keeps Stimulus's attribute names and throws away the default
key map.

**What it teaches**

- Pass a schema as the second argument of
  `Application.start(element, schema)`. Spread
  `defaultSchema` and replace the fields you mean to change.
- `controllerAttribute`, `actionAttribute`, and
  `targetAttributeForScope` are what the router, the action
  binder, and the target getters use. A `data-controller`
  lamp inside this root stays dark.
- `keydown.horn` matches `event.key` `"F8"` because
  `keyMappings.horn` is `"F8"`. Spreading
  `defaultSchema.keyMappings` keeps `enter`.
- Target connected callbacks do not read the schema. They
  always watch `data-${identifier}-target`. The wick token
  on that attribute fires `wickTargetConnected`. The reading
  target, on the renamed attribute, does not fire
  `readingTargetConnected`. The getter still finds it.
- Replacing `keyMappings` with `{ horn: "F8" }` makes
  `keydown.enter` throw `Error: contains unknown key filter:
  enter`. The throw leaves the event listener. It is not
  passed to `handleError`. The horn action is token 0, so
  F8 still runs `soundHorn` before the enter action throws.
  Enter does not run `fileEnter`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Both schemas and the key inputs |
| [`keeper_lamp_controller.js`](keeper_lamp_controller.js) | Renamed attributes, wick callback |
| [`bare_lamp_controller.js`](bare_lamp_controller.js) | Horn-only key map |

**Try it**

The callback tape reads "wick callback." The keeper lamp
reads "Lamp is burning." The plain paragraph stays "Plain
attribute stays dark." Sound the horn. The lamp reads "Horn
sounded." Press F8 on the keeper key. It reads "Horn F8."
Press Enter. It reads "Enter filed."

The bare lamp reads "Bare lamp is burning." The key error
reads "No key error yet." Sound the bare horn. It reads
"Bare horn sounded." Press F8 on the bare key. It reads
"Bare horn F8." The key error contains "contains unknown key
filter: enter". Press Enter. The lamp does not read "Bare
enter filed."
