# Value change callbacks · 13 · Admiralty Inlet board

The tide board at Bush Point on Admiralty Inlet. Station, height, horn,
watches, and the sounding note are the values. The stream, the staff,
the pilot call, the query string, and the mute flag are derived from
the callbacks.

**What it teaches**

- `initialize()` copies `station` from the query and `muted` from
  `localStorage` before the observer starts. The first callbacks see
  those restored values and write them back. See
  [Restore persisted state in initialize(), before the callback writes it](../../../DISCOVERIES.md#restore-persisted-state-in-initialize-before-the-callback-writes-it).
- `heightValueChanged` paints the staff and sets `stream` to flood at
  or above 6 feet, ebb below. It assigns only when the stream getter
  differs, so the two values do not chase. See
  [A value callback can schedule another](../../../DISCOVERIES.md#a-value-callback-can-schedule-another).
- The pilot call is debounced. Raising the staff twice in a row still
  places one new call, for the latest height.
- `noaa_correction.js` sets the height attribute. The height callback
  is the same one the board uses. Taking the height off assigns
  `undefined`. The callback runs with 0, the attribute is absent, and
  the stream goes to ebb.
- Pushing `middle` on the array the getter returned does not run
  `watchesValueChanged`. The board keeps morning, forenoon. Writing a
  new array runs the callback. See
  [The callback array or object is a new parse](../../../DISCOVERIES.md#the-callback-array-or-object-is-a-new-parse).
- The sounding note keeps `depth_ft`. The first height callback's
  previous value is 0 when the attribute is present.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The Bush Point board |
| [`inlet_board_controller.js`](inlet_board_controller.js) | Every callback on the board |
| [`noaa_correction.js`](noaa_correction.js) | The office write |

**Try it**

The board opens on Bush Point, staff "8 ft", "Stream flood.", "Horn
quiet.", watches "morning, forenoon", note "depth_ft 6, bottom gravel.",
and the log "Height 8, previous 0." The query is `?station=bush-point`.
After the delay the pilot line is "Call 1 placed at 8 ft."

Open `?station=nodule-point` with `admiralty-inlet-muted` set to
`true`. The heading and the select are Nodule Point. The board has the
class `calls-held`. The first pilot line is "Call 1 held at 8 ft."

Raise the staff. The log adds "Height 9, previous 8." The stream stays
flood. NOAA correction to 9 feet, after the raise, writes the same
number and adds no height line. Take the height off. The log adds
"Height 0, previous 9." The staff says "0 ft" and the stream says
"Stream ebb."

Push a middle watch. The scribble says the returned list includes
middle and the board still reads morning, forenoon. Write the middle
watch. The board reads "morning, forenoon, middle."

Toggle the horn. It says "Horn sounding." Mute the pilot call. The key
`admiralty-inlet-muted` is `true` and the board carries `calls-held`.
