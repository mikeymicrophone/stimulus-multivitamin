/*
 * point_lamp_controller.js — registered as "point-lamp"
 *
 * Teaches: a connect() throw on the previous lamp does
 * not stop this one from connecting.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Point lamp connected."
  }
}
