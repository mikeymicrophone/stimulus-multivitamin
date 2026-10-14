/*
 * late_next_controller.js — registered as "late-next"
 *
 * Would connect after late-init. A throw escaping
 * initialize() skips it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Late next connected."
  }
}
