/*
 * skiff_line_controller.js — registered as "skiff-line"
 *
 * Teaches: an element added while the application is
 * stopped connects when start() runs again.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Skiff connected."
    const tape = document.getElementById("hold-tape")
    const prior = tape.dataset.started === "yes" ? tape.textContent : ""
    tape.dataset.started = "yes"
    tape.textContent = prior ? `${prior} Skiff connected.` : "Skiff connected."
  }
}
