/*
 * insurance_section_controller.js — registered as "insurance-section"
 *
 * Teaches: static targets are inherited. This class adds memberId and
 * keeps heading, field, and summary. The attribute is
 * data-insurance-section-target, not data-intake-section-target. The
 * stray heading stamped with the parent attribute is in the section
 * and is not headingTarget.
 */
import IntakeSectionController from "./intake_section_controller.js"

export default class extends IntakeSectionController {
  static targets = ["memberId"]

  summarize() {
    const inherited = this.hasHeadingTarget && this.fieldTargets.length > 0
    const stray = this.element.querySelector("[data-intake-section-target='heading']")
    super.summarize()
    this.summaryTarget.textContent += ` Member id ${this.memberIdTarget.value}. Inherited heading and fields: ${inherited ? "yes" : "no"}. Stray parent heading ignored: ${stray.textContent.trim()}.`
  }
}
