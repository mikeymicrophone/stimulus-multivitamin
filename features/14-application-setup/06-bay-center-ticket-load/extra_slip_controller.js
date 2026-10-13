/*
 * extra_slip_controller.js — registered as "extra-slip"
 *
 * Teaches: load(array, extra) keeps the array and drops
 * the extra. load(first, second) keeps both.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Extra slip connected."
  }

  disconnect() {
    this.readingTarget.textContent = "Extra slip disconnected."
  }
}
