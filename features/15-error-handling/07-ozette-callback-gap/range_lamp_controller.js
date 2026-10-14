/*
 * range_lamp_controller.js — registered as "range-lamp"
 *
 * Teaches: bearingValueChanged is not wrapped by
 * handleError. A throw after connect is an error event.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { bearing: String }
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Range lamp connected."
  }

  bearingValueChanged(bearing) {
    if (bearing === "foul") {
      this.readingTarget.textContent = "Bearing went foul."
      throw new Error("bearing foul")
    }
    this.readingTarget.textContent = `Bearing ${bearing}.`
  }

  foul() {
    this.bearingValue = "foul"
  }
}
