/*
 * bell_book_controller.js — registered as "bell-book"
 *
 * Teaches: this controller sits after the lane slip in the
 * document. The lane slip's missing class throws from a value
 * callback and skips the rest of the scan, so connect() here
 * does not run.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Bell book connected."
  }
}
