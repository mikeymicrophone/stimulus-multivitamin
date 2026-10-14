/*
 * tide_staff_controller.js — registered as "tide-staff"
 *
 * Teaches: a throw inside an action reaches the function assigned
 * to application.handleError, after the lines above the throw
 * have already run.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Staff is steady."
  }

  postReading() {
    this.readingTarget.textContent = "Foul mark entered."
    throw new Error("Staff reading is foul.")
  }
}
