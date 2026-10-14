/*
 * tide_book_controller.js — registered as "tide-book"
 *
 * Teaches: slipTargetConnected is not wrapped by
 * handleError. A throw leaves the target observer stopped,
 * so a slip added afterward is not numbered.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slip", "reading"]

  connect() {
    this.readingTarget.textContent = "Tide book connected."
    this.serial = 0
  }

  slipTargetConnected(slip) {
    this.serial += 1
    slip.textContent = `Slip ${this.serial} numbered.`
    if (slip.dataset.torn === "yes") {
      throw new Error("slip card tore")
    }
  }

  addSlip(event) {
    const slip = document.createElement("p")
    slip.dataset.tideBookTarget = "slip"
    slip.dataset.torn = event.params.torn
    slip.textContent = event.params.torn === "yes" ? "Slip 1 unnumbered." : "Slip 2 unnumbered."
    slip.id = event.params.torn === "yes" ? "slip-1" : "slip-2"
    this.element.append(slip)
  }
}
