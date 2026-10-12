/*
 * box_office_controller.js — registered as "box-office"
 *
 * Teaches: the Charge card link uses click->box-office#charge:prevent:once.
 * :prevent cancels the link's navigation before charge() runs, and :once is
 * a native listener option, so a second click never reaches the method.
 */
import { Controller } from "@hotwired/stimulus"

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends Controller {
  static targets = [
    "section", "quantity", "program", "drinkVoucher",
    "total", "receipt", "status",
  ]
  static values = {
    orderNumber: { type: String, default: "HL-1842" },
  }

  connect() {
    this.chargeCount = 0
    this.renderTotal()
  }

  updateTotals() {
    this.renderTotal()
    this.statusTarget.textContent = "Ticket mix updated. The card has not been charged."
  }

  charge(event) {
    this.chargeCount += 1
    const lines = [
      `${this.quantity} ${this.selectedSection.dataset.sectionLabel} ${this.quantity === 1 ? "ticket" : "tickets"} for Night Heron`,
    ]
    if (this.programTarget.checked) lines.push("a printed program")
    if (this.drinkVoucherTarget.checked) lines.push("an intermission drink voucher")
    this.receiptTarget.hidden = false
    this.receiptTarget.textContent = `${lines.join(", ")} — ${dollars.format(this.totalCents / 100)}. Order ${this.orderNumberValue}. Charged once.`
    this.statusTarget.textContent = `Card charged (defaultPrevented=${event.defaultPrevented}). :once already removed the listener, so a second click will not run charge() (charges this visit: ${this.chargeCount}).`
  }

  renderTotal() {
    this.totalTarget.textContent = dollars.format(this.totalCents / 100)
  }

  get selectedSection() {
    return this.sectionTargets.find((sectionRadio) => sectionRadio.checked) ?? this.sectionTargets[0]
  }

  get quantity() {
    const quantity = Math.round(Number(this.quantityTarget.value))
    return Number.isFinite(quantity) ? Math.min(Math.max(quantity, 1), Number(this.quantityTarget.max)) : 1
  }

  get totalCents() {
    let total = this.quantity * Number(this.selectedSection.dataset.priceCents)
    if (this.programTarget.checked) total += Number(this.programTarget.dataset.priceCents)
    if (this.drinkVoucherTarget.checked) total += Number(this.drinkVoucherTarget.dataset.priceCents)
    return total
  }
}
