# Values · 07 · Assay office slips

The Dahlonega assay office is transcribing a morning's weight slips,
mint marks, and findings.

**What it teaches**

- A `Number` value strips underscores, then calls `Number`. `"1_000"`
  is `1000` and the attribute stays `1_000`. `" 14.5 "` is `14.5`.
  `"2e1"` is `20`. `"1,200"` and `"12dwt"` are `NaN`, and
  `hasPennyweightsValue` is still true.
- An empty attribute is present. The blank slip is `0` with
  `hasPennyweightsValue` true. The missing slip is `0` with
  `hasPennyweightsValue` false.
- `9007199254740993` is past `Number.MAX_SAFE_INTEGER`. The value is
  `9007199254740992`. The attribute still holds every digit, because
  reading does not write it back.
- `marks` is an `Array`. `eagle,shield` throws `SyntaxError` on read.
  `{"mint":"Dahlonega"}` throws `TypeError` of type `"object"`. A real
  JSON list transcribes. See
  [Array and Object values reject the other shape](../../../DISCOVERIES.md#array-and-object-values-reject-the-other-shape).
- `finding` is an `Object`. `{fine:900}` throws `SyntaxError`. `null`
  throws `TypeError` and the message says type `"undefined"`. A JSON
  array throws type `"array"`. Keys on the good card stay `fine` and
  `mint`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Weight slips, mark lists, findings, importmap, and registration |
| [`weight_slip_controller.js`](weight_slip_controller.js) | Number parsing |
| [`mark_list_controller.js`](mark_list_controller.js) | Array JSON and the two rejects |
| [`finding_card_controller.js`](finding_card_controller.js) | Object JSON and the three rejects |

**Try it**

The underscore slip reads "pennyweights 1000" with attribute `"1_000"`.
The comma slip and the unit slip read "pennyweights NaN". The spaced
slip reads "pennyweights 14.5" with attribute `" 14.5 "`. The blank
slip reads "pennyweights 0" with attribute `""` and
`hasPennyweightsValue true`. The missing slip reads "Attribute absent.
hasPennyweightsValue false." The balance slip reads "pennyweights 20"
with attribute `"2e1"`. The certificate slip reads "pennyweights
9007199254740992" with attribute `"9007199254740993"`. Transcribe the
eagle list: "marks eagle, shield." Transcribe the comma list: a
`SyntaxError` naming `eagle,shield`. Transcribe the object list: a
`TypeError` of type `"object"`. Transcribe the Dahlonega finding:
`{"fine":900,"mint":"Dahlonega"}`, fine 900, mint Dahlonega. The
unquoted finding is a `SyntaxError`. The null finding is a `TypeError`
of type `"undefined"`. The list finding is a `TypeError` of type
`"array"`.
