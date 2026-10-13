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
    this.readingTarget.textContent = describeVat(this, "vat-card")
  }
}

export function describeVat(controller, identifier) {
  const fields = [
    ["breed", "Breed", controller.breedValue, controller.hasBreedValue],
    ["temperature", "Temperature", controller.temperatureValue, controller.hasTemperatureValue],
    ["spareDegrees", "Spare degrees", controller.spareDegreesValue, controller.hasSpareDegreesValue],
    ["cultures", "Cultures", controller.culturesValue, controller.hasCulturesValue],
    ["flagged", "Flagged", controller.flaggedValue, controller.hasFlaggedValue]
  ]
  return fields.map(([token, label, value, present]) => {
    const key = `${token.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}-value`
    const attributeName = `data-${identifier}-${key}`
    const attribute = controller.element.getAttribute(attributeName)
    const printed = Array.isArray(value) ? JSON.stringify(value) : value === "" ? '""' : String(value)
    return `${label} ${printed}. has${token.charAt(0).toUpperCase()}${token.slice(1)}Value ${present}. ${label} attribute ${attribute === null ? "absent" : attribute}.`
  }).join(" ")
}
