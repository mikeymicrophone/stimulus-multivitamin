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
import { report, rawAttribute } from "../../../assets/readout.js"

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

  // A blank String value is "", so has*Value is the only way to tell a
  // missing pan from a pan named nothing.
  get evaporatorLabel() {
    return this.hasEvaporatorNameValue ? this.evaporatorNameValue : "(unnamed)"
  }

  render() {
    this.lotTarget.textContent = this.lotCodeValue
    this.evaporatorTarget.textContent = this.evaporatorLabel
    report(
      this.readingTarget,
      `Lot ${this.lotCodeValue}.`,
      `hasLotCodeValue ${this.hasLotCodeValue}.`,
      `Lot attribute ${rawAttribute(this, "lotCode")}.`,
      `Evaporator ${this.evaporatorLabel}.`,
      `hasEvaporatorNameValue ${this.hasEvaporatorNameValue}.`,
      `Evaporator attribute ${rawAttribute(this, "evaporatorName")}.`
    )
  }
}
