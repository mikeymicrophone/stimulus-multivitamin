/*
 * strait_watch_controller.js — registered as "strait-watch"
 *
 * Teaches: @window hears a bubbling hoist from the
 * light DOM. It does not hear a non-composed event
 * that starts inside the shadow root.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Watch is quiet."
  }

  hear(event) {
    this.readingTarget.textContent = `Watch heard ${event.detail.flag}. composed ${event.composed}.`
  }
}
