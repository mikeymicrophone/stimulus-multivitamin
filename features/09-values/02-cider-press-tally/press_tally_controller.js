/*
 * press_tally_controller.js — registered as "press-tally"
 *
 * Teaches: bushels and gallons are Numbers. A missing gallons attribute
 * reads as 0 and hasGallonsValue is false. The Kingston slip says "08";
 * the getter returns 8 and leaves the attribute alone. Assigning
 * bushelsValue writes a plain decimal, so "08" becomes "9" after one
 * more bushel.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]
  static values = {
    bushels: Number,
    gallons: Number
  }

  connect() {
    this.render()
  }

  pressAnotherBushel() {
    this.bushelsValue = this.bushelsValue + 1
    this.render()
  }

  drawGallon() {
    this.gallonsValue = this.gallonsValue + 1
    this.render()
  }

  render() {
    const bushelAttribute = this.element.getAttribute("data-press-tally-bushels-value")
    const gallonAttribute = this.element.getAttribute("data-press-tally-gallons-value")
    this.readingTarget.textContent = [
      `Bushels ${this.bushelsValue}.`,
      `Bushel attribute ${bushelAttribute === null ? "absent" : bushelAttribute}.`,
      `hasBushelsValue ${this.hasBushelsValue}.`,
      `Gallons ${this.gallonsValue}.`,
      `Gallon attribute ${gallonAttribute === null ? "absent" : gallonAttribute}.`,
      `hasGallonsValue ${this.hasGallonsValue}.`
    ].join(" ")
  }
}
