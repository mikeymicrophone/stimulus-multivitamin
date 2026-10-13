/*
 * shed_bell_controller.js — registered as "shed-bell"
 *
 * Teaches: the shed hears the event only when it is the
 * target, or when the event bubbles through the shed.
 * A dispatch on the desk, which is not an ancestor of
 * the shed, does not reach it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Shed is quiet."
  }

  hear(event) {
    this.readingTarget.textContent = `Shed heard ${event.type} from ${event.detail.from}.`
  }

  clear() {
    this.readingTarget.textContent = "Shed is quiet."
  }
}
