/*
 * foghorn_controller.js — registered as "foghorn"
 *
 * Teaches: blast() returns the pattern. hearLocal runs only
 * if the desk's event reaches this element. hearWindow runs
 * from a window listener. A sibling does not hear a bubbling
 * dispatch. The return value has no event equivalent.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { pattern: String, station: String }
  static targets = ["heard"]

  initialize() {
    this.localHeard = false
    this.windowHeard = false
  }

  blast() {
    return this.patternValue
  }

  hearLocal() {
    this.localHeard = true
    this.heardTarget.textContent = `${this.stationValue} heard the desk on the horn.`
  }

  hearWindow() {
    this.windowHeard = true
    this.heardTarget.textContent = `${this.stationValue} heard the desk on the window.`
  }
}
