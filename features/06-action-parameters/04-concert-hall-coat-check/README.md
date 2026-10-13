# Action parameters · 04 · Concert hall coat check

Riverhouse Hall's coat check. Each claim button passes a ticket code as an
action param, and the desk compares it with the printed tag.

**What it teaches**

- A bare digit string is valid JSON, so `482917` arrives as the number
  `482917` and is not `===` to the printed tag `"482917"`.
- A leading zero is not valid JSON, so `01482` stays the string `"01482"`
  and matches. `Number("01482")` would have dropped the zero; params do not.
  See [Action params turn all-digit strings into numbers](../../../DISCOVERIES.md#action-params-turn-all-digit-strings-into-numbers).
- Wrapping the attribute in JSON quotes (`'"482917"'`) forces a string, and
  the tag matches.
- `9007199254740993` parses as a number and is rounded to
  `9007199254740992`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Claim buttons, importmap, and controller registration |
| [`coat_check_controller.js`](coat_check_controller.js) | Compares the cast param with the printed tag |

**Try it**

Claim tag 01482: it arrives as a string and matches. Claim tag 482917: it
arrives as a number and does not match. Claim the quoted copy of 482917:
the quote characters force a string and it matches. Claim the harp token:
the last digit has been rounded.
