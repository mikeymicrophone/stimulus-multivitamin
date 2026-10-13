# Error handling · 12 · Cape Disappointment report desk

A stuck foghorn throws the same error on every click. The
desk files that message once per second and groups the report.

**What it teaches**

- `handleError` receives every throw. The desk counts them
  all, and files a message only when that same `message`
  string was not filed in the last 1000 milliseconds.
- A filed report is one group: identifier, the Stimulus
  message, `detail.element.id`, `detail.index`, and
  `error.message`, then `group end`. The same lines are
  opened with `console.groupCollapsed`, `console.error`, and
  `console.groupEnd`.
- Cracking the lens is a different `message`, so it files
  immediately even inside that second. Its index is `0`
  on its own button, the same index the horn uses on its
  button. The messages are what separate them. See
  [Action `detail` carries `index` and `event`; lifecycle `detail` does not](../../../DISCOVERIES.md#action-detail-carries-index-and-event-lifecycle-detail-does-not).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The throttle and the grouped mirror |
| [`fog_horn_controller.js`](fog_horn_controller.js) | Stuck horn and cracked lens |

**Try it**

Throws 0. Filed 0. The horn reads "Horn is quiet." Sound
the stuck horn three times. The horn reads "Horn stuck."
Throws 3. Filed 1. The group reads:

```
group fog-horn # Error invoking action "click->fog-horn#stick"
element fog-horn
index 0
error horn solenoid stuck
group end
```

Crack the lens. The horn reads "Lens cracked." Throws 4.
Filed 2. The second group names
`Error invoking action "click->fog-horn#crack"`, element
`fog-horn`, index `0`, error `lens cracked`.
