/*
 * fuel_pump_controller.js — registered as "fuel-pump"
 *
 * Teaches: closeHose() and openValue live on the pump. The
 * dock reaches them through the outlet list. A housing that
 * only shares a class is not this controller.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { open: Boolean, grade: String }

  closeHose() {
    this.openValue = false
    return this.gradeValue
  }
}
