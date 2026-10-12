/*
 * shared/currency_field_controller.js — registered as "shared--currency-field"
 *
 * Teaches: a tiny controller that lives on an <input> that is also another
 * controller's target. It only formats dollar amounts as you leave the
 * field and flags text that isn't money. The parsing rule is a static
 * method, so section controllers can use the same rule on any input
 * without needing this instance to be connected first.
 */
import { Controller } from "@hotwired/stimulus"

const dollarFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default class CurrencyFieldController extends Controller {
  static parseAmount(enteredText) {
    const normalized = enteredText.replace(/[$,\s]/g, "")
    if (normalized === "") return null
    const amount = Number(normalized)
    return Number.isFinite(amount) && amount >= 0 ? amount : Number.NaN
  }

  connect() {
    this.format()
  }

  format() {
    const amount = this.amount
    if (Number.isNaN(amount)) {
      this.element.setAttribute("aria-invalid", "true")
      return
    }
    this.element.removeAttribute("aria-invalid")
    if (amount !== null) this.element.value = dollarFormatter.format(amount)
  }

  unformat() {
    const amount = this.amount
    if (amount === null || Number.isNaN(amount)) return
    this.element.value = String(amount)
    // Replacing the value drops the selection the browser made on focus.
    this.element.select()
  }

  get amount() {
    return CurrencyFieldController.parseAmount(this.element.value)
  }
}
