/*
 * pilot_boat_controller.js — registered as "pilot-boat"
 *
 * Teaches: listeners on the dispatching element run
 * in data-action order. stopPropagation leaves the
 * rest of that list running. stopImmediatePropagation
 * cuts the list. The tape array on detail is how the
 * boat reads the order after dispatch returns.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tape"]

  connect() {
    this.tapeTarget.textContent = "No hail yet."
  }

  hail(event) {
    this.dispatch("cleared")
    const tape = []
    this.dispatch("hailed", {
      detail: { manner: event.params.manner, vessel: "Wicklow", tape }
    })
    this.tapeTarget.textContent = `manner ${event.params.manner}. tape ${tape.join(" ")}.`
  }

  logHail(event) {
    event.detail.tape.push("log")
    if (event.detail.manner === "stop") event.stopPropagation()
    if (event.detail.manner === "immediate") event.stopImmediatePropagation()
  }

  bellHail(event) {
    event.detail.tape.push("bell")
  }

  clearLocal() {
  }
}
