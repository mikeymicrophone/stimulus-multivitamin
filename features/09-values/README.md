# Values

static values with Array, Boolean, Number, Object, and String types, defaults, has[Name]Value, and writing values back to data attributes.

Official reference: <https://stimulus.hotwired.dev/reference/values>

Change callbacks (`[name]ValueChanged`) are the next feature. These scenarios read and write values from actions and `connect()`.

## Examples (13 of 13 bottled)

01. [Maple sugar shack](01-maple-sugar-shack/) — available
02. [Cider press tally](02-cider-press-tally/) — available
03. [Fog signal board](03-fog-signal-board/) — available
04. [Seed vault tray](04-seed-vault-tray/) — available
05. [Lighthouse wick log](05-lighthouse-wick-log/) — available
06. [Creamery vat card](06-creamery-vat-card/) — available
07. [Assay office slips](07-assay-office-slips/) — available
08. [Apiary super stack](08-apiary-super-stack/) — available
09. [Sail loft bolt ticket](09-sail-loft-bolt-ticket/) — available
10. [Cooperage hoop log](10-cooperage-hoop-log/) — available
11. [Ridge kite log](11-ridge-kite-log/) — available
12. [Lock gauge house](12-lock-gauge-house/) — available
13. [Pilot boat mess slate](13-pilot-boat-mess-slate/) — available

## What each scenario adds

| Slot | Values technique |
| --- | --- |
| 01 | `String` values, kebab-case `data-[identifier]-[name]-value`, `has[Name]Value`, and a setter that writes the attribute |
| 02 | `Number` values, the missing default `0`, `"08"` parsing as `8`, and assignment rewriting the attribute |
| 03 | `Boolean` casting: `"false"`, `"FALSE"`, `"0"`, `""`, `"00"`, `"false "`, `"no"`, `"off"`, and a missing attribute |
| 04 | `Array` JSON, a `push` that does not write, and an assignment that does |
| 05 | `Object` JSON, keys left as written, a missing `{}`, and a JSON array rejected on read |
| 06 | `{ type, default }`, a bare `{ type }` with no default, literal defaults, and a mismatched default that throws at `register()` |
| 07 | Number parsing (`1_000`, commas, blanks, `2e1`, a too-long certificate) and invalid Array and Object JSON |
| 08 | One shared custom array default across hives, against a bare `Array` that is new on every read |
| 09 | Exact kebab-case lookup: HTML-lowercased camelCase misses, and underscores are not camelized |
| 10 | `undefined` deletes; `0`, `false`, and `null` are written |
| 11 | Inherited values, read through the subclass identifier |
| 12 | `gauge` + `houseZeroFeet` and `gauge-house` + `zeroFeet` share one attribute; the pool names do not |
| 13 | All five types, defaults, `has`, write-back, a leading-zero number beside a string code, and a bad radio menu |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
