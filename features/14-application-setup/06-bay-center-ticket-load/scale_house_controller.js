/*
 * scale_house_controller.js — registered as "scale-house"
 *
 * Loaded as one argument of application.load(first, second).
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Scale house connected."
  }

  disconnect() {
    this.readingTarget.textContent = "Scale house disconnected."
  }
}
