/*
 * day_watch_controller.js — registered as "day-watch"
 *
 * The watch that is already up. A later register of a
 * class with shouldLoad false must not tear it down.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Day watch is up."
  }

  disconnect() {
    document.getElementById("watch-tape").textContent = "Day watch disconnected."
  }
}
