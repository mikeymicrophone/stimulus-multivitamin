/*
 * weight_slip_controller.js — registered as "weight-slip"
 *
 * Teaches: pennyweights is a Number. Underscores are stripped before
 * Number(), so "1_000" is 1000 and the attribute stays "1_000".
 * "1,200" and "12dwt" are NaN. A blank attribute is 0 with
 * hasPennyweightsValue true. A missing attribute is 0 with has false.
 * " 14.5 " is 14.5. "2e1" is 20. A certificate past
 * Number.MAX_SAFE_INTEGER loses a digit in the value and keeps every
 * digit in the attribute until something assigns it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slipName", "reading"]
  static values = { pennyweights: Number }

  connect() {
    this.render()
  }

  render() {
    const attribute = this.element.getAttribute("data-weight-slip-pennyweights-value")
    const value = this.pennyweightsValue
    const printed = Number.isNaN(value) ? "NaN" : String(value)
    const slipName = this.slipNameTarget.textContent.trim()
    this.readingTarget.textContent = [
      `${slipName} pennyweights ${printed}.`,
      `Attribute ${attribute === null ? "absent" : JSON.stringify(attribute)}.`,
      `hasPennyweightsValue ${this.hasPennyweightsValue}.`
    ].join(" ")
  }
}
