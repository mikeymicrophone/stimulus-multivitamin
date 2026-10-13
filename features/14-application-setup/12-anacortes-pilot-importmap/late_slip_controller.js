/*
 * late_slip_controller.js — registered as "late-slip"
 *
 * Teaches: the module is not imported until an element
 * with this identifier is added. One registration connects
 * every slip that is already in the document.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    const count = Number(this.element.dataset.connections || "0") + 1
    this.element.dataset.connections = String(count)
    this.readingTarget.textContent = count === 1 ? "Late slip connected." : `Late slip connected ${count} times.`
  }
}
