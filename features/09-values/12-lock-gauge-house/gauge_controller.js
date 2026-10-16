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
import { report } from "../../../assets/readout.js"

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
    this.house?.render()
  }

  // null until gauge-house has connected on this element.
  get house() {
    return this.application.getControllerForElementAndIdentifier(this.element, "gauge-house")
  }

  render() {
    // dataset camelizes the same way Stimulus does, so gauge's
    // houseZeroFeet and gauge-house's zeroFeet are one dataset key.
    const { gaugeHouseZeroFeetValue, gaugePoolFeetValue } = this.element.dataset
    report(
      this.readingTarget,
      `Gauge zero ${this.houseZeroFeetValue}.`,
      `Gauge pool ${this.poolFeetValue}.`,
      `Zero attribute ${gaugeHouseZeroFeetValue}.`,
      `Pool attribute ${gaugePoolFeetValue}.`
    )
  }
}
