/*
 * mortgage/borrower_section_controller.js — registered as "mortgage--borrower-section"
 *
 * Teaches: a namespaced subclass. It inherits the base section's required
 * fields, status target, and title value, and adds a residence-history rule:
 * fewer than two years at the current address means the previous address
 * is required too. The same class backs the primary borrower and the
 * co-borrower; each section element gets its own instance.
 */
import SectionController from "./section_controller.js"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default class extends SectionController {
  static targets = ["fullName", "email", "yearsAtAddress", "previousAddress", "previousAddressRow"]

  validate() {
    this.previousAddressRowTarget.hidden = !this.needsPreviousAddress
    super.validate()
  }

  additionalProblems() {
    const problems = []
    const email = this.emailTarget.value.trim()
    if (email !== "" && !EMAIL_PATTERN.test(email)) problems.push("Email address looks incomplete")
    if (this.needsPreviousAddress && this.previousAddressTarget.value.trim() === "") {
      problems.push("Previous address needed for less than 2 years at current address")
    }
    return problems
  }

  get needsPreviousAddress() {
    const years = Number.parseFloat(this.yearsAtAddressTarget.value)
    return Number.isFinite(years) && years < 2
  }

  get borrowerName() {
    return this.fullNameTarget.value.trim()
  }
}
