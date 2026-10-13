/*
 * after_bell_controller.js — registered as "after-bell"
 *
 * Sits after the fax. The fax's value callback aborts
 * the scan, so connect() here does not run.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "After bell connected."
  }

  ring() {
    this.readingTarget.textContent = "After bell rang."
  }
}
