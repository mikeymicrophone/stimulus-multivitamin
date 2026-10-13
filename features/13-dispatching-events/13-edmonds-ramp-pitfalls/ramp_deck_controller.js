/*
 * ramp_deck_controller.js — registered as "ramp-deck"
 *
 * Teaches: the deck is an ancestor, so it hears the
 * bell. It writes event.detail.fathoms. The next
 * listener sees that write because detail is shared.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Deck is quiet."
  }

  hear(event) {
    event.detail.fathoms = 0
    this.readingTarget.textContent = `Deck set fathoms to ${event.detail.fathoms}.`
  }
}
