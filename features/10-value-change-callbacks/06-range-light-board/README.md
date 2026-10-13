# Value change callbacks · 06 · New Dungeness range

Front and rear lights on the New Dungeness range, a lamp chalked at
zero, and a blank slip.

**What it teaches**

- `colorValue = undefined` removes the attribute and runs the callback
  with the string default. The front light goes from `"white"` to `""`,
  previous `"white"`, attribute absent, `hasColorValue` false.
- Dimming intensity 4 runs `(0, 4)`. The attribute is absent. That is
  the fallback the reference describes, seen from the callback.
- Clearing a chalked `0` runs `(0, 0)`. The arguments match, and the
  attribute is still gone. See
  [An empty previous value skips the reader, and removing an empty attribute does not fire](../../../DISCOVERIES.md#an-empty-previous-value-skips-the-reader-and-removing-an-empty-attribute-does-not-fire).
- The blank slip's name is `""` and its lit cell is `""`. The first lit
  callback is `(true, false)` because an empty boolean attribute is
  true. Erasing either cell removes `""`. Neither callback runs. The
  board still says the lamp is lit, and the getter reads false.
- Scraping the rear color with `removeAttribute` is the same callback
  as assigning `undefined`. The ask line is recorded first, then
  `Color "", previous "red"`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Four lamps |
| [`front_range_controller.js`](front_range_controller.js) | Clears color and intensity with `undefined` |
| [`zero_lamp_controller.js`](zero_lamp_controller.js) | Clears a chalked zero |
| [`blank_slip_controller.js`](blank_slip_controller.js) | Empty cells that stay quiet when removed |
| [`rear_range_controller.js`](rear_range_controller.js) | `removeAttribute` |

**Try it**

The front range log opens with color `"white"`, previous `""`, attribute
`"white"`, then intensity 4, previous 0, attribute `"4"`. Take the color
off. The next line is `Color "", previous "white". Attribute absent.
hasColorValue false.` Dim to nothing. `Intensity 0, previous 4.
Attribute absent. hasIntensityValue false.`

The zero lamp opens `Intensity 0, previous 0. Attribute "0".` Clear the
zero. The next line is `Intensity 0, previous 0. Attribute absent.
hasIntensityValue false.`

The blank slip opens `Name "", previous "". Attribute "".` and `Lit
true, previous false.` The lamp text becomes "The lamp is lit." Erase
the name and erase the lit cell. The log adds those two ask lines and
no Name or Lit callback. Read the lamp. The line is `Name getter "".
Lit getter false. Board says "The lamp is lit." Name lines 1. Lit lines
1.`

The rear range opens on red. Scrape the color. The log adds "Scraped
the color attribute." then `Color "", previous "red". Attribute absent.
hasColorValue false.`
