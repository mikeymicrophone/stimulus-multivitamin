/*
 * bay_tile_controller.js — registered as "bay-tile"
 *
 * Teaches: faultValue is the recoverable state. The
 * offline class and the fallback sentence come from
 * faultValueChanged. A caught sensor failure uses the
 * same value. A throw uses it from handleError.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["live", "fallback"]
  static classes = ["offline"]
  static values = { kind: String, reading: String, fault: String }

  readingValueChanged(reading) {
    if (this.faultValue) return
    this.liveTarget.textContent = `${this.kindValue} ${reading}`
  }

  faultValueChanged(fault) {
    const offline = Boolean(fault)
    if (this.hasOfflineClass) {
      this.element.classList.toggle(this.offlineClass, offline)
    }
    this.liveTarget.hidden = offline
    this.fallbackTarget.hidden = !offline
    if (offline) {
      this.fallbackTarget.textContent = `${this.kindValue} tile offline. Last good reading ${this.readingValue}.`
    }
  }

  stepWind() {
    this.readingValue = "18 kn"
  }

  failSensor() {
    this.liveTarget.textContent = `${this.kindValue} sensor tripped.`
    throw new Error("sensor tripped")
  }

  readBlank() {
    try {
      throw new Error("Sensor blank.")
    } catch (error) {
      this.faultValue = error.message
      this.dispatch("caught", { detail: { kind: this.kindValue, reason: error.message } })
    }
  }

  retry() {
    this.faultValue = ""
    this.liveTarget.textContent = `${this.kindValue} ${this.readingValue}`
  }
}
