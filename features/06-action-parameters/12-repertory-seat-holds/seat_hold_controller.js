/*
 * seat_hold_controller.js — registered as "seat-hold"
 *
 * Teaches: Stimulus writes event.params onto the shared event, and the
 * next action replaces that property. hold() awaits a microtask, the row
 * action runs during the bubble, and a later read of event.params sees
 * the row's houseNote. The object captured before the await still has
 * the seat. :stop on the orchestra seat keeps the row action from
 * running, so the event's params are still the seat's afterward.
 * Clicking the span inside the seat does not change which element the
 * params come from.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["before", "after", "rowNote"]

  async hold(event) {
    const captured = event.params
    this.beforeTarget.textContent = `Before waiting: ${captured.sectionName} ${captured.rowLetter}${captured.seatNumber} (${kindOf(captured.seatNumber)}). The target was ${event.target.tagName}.`
    await Promise.resolve()
    if (event.params === captured) {
      this.afterTarget.textContent = `After waiting, params are still ${captured.sectionName} ${captured.rowLetter}${captured.seatNumber}. The row action did not run.`
    } else {
      this.afterTarget.textContent = `After waiting, the event's params are the row's house note “${event.params.houseNote}”. The held seat is still ${captured.sectionName} ${captured.rowLetter}${captured.seatNumber} on the object captured before the wait.`
    }
  }

  noteRow(event) {
    const seat = event.params.seatNumber === undefined ? "missing" : event.params.seatNumber
    this.rowNoteTarget.textContent = `Row action saw house note “${event.params.houseNote}”. Seat number is ${seat}.`
  }
}

function kindOf(value) {
  if (value === undefined) return "missing"
  return typeof value
}
