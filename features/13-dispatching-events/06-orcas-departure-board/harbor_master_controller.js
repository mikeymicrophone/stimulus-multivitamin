/*
 * harbor_master_controller.js — registered as "harbor-master"
 *
 * Teaches: preventDefault during the listener sets
 * defaultPrevented for every later listener and for
 * the caller. The master runs before the wharf
 * because it is an ancestor, not a window listener.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.refuse = false
    this.readingTarget.textContent = "Master is on watch."
  }

  setRefuse(event) {
    this.refuse = event.target.checked
    this.readingTarget.textContent = this.refuse ? "Master will refuse." : "Master will allow."
  }

  review(event) {
    if (this.refuse) event.preventDefault()
    this.readingTarget.textContent = `Master ${this.refuse ? "refused" : "allowed"}. defaultPrevented ${event.defaultPrevented}.`
  }
}
