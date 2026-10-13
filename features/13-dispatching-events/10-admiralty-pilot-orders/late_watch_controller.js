/*
 * late_watch_controller.js — registered as "late-watch"
 *
 * Teaches: this window action is the first token, index
 * 0. Bindings that share window are sorted by that
 * index, not by document order.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["line"]

  connect() {
    this.lineTarget.textContent = "Late watch is quiet."
  }

  hear(event) {
    event.detail.tape.push("late")
    this.lineTarget.textContent = "Late watch heard the hail."
  }

  clear() {
    this.lineTarget.textContent = "Late watch is quiet."
  }
}
