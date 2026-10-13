/*
 * intake_section_controller.js — registered as "intake-section"
 *
 * Teaches: heading, field, and summary are the base targets. Subclasses
 * inherit these names. Nothing on this page uses the intake-section
 * identifier. A subclass still reads the names, through its own
 * data-${identifier}-target attribute.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["heading", "field", "summary"]

  summarize() {
    const heading = this.headingTarget.textContent.trim()
    const fields = this.fieldTargets.map((field) => `${field.dataset.fieldLabel}: ${field.value.trim()}`).join("; ")
    this.summaryTarget.textContent = `${heading} — ${fields}.`
  }
}
