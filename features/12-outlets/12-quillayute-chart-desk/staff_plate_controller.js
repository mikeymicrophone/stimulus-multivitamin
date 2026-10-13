/*
 * staff_plate_controller.js — registered as "staff-plate"
 *
 * Teaches: the outlet name tide-staff is not dasherized from
 * a camelCase property. The attribute has to be
 * data-staff-plate-tide-staff-outlet. data-staff-plate-tideStaff-outlet
 * is a different name after HTML lowercases it, and the
 * getter reports selector "null".
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["tide-staff"]
  static targets = ["reading", "fault"]

  connect() {
    this.readingTarget.textContent = `Staff plate hasTideStaffOutlet ${this.hasTideStaffOutlet}.`
  }

  readStaff() {
    try {
      this.faultTarget.textContent = this.tideStaffOutlet.element.id
    } catch (error) {
      this.faultTarget.textContent = `${error.name}: ${error.message}`
    }
  }
}
