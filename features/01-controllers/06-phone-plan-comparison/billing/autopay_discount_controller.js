/*
 * billing/autopay_discount_controller.js — registered as "billing--autopay-discount"
 *
 * Teaches: namespaces keep identifiers from colliding as an app grows. A
 * "billing" folder and a "plans" folder can each hold their own controllers
 * without inventing prefixes by hand. Values follow the same rule:
 * static values = { perLine: Number } is read from
 * data-billing--autopay-discount-per-line-value.
 */
import { Controller } from "@hotwired/stimulus"

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export default class extends Controller {
  static targets = ["enrollment", "note"]
  static values = { perLine: Number }

  connect() {
    const comparisonElement = this.element.closest('[data-controller~="plans--comparison"]')
    this.comparison = comparisonElement
      ? this.application.getControllerForElementAndIdentifier(comparisonElement, "plans--comparison")
      : null
    this.applyEnrollment()
  }

  disconnect() {
    this.comparison = null
  }

  applyEnrollment() {
    const isEnrolled = this.enrollmentTarget.checked
    this.comparison?.applyAutopayDiscount(isEnrolled ? this.perLineValue : 0)
    this.noteTarget.textContent = isEnrolled
      ? `Saving ${priceFormatter.format(this.perLineValue)} per line with autopay from a checking account.`
      : `Autopay from a checking account takes ${priceFormatter.format(this.perLineValue)} off every line.`
  }
}
