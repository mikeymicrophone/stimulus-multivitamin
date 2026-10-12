/*
 * cart_line_controller.js — registered as "cart-line"
 *
 * Teaches: one instance per line, and actions that reach only that
 * instance. Every line's − and + buttons say "cart-line#decrement" and
 * "cart-line#increment"; Stimulus calls the instance whose element
 * contains the button. Each of those elements also lists a
 * "shopping-cart#recalculate" action after the line's own, so the line's
 * quantity is already updated when the cart adds up the lines.
 */
import { Controller } from "@hotwired/stimulus"

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends Controller {
  static targets = ["quantityField", "decrementButton", "incrementButton", "subtotal", "stockNote"]
  static values = { unitPriceCents: Number, quantity: Number, stock: Number }

  decrement() {
    this.quantityValue = Math.max(1, this.quantityValue - 1)
  }

  increment() {
    this.quantityValue = Math.min(this.stockValue, this.quantityValue + 1)
  }

  // While the shopper types, an empty or out-of-range field keeps the last
  // good quantity. Leaving the field (change) puts that quantity back in it.
  typeQuantity() {
    const typed = Number(this.quantityFieldTarget.value)
    if (this.quantityFieldTarget.value !== "" && Number.isInteger(typed) && typed >= 1) {
      this.quantityValue = Math.min(typed, this.stockValue)
    }
  }

  settleQuantity() {
    this.quantityFieldTarget.value = this.quantityValue
  }

  quantityValueChanged() {
    if (document.activeElement !== this.quantityFieldTarget) this.quantityFieldTarget.value = this.quantityValue
    this.decrementButtonTarget.disabled = this.quantityValue <= 1
    this.incrementButtonTarget.disabled = this.quantityValue >= this.stockValue
    this.subtotalTarget.textContent = dollars.format(this.subtotalCents / 100)
    this.stockNoteTarget.textContent = this.quantityValue >= this.stockValue ? `Only ${this.stockValue} in stock` : ""
  }

  get subtotalCents() {
    return this.unitPriceCentsValue * this.quantityValue
  }
}
