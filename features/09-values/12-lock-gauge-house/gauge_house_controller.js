/*
 * gauge_house_controller.js — registered as "gauge-house"
 *
 * Teaches: zeroFeet reads data-gauge-house-zero-feet-value, which is
 * also gauge's houseZeroFeet. poolFeet reads
 * data-gauge-house-pool-feet-value, a different attribute from the
 * gauge's pool. Setting the house pool does not change the gauge pool.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]
  static values = {
    zeroFeet: Number,
    poolFeet: Number
  }

  connect() {
    this.render()
  }

  setHousePool() {
    this.poolFeetValue = 8
    this.render()
    this.application.getControllerForElementAndIdentifier(this.element, "gauge").render()
  }

  render() {
    const zeroAttribute = this.element.getAttribute("data-gauge-house-zero-feet-value")
    const poolAttribute = this.element.getAttribute("data-gauge-house-pool-feet-value")
    this.readingTarget.textContent = [
      `House zero ${this.zeroFeetValue}.`,
      `House pool ${this.poolFeetValue}.`,
      `Zero attribute ${zeroAttribute}.`,
      `House pool attribute ${poolAttribute}.`
    ].join(" ")
  }
}
