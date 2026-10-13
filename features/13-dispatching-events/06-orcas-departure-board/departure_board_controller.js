/*
 * departure_board_controller.js — registered as "departure-board"
 *
 * Teaches: dispatch returns the CustomEvent after every
 * listener has run. defaultPrevented is how a listener
 * vetoes the departure. cancelable: false makes the
 * veto a no-op. A listener that throws does not stop
 * the return.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Chelan is alongside."
  }

  depart(event) {
    if (event.params.jam) this.element.dataset.jam = "yes"
    const sent = this.dispatch("departed", {
      cancelable: event.params.cancelable !== false,
      detail: { vessel: "Chelan", slip: "Orcas" }
    })
    delete this.element.dataset.jam
    const decision = sent.defaultPrevented ? "Held" : "Let go"
    this.readingTarget.textContent = `${decision} Chelan. defaultPrevented ${sent.defaultPrevented}. cancelable ${sent.cancelable}. type ${sent.type}.`
  }
}
