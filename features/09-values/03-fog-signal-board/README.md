# Values · 03 · Fog signal board

Morning fog off the Strait of Juan de Fuca. Point Wilson, Ediz Hook,
Marrowstone, Dungeness, Smith Island, and Protection Island each phoned
a horn status in a different hand.

**What it teaches**

- `sounding` and `manned` are `Boolean` values. The reader is false
  only for `"0"` and for any case of `"false"`. `"FALSE"` is false.
  `"00"`, `"no"`, `"off"`, `"1"`, a trailing space on `"false "`, and
  an empty attribute are true.
- A missing attribute is the default `false`, and `hasSoundingValue`
  is false. Dungeness's blank cell is present, so `hasSoundingValue`
  is true and the horn reads as sounding. See
  [An empty Boolean attribute is true](../../../DISCOVERIES.md#an-empty-boolean-attribute-is-true).
- `this.soundingValue = false` writes the attribute `"false"`.
  `this.soundingValue = true` writes `"true"`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Six station slips, importmap, and registration |
| [`signal_horn_controller.js`](signal_horn_controller.js) | Reads each slip and sounds or silences the horn |

**Try it**

Point Wilson opens "sounding false" with attribute `"false"`. Ediz Hook
is "sounding false" from `"0"` and "Manned true" from `"00"`.
Marrowstone is "sounding false" from `"FALSE"` and "Manned true" from
`"no"`. Dungeness is "sounding true" with attribute `""` and
`hasSoundingValue true`. Smith Island is "sounding false", "Sounding
attribute absent", `hasSoundingValue false`, and "Manned true" from
`"1"`. Protection Island is "sounding true" from `"false "` and
"Manned true" from `"off"`. Silence Dungeness. The reading becomes
"sounding false. Sounding attribute \"false\". hasSoundingValue true."
