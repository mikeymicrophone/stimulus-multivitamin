/*
 * string_plate_controller.js — registered as "string-plate"
 *
 * Teaches: static outlets as a string is ignored, the same
 * as an object. tideStaffOutlet is not a property.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = "tide-staff"
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = `String plate tideStaffOutlet in ${"tideStaffOutlet" in this}.`
  }
}
