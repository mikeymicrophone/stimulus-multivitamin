# Error handling · 02 · Mukilteo fare banner

A void card at the Mukilteo toll booth throws inside the fare
window. Travelers see a banner. The clerk keeps the report.

**What it teaches**

- `application.handleError` can update the page. The banner
  says the boarding count was not changed. It does not include
  the action string or `error.message`.
- The clerk log keeps `message`, `detail.identifier`, and
  `error.message` (`Card reader returned void.`).
- The action wrote "Void card was not charged." before it
  threw. The tally stays "Boarded 18."
- Dismissing the banner is an ordinary listener. It does not
  clear the clerk log.
- The departure clock is a different controller. Advancing it
  does not file another note.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Banner, clerk log, and clock |
| [`fare_window_controller.js`](fare_window_controller.js) | The void charge |
| [`departure_clock_controller.js`](departure_clock_controller.js) | The clock that still advances |

**Try it**

The banner is hidden. The clerk log reads "No clerk note."
Clerk notes 0. The window reads "Window is ready." and
"Boarded 18." The clock reads "Clock reads 14:10." Charge the
void card. The window reads "Void card was not charged." The
tally stays "Boarded 18." The banner reads "The fare window
hit a snag. The boarding count was not changed." The clerk log
reads:

```
Error invoking action "click->fare-window#chargeVoid" | fare-window | Card reader returned void.
```

Clerk notes 1. Dismiss the banner. The banner is hidden. The
clerk log is unchanged. Advance the clock. The clock reads
"Clock reads 14:40." Clerk notes stays 1.
