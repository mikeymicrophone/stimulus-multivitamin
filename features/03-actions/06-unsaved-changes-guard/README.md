# Actions · 06 · Unsaved-changes guard

Abena's volunteer profile at the Riverside Community Food Bank. The
`unsaved-changes` controller compares the form with the last save. It shows
an "Unsaved changes" badge, saves and discards, warns before a reload or a
closed tab, and asks before the dashboard links take her away from edits.

**What it teaches**

- Name action methods for what they do, not for the event that triggers
  them. Read together, the descriptors describe the feature:

  | Descriptor | Reads as |
  | --- | --- |
  | `input->unsaved-changes#trackChanges` | Typing tracks changes |
  | `submit->unsaved-changes#saveProfile` | Submitting saves the profile |
  | `reset->unsaved-changes#discardChanges` | Resetting discards changes |
  | `beforeunload@window->unsaved-changes#warnBeforeUnload` | Leaving the page warns first |
  | `unsaved-changes#confirmLeaving` (on links) | A link click confirms leaving |

  `handleInput`, `onSubmit`, or `clicked` would only restate the event, and
  stop making sense once a second event calls the same method (here both
  `input` and `change` call `trackChanges`).
- One action on the form covers every field. `input` and `change` bubble,
  so emergency contacts added from the `<template>` after the page loaded
  are tracked without any wiring of their own.
- A `<form>`'s default event is `submit`, so `reset` has to be named. The
  reset action calls `preventDefault()` and restores the last save itself.
- The guard tells "unsaved" from "edited": undoing an edit by hand makes the
  badge disappear again, because it compares the form with the last save.
- Leaving on purpose through the dialog sets a flag, so the browser's own
  `beforeunload` warning doesn't ask a second time.

**Stimulus behavior worth knowing**

- Method names are used exactly as written. Stimulus camelizes identifiers'
  value and param attribute names, but not method names:
  `unsaved-changes#save-profile` looks for a method literally called
  `"save-profile"`.
- A descriptor that names a missing method isn't reported until its event
  fires. Then Stimulus logs `Error invoking action … references undefined
  method`. For `beforeunload@window`, that is the moment the visitor leaves,
  when nobody is looking at the console.

**Behavior worth knowing**

- The `reset` event fires before the form resets, and a native reset puts
  back the values in the page's markup, not the last save. The fields still
  hold the edits while the action runs, and even in a microtask after it.
  After a save, a native reset would bring back the values from page load.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Profile form with its actions, importmap, and controller registration |
| [`unsaved_changes_controller.js`](unsaved_changes_controller.js) | Tracks, saves, discards, and guards unsaved changes |
| [`dashboard/index.html`](dashboard/index.html) | The page the dashboard links go to |

**Try it**

Change the preferred role: the badge appears. Change it back: the badge
goes away. Add an emergency contact, type a name, and reload the page: the
browser asks first. Save, then edit the phone number and press "Discard
changes": the saved values come back, not the ones from page load. Edit
again and click "← Volunteer dashboard": choose "Keep editing", then try
again and "Leave without saving".
