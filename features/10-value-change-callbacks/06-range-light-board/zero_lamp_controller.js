/*
 * zero_lamp_controller.js — registered as "zero-lamp"
 *
 * Teaches: clearing a chalked 0 runs intensityValueChanged(0, 0).
 * The attribute is gone afterward. The arguments alone look like a
 * no-op.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["log"]
  static values = { intensity: Number }

  intensityValueChanged(intensity, previous) {
    const attribute = this.element.getAttribute("data-zero-lamp-intensity-value")
    this.record(`Intensity ${shown(intensity)}, previous ${shown(previous)}. Attribute ${attribute === null ? "absent" : shown(attribute)}. hasIntensityValue ${this.hasIntensityValue}.`)
  }

  clearZero() {
    this.intensityValue = undefined
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
