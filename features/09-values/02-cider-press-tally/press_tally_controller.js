/*
 * press_tally_controller.js — registered as "press-tally"
 *
 * Teaches: bushels and gallons are Numbers. A missing gallons attribute
 * reads as 0 and hasGallonsValue is false. The Kingston slip says "08";
 * the getter returns 8 and leaves the attribute alone. bushelsValue++
 * and gallonsValue += 1 read through the getter and write through the
 * setter, so "08" becomes "9" after one more bushel.
 */
import { Controller } from "@hotwired/stimulus"
import { report, rawAttribute } from "../../../assets/readout.js"

export default class extends Controller {
  static targets = ["reading"]
  static values = {
    bushels: Number,
    gallons: Number
  }

  connect() {
    this.#paint()
  }

  pressAnotherBushel() {
    this.bushelsValue++
    this.#paint()
  }

  drawGallon() {
    this.gallonsValue += 1
    this.#paint()
  }

  get #slip() {
    return {
      bushels: rawAttribute(this, "bushels"),
      gallons: rawAttribute(this, "gallons")
    }
  }

  #paint() {
    const { bushels, gallons } = this.#slip
    report(
      this.readingTarget,
      `Bushels ${this.bushelsValue}.`,
      `Bushel attribute ${bushels}.`,
      `hasBushelsValue ${this.hasBushelsValue}.`,
      `Gallons ${this.gallonsValue}.`,
      `Gallon attribute ${gallons}.`,
      `hasGallonsValue ${this.hasGallonsValue}.`
    )
  }
}
