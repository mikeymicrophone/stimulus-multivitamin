/*
 * invoice_controller.js — registered as "invoice"
 *
 * Teaches: controllers that cooperate without knowing each other's markup.
 * The invoice controller owns the whole invoice: adding rows, the tax rate,
 * and the totals. It never reads a row's inputs; it asks each row's
 * "line-item" controller instance for its subtotal through
 * application.getControllerForElementAndIdentifier().
 */
import { Controller } from "@hotwired/stimulus"

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends Controller {
  static targets = [
    "lineItemList",
    "lineItemTemplate",
    "lineItem",
    "taxRate",
    "lineItemCount",
    "subtotal",
    "tax",
    "total",
  ]

  connect() {
    this.recalculate()
  }

  addLineItem() {
    const newLineItem = this.lineItemTemplateTarget.content.firstElementChild.cloneNode(true)
    this.lineItemListTarget.append(newLineItem)
    newLineItem.querySelector("input").focus()
  }

  recalculate() {
    const subtotalInCents = this.lineItemControllers.reduce(
      (runningTotal, lineItem) => runningTotal + lineItem.subtotalInCents,
      0
    )
    const taxInCents = Math.round((subtotalInCents * this.taxRatePercent) / 100)

    this.lineItemCountTarget.textContent = this.describeLineItemCount(this.lineItemTargets.length)
    this.subtotalTarget.textContent = priceFormatter.format(subtotalInCents / 100)
    this.taxTarget.textContent = priceFormatter.format(taxInCents / 100)
    this.totalTarget.textContent = priceFormatter.format((subtotalInCents + taxInCents) / 100)
  }

  // Row controllers connect after this one (on page load and when a row is
  // appended), so some can be missing here. Each row calls recalculate()
  // again as soon as it connects, which fills the gap.
  get lineItemControllers() {
    return this.lineItemTargets
      .map((row) => this.application.getControllerForElementAndIdentifier(row, "line-item"))
      .filter((lineItem) => lineItem !== null)
  }

  get taxRatePercent() {
    const enteredRate = Number.parseFloat(this.taxRateTarget.value)
    return Number.isNaN(enteredRate) || enteredRate < 0 ? 0 : enteredRate
  }

  describeLineItemCount(lineItemCount) {
    if (lineItemCount === 0) return "No line items yet"
    return lineItemCount === 1 ? "1 line item" : `${lineItemCount} line items`
  }
}
