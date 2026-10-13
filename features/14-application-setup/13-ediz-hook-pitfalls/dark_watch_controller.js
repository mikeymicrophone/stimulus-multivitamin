/*
 * dark_watch_controller.js — registered as "day-watch"
 *
 * Teaches: load() never reaches unload when shouldLoad
 * is false. The previous day watch keeps running.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get shouldLoad() {
    return false
  }

  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Dark watch connected."
  }
}
