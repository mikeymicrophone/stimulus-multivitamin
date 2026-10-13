/*
 * bell_buoy_controller.js — registered as "bell-buoy"
 *
 * Teaches: soundingValueChanged(sounding, previous) receives the boolean
 * default as previous when the attribute is present, and undefined when
 * it is absent. A guard of sounding === previous skips the first paint
 * of a buoy chalked false. Laying the buoys up reconnects each one.
 * Only the buoy with no attribute runs the callback again.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading", "log"]
  static values = { place: String, sounding: Boolean, guard: Boolean }

  soundingValueChanged(sounding, previous) {
    if (this.guardValue && sounding === previous) {
      this.record(`Guard held ${shown(sounding)} against ${shown(previous)}.`)
      return
    }
    const place = this.placeValue
    const voice = sounding ? "ringing" : "silent"
    this.readingTarget.textContent = `${place} is ${voice}.`
    this.record(`${place} ${shown(sounding)}, previous ${shown(previous)}.`)
  }
}

function shown(value) {
  return value === undefined ? "undefined" : JSON.stringify(value)
}
