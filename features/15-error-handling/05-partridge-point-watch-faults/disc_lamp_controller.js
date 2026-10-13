/*
 * disc_lamp_controller.js — registered as "disc-lamp"
 *
 * Teaches: a throw in disconnect() is reported, and the
 * observers still stop afterward. A later click does not
 * run the action.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Disc lamp is up."
  }

  disconnect() {
    throw new Error("disconnect wick failed")
  }

  trim() {
    this.readingTarget.textContent = "Disc lamp trimmed."
  }

  pull() {
    this.element.removeAttribute("data-controller")
  }
}
