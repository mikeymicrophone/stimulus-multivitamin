/*
 * pier_log_controller.js — registered as "pier-log"
 *
 * Teaches: an ancestor hears a bubbling event that starts
 * on a descendant. It does not hear an event that starts
 * on window, or a still event that starts on the shed.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Pier is quiet."
  }

  hear(event) {
    this.readingTarget.textContent = `Pier heard ${event.type} from ${event.detail.from}.`
  }

  clear() {
    this.readingTarget.textContent = "Pier is quiet."
  }
}
