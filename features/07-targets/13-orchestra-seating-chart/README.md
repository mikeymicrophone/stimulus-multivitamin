# Targets · 13 · Orchestra seating chart

Harbor Symphony, evening of 14 November, Respighi's Pines of Rome.
The orchestra and the brass quintet on the lip of the stage are both
seating charts. The concert program shares the piece-title element
with the orchestra.

**What it teaches**

- `chair` and `principal` are two tokens. Helena and Ellen are in both
  lists. `principalTarget` is Helena, the first principal in the
  document, not every principal and not the first chair of the filtered
  section.
- The brass quintet is a nested `seating-chart`. Otto and June are on
  its chart and not on the orchestra's. Showing winds filters the
  orchestra's `chairTargets` in document order (Priya, then Ellen) and
  leaves the quintet alone.
- The open chair lives in a template, the bench blueprint. It counts as
  a blueprint chair and not as a player until "Seat this substitute"
  clones it. Samir then appears at the end of the orchestra's list, in
  the same turn.
- Moving Marco earlier changes document order. The next read lists him
  first. Helena is still the first principal, because Marco is not one.
- `hasIntermissionTarget` is true for the orchestra and false for the
  quintet, which has no intermission element. `soloTarget` throws
  `Missing target element "solo" for "seating-chart" controller`.
- The piece title carries a target attribute for each controller.
  Revising it in the program changes the heading the seating chart reads.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Orchestra, quintet, blueprint, importmap, and registration |
| [`seating_chart_controller.js`](seating_chart_controller.js) | Chairs, principals, the blueprint, the filter, and the missing solo |
| [`concert_program_controller.js`](concert_program_controller.js) | Revises the shared piece title |

**Try it**

The orchestra status names Helena, Marco, Priya, and Ellen, principals
Helena and Ellen, first principal Helena, the intermission, and one
blueprint chair not seated. The quintet names Otto and June, first
principal June, no intermission, and no piece title. Show winds: Priya
Nair, Ellen Brooks. Read the orchestra again and the full list returns.
Move Marco earlier: he leads the players, and Helena is still first
principal. Revise the piece title, then read the orchestra: both the
program note and the chart say "Pines of Rome, revised bowings". Seat
the substitute. Samir Adeyemi is last, and the blueprint still holds
one unseated chair. Read the solo part: the missing-target error.
