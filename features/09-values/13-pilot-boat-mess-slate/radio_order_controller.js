/*
 * radio_order_controller.js — registered as "radio-order"
 *
 * Teaches: menu is an Array. The radio slip is "chowder, pilot bread",
 * which is not JSON. Reading it throws SyntaxError. The slate does
 * not read this value in connect(), so the galley still comes up.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]
  static values = { menu: Array }

  takeOrder() {
    try {
      this.readingTarget.textContent = `Radio menu ${this.menuValue.join(", ")}.`
    } catch (error) {
      this.readingTarget.textContent = `${error.name}: ${error.message}`
    }
  }
}
