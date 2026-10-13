/*
 * tide_staff_controller.js — registered as "tide-staff"
 *
 * Teaches: this.dispatch(name) names the event
 * identifier:name. The identifier is the one the controller
 * was registered under. The name is the argument, hyphens
 * included. The returned event's type is that string.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["note"]

  postReading() {
    const event = this.dispatch("posted", {
      detail: { station: "Port Gamble", feet: "8.4" }
    })
    this.noteTarget.textContent = `Dispatched ${event.type}.`
  }

  changeLine() {
    const event = this.dispatch("line-changed", {
      detail: { line: "south" }
    })
    this.noteTarget.textContent = `Dispatched ${event.type}.`
  }
}
