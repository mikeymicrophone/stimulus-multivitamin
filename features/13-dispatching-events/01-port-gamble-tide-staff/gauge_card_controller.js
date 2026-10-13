/*
 * gauge_card_controller.js — registered as "gauge-card"
 *
 * Teaches: a second controller that also dispatches
 * "posted" does not reuse the tide staff's event name.
 * The prefix is its own identifier, so the log hears
 * gauge-card:posted and not another tide-staff:posted.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["note"]

  postGauge() {
    const event = this.dispatch("posted", {
      detail: { station: "Port Gamble gauge", feet: "8.1" }
    })
    this.noteTarget.textContent = `Dispatched ${event.type}.`
  }
}
