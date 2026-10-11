# Controllers · 11 · Classroom attendance roster

Ms. Abernathy takes attendance for three science periods in Room 214. Each
period's rows come from the server as an HTML fragment and get fresh
`student-attendance` controllers. The `attendance-roster` controller around
them stays on the page and remembers every mark in every period.

**What it teaches**

- Controllers come and go with their elements. Choosing a period replaces the
  table body with a fetched fragment, so every `student-attendance` instance
  disconnects and a new one connects for each new row. Turbo Frames and
  server-rendered partials cause the same churn.
- Instances are disposable, so state that has to survive goes on a controller
  whose element stays put. The roster keeps a map of marks per period, each
  row reports its mark as it changes, and each new row asks for its mark on
  connect.
- Switching back to a period builds new instances for new rows. They aren't
  the old instances revived; they look the same only because the roster
  gives their marks back.
- A long-lived controller can act on whichever child instances exist right
  now. "Mark everyone else present" and "Submit" reach the current rows
  through `application.getControllerForElementAndIdentifier()`, skipping
  rows whose controllers haven't connected yet.
- Fast switching can outrun the network, so the roster ignores a fragment
  that arrives after a newer period was chosen.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Roster markup, importmap, and controller registration |
| [`attendance_roster_controller.js`](attendance_roster_controller.js) | Long-lived; loads each period's rows and keeps every period's marks |
| [`student_attendance_controller.js`](student_attendance_controller.js) | One disposable instance per row; reports and restores its mark |
| [`periods/period-1.html`](periods/period-1.html), [`period-2.html`](periods/period-2.html), [`period-3.html`](periods/period-3.html) | Server-rendered roster rows |

**Try it**

Mark two Period 1 students absent and one tardy, switch to Period 3, then
switch back. Period 1's marks are still there, on brand-new controller
instances. Try submitting with students unmarked, use "Mark everyone else
present", then submit. Period 1 locks, while the other periods stay open.
