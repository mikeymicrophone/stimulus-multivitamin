# Values · 10 · Cooperage hoop log

A red-oak barrel at the Port Townsend cooperage. Six hoops, flagged
for the harbor chandlery.

**What it teaches**

- `hoopCount` is a `Number`, `woodName` is a `String`, and `flagged`
  is a `Boolean`. The opening reading shows each value beside the
  attribute it came from.
- The setter writes the attribute before the method continues.
  `hoopCountValue = 0` writes `"0"`. `hasHoopCountValue` stays true.
  The default `0` does not mean "remove the attribute."
- Assigning `undefined` deletes the attribute. The hoop count then
  reads `0` with `hasHoopCountValue` false. Clearing the wood name
  reads `""` with `hasWoodNameValue` false.
- `woodNameValue = null` is not a delete. The attribute becomes the
  characters `null`, and the getter returns the string `"null"`.
- `flaggedValue = false` writes `"false"`. The attribute stays, and
  `hasFlaggedValue` stays true.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The red-oak barrel, importmap, and registration |
| [`hoop_log_controller.js`](hoop_log_controller.js) | Zero, clear, null, and lower the flag |

**Try it**

The barrel opens "Hoops 6. hasHoopCountValue true. Hoops attribute
\"6\". Wood \"red oak\". hasWoodNameValue true. Wood attribute \"red
oak\". Flagged true. hasFlaggedValue true. Flagged attribute
\"true\"." Set the hoop count to zero. It reads "Hoops 0.
hasHoopCountValue true. Hoops attribute \"0\"." Clear the hoop count.
It reads "Hoops 0. hasHoopCountValue false. Hoops attribute absent."
Clear the wood name. It reads `Wood "". hasWoodNameValue false. Wood
attribute absent.` Write a null wood name. It reads `Wood "null".
hasWoodNameValue true. Wood attribute "null".` Lower the flag. It
reads "Flagged false. hasFlaggedValue true. Flagged attribute
\"false\"."
