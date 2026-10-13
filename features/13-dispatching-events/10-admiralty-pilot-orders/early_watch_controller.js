/*
 * early_watch_controller.js — registered as "early-watch"
 *
 * Teaches: this window action is the second token, so
 * its index is 1. A later controller whose window
 * action is index 0 runs first.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["line"]

  connect() {
    this.lineTarget.textContent = "Early watch is quiet."
  }

  hear(event) {
    event.detail.tape.push("early")
    this.lineTarget.textContent = "Early watch heard the hail."
  }

  clear() {
    this.lineTarget.textContent = "Early watch is quiet."
  }
}
