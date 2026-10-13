/*
 * tide_staff_controller.js — registered as "tide-staff"
 *
 * Teaches: heightValueChanged(height, previousHeight) runs before
 * connect(), including when the attribute is missing. A present
 * attribute's previous value is the number default, 0, even when the
 * staff is already at 0. A missing attribute's previous value is
 * undefined. The staff is painted from the callback, not from connect().
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading", "log"]
  static values = { height: Number, place: String }

  heightValueChanged(height, previousHeight) {
    const place = this.placeValue
    this.readingTarget.textContent = `${place} reads ${height} ft.`
    this.record(`${place} ${height}, previous ${shown(previousHeight)}.`)
  }

  connect() {
    this.record(`connect saw ${this.placeValue} at ${this.heightValue} ft.`)
  }

  raiseStaff() {
    this.heightValue = this.heightValue + 1
  }

  lowerStaff() {
    this.heightValue = this.heightValue - 1
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}

function shown(value) {
  return value === undefined ? "undefined" : JSON.stringify(value)
}
