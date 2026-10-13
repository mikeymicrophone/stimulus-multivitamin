/*
 * detail_mate_controller.js — registered as "detail-mate"
 *
 * Teaches: this window listener runs after the deck.
 * It reads the fathoms the deck already changed.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Mate has not looked."
  }

  hear(event) {
    this.readingTarget.textContent = `Mate saw fathoms ${event.detail.fathoms}.`
  }
}
