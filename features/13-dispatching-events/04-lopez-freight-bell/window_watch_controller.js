/*
 * window_watch_controller.js — registered as "window-watch"
 *
 * Teaches: @window hears a bubbling event after document,
 * and hears an event whose target is window. bubbles:
 * false keeps the watch quiet unless window is the target.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Watch is quiet."
  }

  hear(event) {
    const where = event.currentTarget === window ? "window" : "elsewhere"
    this.readingTarget.textContent = `Watch heard ${event.type} on ${where} from ${event.detail.from}.`
  }

  clear() {
    this.readingTarget.textContent = "Watch is quiet."
  }
}
