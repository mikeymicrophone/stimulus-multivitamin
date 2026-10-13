/*
 * sector_bell_controller.js — registered as "sector-bell"
 *
 * Teaches: the desk calls ring() and reads patternValue.
 * This bell is in the body, so the desk's outlet callback
 * runs before the desk's connect(), after this connect().
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { pattern: String }
  static targets = ["status"]

  connect() {
    this.statusTarget.textContent = `Sector bell ${this.patternValue}.`
  }

  ring() {
    this.statusTarget.textContent = `Sector bell sounded ${this.patternValue}.`
    return this.patternValue
  }
}
