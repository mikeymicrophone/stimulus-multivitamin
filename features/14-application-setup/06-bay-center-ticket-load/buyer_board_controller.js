/*
 * buyer_board_controller.js — registered as "buyer-board"
 *
 * Loaded from a definitions array.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Buyer board connected."
  }

  disconnect() {
    this.readingTarget.textContent = "Buyer board disconnected."
  }
}
