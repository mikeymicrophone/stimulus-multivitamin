/*
 * solar_share_controller.js — registered as "solar-share"
 *
 * Teaches: a custom :confirmed option returns false to block
 * cancelShare() when the acknowledgement box is empty. The callback uses
 * controller to read that box and element to know which button asked.
 * :!confirmed skips the check (value is false, so the filter returns
 * true immediately) and keepShare() always runs.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["acknowledgement", "status", "subscription", "optionLog"]
  static values = {
    arrayName: { type: String, default: "South Ridge array" },
    kilowatts: { type: Number, default: 2.4 },
  }

  connect() {
    this.cancelled = false
    this.statusTarget.textContent = "Your 2.4 kW share on the South Ridge array is active. Cancelling needs the acknowledgement box."
  }

  recordOption(payload) {
    const line = document.createElement("li")
    line.textContent = `option ${payload.name} value=${payload.value} element=${payload.elementName} controller=${payload.identifier} acknowledged=${payload.acknowledged} returned=${payload.returned}`
    this.optionLogTarget.append(line)
    if (payload.returned === "false") {
      this.statusTarget.textContent = "Cancellation blocked: the :confirmed option returned false, so cancelShare() never ran."
    }
  }

  get hasAcknowledgement() {
    return this.acknowledgementTarget.checked
  }

  cancelShare() {
    this.cancelled = true
    this.subscriptionTarget.textContent = "No active share."
    this.statusTarget.textContent = "South Ridge Solar Co-op subscription cancelled. The array will offer your 2.4 kW to the waitlist."
    this.acknowledgementTarget.disabled = true
  }

  keepShare() {
    if (this.cancelled) {
      this.statusTarget.textContent = "The share is already cancelled. :!confirmed still ran keepShare() because that option does not look at the box."
      return
    }
    this.statusTarget.textContent = `Kept the ${this.kilowattsValue} kW share on the ${this.arrayNameValue}. :!confirmed returned true without reading the box.`
  }
}
