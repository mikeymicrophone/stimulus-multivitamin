/*
 * case_lamp_controller.js — registered as "bell-case"
 *
 * Teaches: the identifier must match the attribute value
 * character for character. Bell-Case does not connect
 * an element marked bell-case.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Case lamp is lit."
  }
}
