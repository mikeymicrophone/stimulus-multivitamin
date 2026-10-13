/*
 * late_init_controller.js — registered as "late-init"
 *
 * initialize() throws. If handleError also throws, this
 * connect() does not run and the next controller is skipped.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  initialize() {
    this.readingTarget.textContent = "Late init entered initialize."
    throw new Error("late init tore")
  }

  connect() {
    this.readingTarget.textContent = "Late init connected."
  }
}
