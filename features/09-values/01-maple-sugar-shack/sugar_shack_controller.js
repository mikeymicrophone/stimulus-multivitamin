/*
 * sugar_shack_controller.js — registered as "sugar-shack"
 *
 * Teaches: static values declares lotCode and evaporatorName as
 * Strings. The attributes are data-sugar-shack-lot-code-value and
 * data-sugar-shack-evaporator-name-value. A missing string reads as
 * "" and hasEvaporatorNameValue is false. Assigning
 * evaporatorNameValue writes the attribute before this method paints.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["lot", "evaporator", "reading", "panName"]
  static values = {
    lotCode: String,
    evaporatorName: String
  }

  connect() {
    this.render()
  }

  moveToNamedPan() {
    const panName = this.panNameTarget.value.trim()
    if (!panName) return
    this.evaporatorNameValue = panName
    this.render()
  }

  render() {
    const lotAttribute = this.element.getAttribute("data-sugar-shack-lot-code-value")
    const panAttribute = this.element.getAttribute("data-sugar-shack-evaporator-name-value")
    this.lotTarget.textContent = this.lotCodeValue
    this.evaporatorTarget.textContent = this.hasEvaporatorNameValue ? this.evaporatorNameValue : "(unnamed)"
    this.readingTarget.textContent = [
      `Lot ${this.lotCodeValue}.`,
      `hasLotCodeValue ${this.hasLotCodeValue}.`,
      `Lot attribute ${lotAttribute === null ? "absent" : lotAttribute}.`,
      `Evaporator ${this.hasEvaporatorNameValue ? this.evaporatorNameValue : "(unnamed)"}.`,
      `hasEvaporatorNameValue ${this.hasEvaporatorNameValue}.`,
      `Evaporator attribute ${panAttribute === null ? "absent" : panAttribute}.`
    ].join(" ")
  }
}
