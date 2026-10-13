/*
 * flag_log_controller.js — registered as "flag-log"
 *
 * Teaches: the log is an ancestor, so it hears a
 * bubbling hoist and can veto it. A still event and
 * an event that starts inside the shadow never arrive.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Log is quiet."
  }

  hear(event) {
    event.preventDefault()
    this.readingTarget.textContent = `Log heard ${event.detail.flag}. defaultPrevented ${event.defaultPrevented}. composed ${event.composed}.`
  }
}
