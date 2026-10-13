/*
 * bell_watch_controller.js — registered as "bell-watch"
 *
 * Teaches: a controller that does not throw keeps working after
 * another controller's action has been reported.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Bell is quiet."
  }

  ring() {
    this.readingTarget.textContent = "Bell rang."
  }
}
