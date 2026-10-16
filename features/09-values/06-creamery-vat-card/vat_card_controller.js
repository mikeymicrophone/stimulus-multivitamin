/*
 * vat_card_controller.js — registered as "vat-card"
 *
 * Teaches: the { type, default } form. breed, temperature, and
 * cultures supply defaults when the attribute is missing, and
 * has[Name]Value is still true. spareDegrees is { type: Number } with
 * no default key, and hasSpareDegreesValue is true anyway. Filing the
 * mismatched card throws at register(), before any element connects.
 */
import { Controller } from "@hotwired/stimulus"
import { rawAttribute } from "../../../assets/readout.js"
import MismatchedVatController from "./mismatched_vat_controller.js"

export default class extends Controller {
  static targets = ["reading", "mismatch"]
  static values = {
    breed: { type: String, default: "Jersey" },
    temperature: { type: Number, default: 86 },
    spareDegrees: { type: Number },
    cultures: { type: Array, default: ["mesophilic"] },
    flagged: { type: Boolean, default: false }
  }

  connect() {
    this.render()
  }

  warmToEightyEight() {
    this.temperatureValue = 88
    this.render()
  }

  addThermophilic() {
    this.culturesValue = this.culturesValue.concat(["thermophilic"])
    this.render()
  }

  fileMismatchedCard() {
    try {
      this.application.register("mismatched-vat", MismatchedVatController)
      this.mismatchTarget.textContent = "The mismatched card registered."
    } catch (error) {
      this.mismatchTarget.textContent = error.message
    }
  }

  render() {
    this.readingTarget.textContent = describeVat(this)
  }
}

const VAT_FIELDS = new Map([
  ["breed", "Breed"],
  ["temperature", "Temperature"],
  ["spareDegrees", "Spare degrees"],
  ["cultures", "Cultures"],
  ["flagged", "Flagged"]
])

// Value properties are ordinary getters, so a computed key reads them the
// same way the dot form does.
export function describeVat(controller) {
  return Array.from(VAT_FIELDS, ([name, label]) => {
    const hasName = `has${name[0].toUpperCase()}${name.slice(1)}Value`
    const value = controller[`${name}Value`]
    const printed = Array.isArray(value) ? JSON.stringify(value) : value === "" ? '""' : String(value)
    return `${label} ${printed}. ${hasName} ${controller[hasName]}. ${label} attribute ${rawAttribute(controller, name)}.`
  }).join(" ")
}
