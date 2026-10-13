/*
 * object_plate_controller.js — registered as "object-plate"
 *
 * Teaches: static outlets as an object is ignored. No outlet
 * properties are defined. Reading tideStaffOutlet is undefined
 * and does not throw.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = { tideStaff: "#quillayute-staff" }
  static targets = ["reading"]

  connect() {
    const defined = "tideStaffOutlet" in this
    this.readingTarget.textContent = `Object plate tideStaffOutlet in ${defined}. Value ${this.tideStaffOutlet}.`
  }
}
