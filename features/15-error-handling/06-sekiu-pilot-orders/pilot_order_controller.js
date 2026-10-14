/*
 * pilot_order_controller.js — registered as "pilot-order"
 *
 * Teaches: a throw in one action does not skip the next
 * action on that button. A missing method is the same
 * kind of report, filed when the click happens.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["order", "deck"]

  connect() {
    this.orderTarget.textContent = "No order filed."
    this.deckTarget.textContent = "Deck is clear."
  }

  fileOrder() {
    this.orderTarget.textContent = "Order filed for the Sekiu."
  }

  jamWinch() {
    throw new Error("winch jammed")
  }

  stampDeck() {
    this.deckTarget.textContent = "Deck stamped."
  }
}
