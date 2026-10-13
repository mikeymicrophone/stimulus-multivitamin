/*
 * finding_card_controller.js — registered as "finding-card"
 *
 * Teaches: finding is an Object. A JSON object reads back with its
 * keys unchanged. Unquoted keys throw SyntaxError. null and a JSON
 * array throw TypeError. The null message reports type "undefined".
 * Transcribe is what reads the card.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slipName", "reading"]
  static values = { finding: Object }

  transcribe() {
    const slipName = this.slipNameTarget.textContent.trim()
    try {
      const finding = this.findingValue
      this.readingTarget.textContent = `${slipName} finding ${JSON.stringify(finding)}. fine ${finding.fine}. mint ${finding.mint}.`
    } catch (error) {
      this.readingTarget.textContent = `${slipName} ${error.name}: ${error.message}`
    }
  }
}
