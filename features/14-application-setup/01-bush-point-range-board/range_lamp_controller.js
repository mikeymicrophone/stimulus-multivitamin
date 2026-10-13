/*
 * range_lamp_controller.js — registered as "range-lamp"
 *
 * Teaches: only lamps inside the application root connect.
 * The shore lamp wears the same identifier and stays dark.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Board lamp is lit."
  }

  logBearing() {
    this.readingTarget.textContent = "Bearing 312 logged."
  }
}
