/*
 * tide_staff_controller.js — registered as "tide-staff"
 *
 * The staff is connected. A plate that looks for it under a
 * camelCase attribute name still will not see it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.statusTarget.textContent = "Quillayute staff connected."
  }
}
