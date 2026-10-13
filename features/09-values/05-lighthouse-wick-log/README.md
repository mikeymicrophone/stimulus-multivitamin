# Values · 05 · Lighthouse wick log

First watch at Cape Disappointment. The lamp is a wick height and a
font of colza. Cape Flattery has not filed. The spare tin at Cape
Disappointment was written down as a list.

**What it teaches**

- `lamp` and `spareLamp` are `Object` values. JSON keys are not
  camelized. `wick_height` is the key that exists. `wickHeight` is
  absent.
- A missing object reads as `{}`, a new object on every read, and
  `hasLampValue` is false. Cape Flattery opens that way.
- Assigning `this.lampValue` writes compact JSON to
  `data-wick-log-lamp-value`.
- A JSON array is not an object. Reading `spareLampValue` throws
  `TypeError: expected value of type "object" but instead got value
  "[\"8mm wick\",\"trimming scissors\"]" of type "array"`. The page
  connects, because nothing reads the spare until the button. See
  [Array and Object values reject the other shape](../../../DISCOVERIES.md#array-and-object-values-reject-the-other-shape).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Both stations, importmap, and registration |
| [`wick_log_controller.js`](wick_log_controller.js) | Reads the lamp, trims the wick, and reports the spare |

**Try it**

Cape Disappointment opens "wick 12mm. Oil colza. wickHeight absent.
hasLampValue true." and the attribute is
`{"wick_height":"12mm","oil":"colza"}`. Trim the wick. The reading
becomes "wick 8mm" and the attribute is
`{"wick_height":"8mm","oil":"colza"}`. Read the spare tin. The line is
the TypeError naming type "array". Cape Flattery opens "wick (no wick).
Oil (no oil). hasLampValue false. Attribute absent." Reading its spare
says `Spare {}. Attribute absent.`
