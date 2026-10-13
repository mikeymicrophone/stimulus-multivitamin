/*
 * guarded_bells_controller.js — registered as "guarded-bells"
 *
 * Teaches: each bell copies the other only when the getter is not
 * already that interval. Matching bells do not chase. Striking Slip
 * Point to 8 writes Waadah once, and Slip Point does not write back.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["log"]
  static values = { slipInterval: Number, waadahInterval: Number }

  slipIntervalValueChanged(interval) {
    this.record(`Slip Point ${interval}.`)
    if (this.waadahIntervalValue !== interval) this.waadahIntervalValue = interval
  }

  waadahIntervalValueChanged(interval) {
    this.record(`Waadah Island ${interval}.`)
    if (this.slipIntervalValue !== interval) this.slipIntervalValue = interval
  }

  strikeSlipPoint() {
    this.slipIntervalValue = 8
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}
