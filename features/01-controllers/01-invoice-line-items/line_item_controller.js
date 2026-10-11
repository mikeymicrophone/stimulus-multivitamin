/*
 * line_item_controller.js — registered as "line-item"
 *
 * Teaches: one controller instance per element. Every invoice row carries
 * data-controller="line-item", so every row gets its own instance with its
 * own targets and its own subtotal. Rows cloned from the <template> later get
 * a fresh instance automatically; a removed row's instance is disconnected.
 * Each row finds its parent invoice controller instance once, on connect,
 * and asks it to recalculate whenever this row's subtotal changes.
 */
import { Controller } from "@hotwired/stimulus"

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends Controller {
  static targets = ["quantity", "unitPrice", "subtotal"]

  connect() {
    const invoiceElement = this.element.closest('[data-controller~="invoice"]')
    this.invoice = invoiceElement
      ? this.application.getControllerForElementAndIdentifier(invoiceElement, "invoice")
      : null
    this.recalculate()
  }

  disconnect() {
    // When the whole invoice leaves the page, its targets are gone too.
    if (this.invoice?.element.isConnected) this.invoice.recalculate()
    this.invoice = null
  }

  recalculate() {
    this.subtotalTarget.textContent = priceFormatter.format(this.subtotalInCents / 100)
    this.invoice?.recalculate()
  }

  remove() {
    this.element.remove()
  }

  get subtotalInCents() {
    return this.quantity * this.unitPriceInCents
  }

  get quantity() {
    const enteredQuantity = Number.parseInt(this.quantityTarget.value, 10)
    return Number.isNaN(enteredQuantity) || enteredQuantity < 0 ? 0 : enteredQuantity
  }

  get unitPriceInCents() {
    const enteredPrice = Number.parseFloat(this.unitPriceTarget.value)
    return Number.isNaN(enteredPrice) || enteredPrice < 0 ? 0 : Math.round(enteredPrice * 100)
  }
}
