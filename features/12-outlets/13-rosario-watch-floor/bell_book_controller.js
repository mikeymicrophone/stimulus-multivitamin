/*
 * bell_book_controller.js — registered as "bell-book"
 *
 * Sits after the lane slip. The slip's outlet callback throws
 * during the connect scan, so this connect() does not run.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Bell book connected."
  }
}
