/*
 * gauge_controller.js — registered as "gauge"
 *
 * Teaches: houseZeroFeet and poolFeet are Numbers. houseZeroFeet's
 * attribute is data-gauge-house-zero-feet-value, the same string
 * gauge-house uses for zeroFeet. Assigning houseZeroFeetValue writes
 * that attribute, and the house controller's next read is the new
 * number. poolFeet is data-gauge-pool-feet-value and is not the
 * house's pool.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]
  static values = {
    houseZeroFeet: Number,
    poolFeet: Number
  }

  connect() {
    this.render()
  }

  raiseZero() {
    this.houseZeroFeetValue = 5
    this.render()
    this.application.getControllerForElementAndIdentifier(this.element, "gauge-house").render()
  }

  render() {
    const zeroAttribute = this.element.getAttribute("data-gauge-house-zero-feet-value")
    const poolAttribute = this.element.getAttribute("data-gauge-pool-feet-value")
    this.readingTarget.textContent = [
      `Gauge zero ${this.houseZeroFeetValue}.`,
      `Gauge pool ${this.poolFeetValue}.`,
      `Zero attribute ${zeroAttribute}.`,
      `Pool attribute ${poolAttribute}.`
    ].join(" ")
  }
}
