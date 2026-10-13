/*
 * retort_basket_controller.js — registered as "retort-basket"
 *
 * Teaches: the basket only dispatches. It does not
 * know who is listening. The event bubbles to the
 * floor. It does not reach a sibling inspector.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Basket is empty."
  }

  cook() {
    const event = this.dispatch("cooked", {
      detail: { basket: "LC-14", jars: 240 }
    })
    this.readingTarget.textContent = `Dispatched ${event.type}. jars ${event.detail.jars}.`
  }
}
