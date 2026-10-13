# Targets · 12 · Trail work crew

Cascade Trail day, with a saw crew nested inside it. Both are
`work-crew` controllers. Mina, Owen, and Lila start on the trail day.
Chris starts on the saw.

**What it teaches**

- Each crew's `volunteerTargets` stops at the nested crew. On load the
  trail day is Mina, Owen, Lila. The saw crew is Chris. Chris is not on
  the trail day's roll.
- Moving Lila earlier changes document order, and the next read follows
  it: Mina, Lila, Owen.
- Sending Owen to the saw crew moves his element into the nested
  controller. The trail day's next read, in that same method, is Mina,
  Lila. The outer controller stays connected. Reading the saw crew after
  that shows Chris, Owen. Scope is evaluated at read time, not cached
  with the controller.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Trail day, nested saw crew, importmap, and registration |
| [`work_crew_controller.js`](work_crew_controller.js) | Reads the roll, reorders a volunteer, and moves Owen |

**Try it**

The trail day status starts "Mina, Owen, Lila" and the saw crew starts
"Chris". Move Lila earlier. The trail day becomes Mina, Lila, Owen.
Send Owen to the saw crew. The trail day becomes Mina, Lila. Read the
saw crew: Chris, Owen.
