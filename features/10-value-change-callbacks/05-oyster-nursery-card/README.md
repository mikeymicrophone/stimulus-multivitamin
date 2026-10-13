# Value change callbacks · 05 · Totten Inlet nursery

Pacific oyster seed at the Totten Inlet nursery, a hatchery fax that is
not JSON, and a seed tally that sits after the fax.

**What it teaches**

- `variety`, `salinity`, `circulating`, `trays`, `reading`, and `lot`
  each run a changed callback on connect. Trays previous is `[]`.
  Reading previous is `{}`. Neither is the same reference as the new
  value. See
  [The callback array or object is a new parse](../../../DISCOVERIES.md#the-callback-array-or-object-is-a-new-parse).
- Dropping cultch pushes on the array the getter returned. The callback
  does not run, and the next read is still seed, spat. Writing the trays
  assigns a new array and the callback runs.
- Scribbling the bay mutates the object the getter returned. Filing the
  same depth and bay assigns JSON that matches the attribute, so no
  callback runs. Filing bay B does.
- Lot is the attribute `08`. The first callback is `(8, 0)`. Rewriting
  the lot assigns `8`, the attribute becomes `8`, and the callback runs
  with `(8, 8)`.
- The fax makes the observer parse before `menuValueChanged`. The body
  never runs, `connect()` never runs, and the seed tally after the fax
  never connects. The failure is a `SyntaxError` whose text is
  `JSON.parse`'s, and `handleError` is not called. See
  [A throw from a value callback skips the rest of the connect scan](../../../DISCOVERIES.md#a-throw-from-a-value-callback-skips-the-rest-of-the-connect-scan).
- Filing `["bay"]` into the reading throws `TypeError: Stimulus Value
  "nursery-card.readingValue" - expected value of type "object"...`.
  Filing bay B after that still paints. The observer is still listening.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The flupsy line, the fax, the tally, and the fault lines |
| [`nursery_card_controller.js`](nursery_card_controller.js) | Every value type, the pushes, and the lot rewrite |
| [`hatchery_fax_controller.js`](hatchery_fax_controller.js) | The comma list |
| [`seed_tally_controller.js`](seed_tally_controller.js) | The card after the fax |

**Try it**

The summary opens "Pacific, salinity 28, circulating true, trays seed,
spat, bay A, lot 8." The log starts "Variety "Pacific", previous ""."
then salinity 28 previous 0, circulating true previous false, trays
`["seed","spat"]` previous `[]` with "Same list false", reading
`{"depth_cm":12,"bay":"A"}` previous `{}` with "Same note false", and
"Lot 8, previous 0."

Drop cultch. The log adds "Pushed cultch. Returned list seed, spat,
cultch. Card reads seed, spat." and no trays line. Write cultch. The
log adds trays `["seed","spat","cultch"]`, previous `["seed","spat"]`.

Scribble the bay. The log adds "Scribbled bay B. Card still reads A."
File the same reading. The log adds only "Filed the same reading."
File bay B. The log adds the reading with bay B.

Rewrite the lot. The log adds "Rewrote the lot." then "Lot 8, previous
8." The attribute is `8`.

The fax stays "The fax has not connected." The tally stays "The tally
has not opened." The fault line is `SyntaxError: Unexpected token 'c',
"chowder, pilot bread" is not valid JSON`. The handled line stays
"Nothing was passed to handleError."

File a list as the reading. The fault line becomes `TypeError: Stimulus
Value "nursery-card.readingValue" - expected value of type "object" but
instead got value "["bay"]" of type "array"`. File bay B again. The
summary ends in "bay B" and the log gains another reading line.
