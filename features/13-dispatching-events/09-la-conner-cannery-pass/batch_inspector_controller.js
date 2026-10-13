/*
 * batch_inspector_controller.js — registered as "batch-inspector"
 *
 * Teaches: accept() is an outlet call and returns a
 * string. The sibling action for the cook event does
 * not run, because the event never bubbles sideways.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Inspector has not been asked."
  }

  accept(detail) {
    this.readingTarget.textContent = `Inspector accepted ${detail.basket} by outlet.`
    return "accepted"
  }

  missed() {
    this.readingTarget.textContent = "Inspector heard the event."
  }
}
