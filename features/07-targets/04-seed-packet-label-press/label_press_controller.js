/*
 * label_press_controller.js — registered as "label-press"
 *
 * Teaches: a target token is the static targets string, not a camelized
 * form of a kebab-case token. variety-name does not match varietyName.
 * A token that was never declared, such as botanical, does not install
 * botanicalTarget. Reading it is undefined. It does not throw the
 * missing-target error. That error is only for a declared name whose
 * element is absent, and only when the singular getter is read.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["varietyName", "daysToHarvest", "warning", "preview"]

  printLabel() {
    const botanicalGetter = typeof this.botanicalTarget
    if (!this.hasVarietyNameTarget || !this.hasDaysToHarvestTarget) {
      let message = "variety name is present"
      try {
        message = this.varietyNameTarget.value
      } catch (error) {
        message = error.message
      }
      this.previewTarget.textContent = `${message}. Botanical getter: ${botanicalGetter}.`
      return
    }
    const warning = this.hasWarningTarget ? this.warningTarget.textContent.trim() : "No warning line."
    this.previewTarget.textContent = `${this.varietyNameTarget.value} · ${this.daysToHarvestTarget.value} days. ${warning}. Botanical getter: ${botanicalGetter}.`
  }
}
