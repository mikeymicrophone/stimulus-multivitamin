/*
 * front_range_controller.js — registered as "front-range"
 *
 * Teaches: assigning undefined removes color and intensity and runs
 * the callback with the type default. Intensity 4 falls back to 0
 * with previous 4.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["log"]
  static values = { color: String, intensity: Number }

  colorValueChanged(color, previous) {
    this.record(`Color ${shown(color)}, previous ${shown(previous)}. ${this.presence("color", "hasColorValue", this.hasColorValue)}`)
  }

  intensityValueChanged(intensity, previous) {
    this.record(`Intensity ${shown(intensity)}, previous ${shown(previous)}. ${this.presence("intensity", "hasIntensityValue", this.hasIntensityValue)}`)
  }

  takeColorOff() {
    this.colorValue = undefined
  }

  dimToNothing() {
    this.intensityValue = undefined
  }

  presence(key, hasLabel, hasValue) {
    const attribute = this.element.getAttribute(`data-front-range-${key}-value`)
    return `Attribute ${attribute === null ? "absent" : shown(attribute)}. ${hasLabel} ${hasValue}.`
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
