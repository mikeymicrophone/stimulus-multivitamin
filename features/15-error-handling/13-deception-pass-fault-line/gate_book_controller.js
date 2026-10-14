/*
 * gate_book_controller.js — registered as "gate-book"
 *
 * Sits after async-init. The async rejection does not
 * skip this connect().
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Gate book connected."
  }
}
