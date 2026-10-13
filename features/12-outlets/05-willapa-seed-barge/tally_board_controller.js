/*
 * tally_board_controller.js — registered as "tally-board"
 *
 * Teaches: a connect() throw on the barge ahead is caught.
 * This board still connects.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Tally board connected."
  }
}
