# Action options · 11 · Metro fare FAQ

Harbor Metro's fare guide. Adult, youth, and reduced-fare topics are
`<details>` elements. Opening one should announce the open; closing it
should announce the close. A custom `:open` option is what routes those
two actions.

**What it teaches**

- `application.registerActionOption("open", callback)` registers a filter
  the same way `:self` is registered. `:open` and `:!open` both call that
  filter; the `!` only flips the `value` argument.
- The callback receives `{ name, value, event, element, controller }`:
  - `name` is `"open"`
  - `value` is `true` for `:open` and `false` for `:!open`
  - `event` is the ActionEvent, including `event.params` from
    `data-fare-guide-topic-param`
  - `element` is the `<details>` that declared the action
  - `controller` is the `fare-guide` instance
- Returning `false` blocks the action. Stimulus assigns
  `passes = passes && callback(...)`, so returning `undefined` also
  blocks. This callback returns `true` only when
  `event.target.open === value`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Fare topics, payload log, `registerActionOption("open")` |
| [`fare_guide_controller.js`](fare_guide_controller.js) | Records the callback payload and announces open / close |

**Try it**

Open "Youth fares". The option log shows two lines for that toggle (value
true and value false); only `opened youth-fares` appears under actions
that ran. The true line includes `element=youth-fares`,
`controller=fare-guide`, and `topic=youth`. Close the same topic: the
action log gains `closed youth-fares`.
