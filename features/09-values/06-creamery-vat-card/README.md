# Values · 06 · Creamery vat card

Morning make at the Tillamook creamery. Three cards describe the same
unfilled Jersey vat: defaults in the `{ type, default }` form, bare
types, and literal defaults.

**What it teaches**

- `{ type: String, default: "Jersey" }`, `{ type: Number, default: 86 }`,
  `{ type: Array, default: ["mesophilic"] }`, and
  `{ type: Boolean, default: false }` return those defaults when the
  attribute is missing. `hasBreedValue`, `hasTemperatureValue`,
  `hasCulturesValue`, and `hasFlaggedValue` are all true. The
  attributes stay absent until something assigns a value. See
  [`has[Name]Value` stays true when the definition is an object or a literal](../../../DISCOVERIES.md#hasnamevalue-stays-true-when-the-definition-is-an-object-or-a-literal).
- `spareDegrees: { type: Number }` has no `default` key. The value is
  still `0`, and `hasSpareDegreesValue` is true anyway. On the plain
  vat, `spareDegrees: Number` is `0` and `hasSpareDegreesValue` is
  false.
- A literal such as `breed: "Jersey"` or `flagged: false` is a default
  too. The shorthand card's flag is false and `hasFlaggedValue` is
  true, with no attribute.
- Assigning `temperatureValue = 88` writes `88`. Assigning a new
  cultures array writes its JSON.
- `{ type: Number, default: "12" }` throws when that controller is
  registered: `The specified default value for the Stimulus Value
  "temperature" must match the defined type "number".` The identifier
  is not in the message. The other cards stay registered. See
  [A mismatched default throws when the controller is registered](../../../DISCOVERIES.md#a-mismatched-default-throws-when-the-controller-is-registered).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Three vat cards, importmap, and registration |
| [`vat_card_controller.js`](vat_card_controller.js) | `{ type, default }`, and `{ type }` with no default |
| [`plain_vat_controller.js`](plain_vat_controller.js) | Bare types |
| [`shorthand_vat_controller.js`](shorthand_vat_controller.js) | Literal defaults |
| [`mismatched_vat_controller.js`](mismatched_vat_controller.js) | A Number default that is a string |

**Try it**

The morning vat opens "Breed Jersey. hasBreedValue true. Breed
attribute absent. Temperature 86. hasTemperatureValue true. Spare
degrees 0. hasSpareDegreesValue true. Spare degrees attribute absent.
Cultures [\"mesophilic\"]. hasCulturesValue true. Flagged false.
hasFlaggedValue true. Flagged attribute absent." The plain vat opens
"Breed \"\". hasBreedValue false", "Temperature
0. hasTemperatureValue false", "hasSpareDegreesValue false",
"Cultures []. hasCulturesValue false", and "Flagged false.
hasFlaggedValue false." The shorthand vat matches the morning defaults,
including "Flagged false. hasFlaggedValue true. Flagged attribute
absent." Warm the morning vat. Temperature becomes "88" and the
attribute is `88`. Add thermophilic. The cultures attribute is
`["mesophilic","thermophilic"]`. File the mismatched card. The notice
is the error naming `"temperature"` and the string `"12"`.
