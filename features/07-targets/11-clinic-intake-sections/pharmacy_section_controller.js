/*
 * pharmacy_section_controller.js — registered as "pharmacy-section"
 *
 * Teaches: a second subclass inherits the same heading and field
 * targets and adds allergyNote. Its markup uses
 * data-pharmacy-section-target for the inherited names.
 */
import IntakeSectionController from "./intake_section_controller.js"

export default class extends IntakeSectionController {
  static targets = ["allergyNote"]

  summarize() {
    const inherited = this.hasHeadingTarget && this.fieldTargets.length > 0
    super.summarize()
    this.summaryTarget.textContent += ` Allergy note: ${this.allergyNoteTarget.value}. Inherited heading and fields: ${inherited ? "yes" : "no"}.`
  }
}
