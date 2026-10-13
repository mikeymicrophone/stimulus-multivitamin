/*
 * unguarded_bells_controller.js — registered as "unguarded-bells"
 *
 * Teaches: each bell writes the other interval one second longer.
 * The value observer stays listening during the callback, so the
 * chase continues one microtask at a time. A counter cuts it off.
 * Stimulus does not.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["log"]
  static values = { slipInterval: Number, waadahInterval: Number }

  initialize() {
    this.strikes = 0
  }

  slipIntervalValueChanged(interval) {
    this.strike("Slip Point", interval, () => {
      this.waadahIntervalValue = interval + 1
    })
  }

  waadahIntervalValueChanged(interval) {
    this.strike("Waadah Island", interval, () => {
      this.slipIntervalValue = interval + 1
    })
  }

  strike(place, interval, writeOther) {
    this.strikes += 1
    this.record(`${place} ${interval}.`)
    if (this.strikes > 8) {
      this.record("Cut the chase.")
      return
    }
    writeOther()
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}
