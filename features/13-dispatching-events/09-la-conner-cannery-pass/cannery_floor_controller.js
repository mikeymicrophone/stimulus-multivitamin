/*
 * cannery_floor_controller.js — registered as "cannery-floor"
 *
 * Teaches: a shared ancestor hears the bubble and can
 * update itself without an outlet. The sibling
 * inspector is reached with an outlet, which returns
 * a value. Dispatch is already done before the outlet
 * is read, so a missing outlet does not swallow the
 * event the way an unguarded read before dispatch would.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["batch-inspector"]
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Floor is waiting for a basket."
  }

  receive(event) {
    const heard = `Floor heard ${event.type}. ${event.detail.basket} ${event.detail.jars}.`
    let returned = "not asked"
    let fault = "No fault."
    try {
      returned = this.batchInspectorOutlet.accept(event.detail)
    } catch (error) {
      fault = `${error.name}: ${error.message}`
    }
    this.readingTarget.textContent = `${heard} Inspector returned ${returned}. ${fault}`
  }

  dropOutlet() {
    this.element.removeAttribute("data-cannery-floor-batch-inspector-outlet")
    this.readingTarget.textContent = "Outlet attribute removed."
  }
}
