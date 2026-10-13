/*
 * moorage_bill_controller.js — registered as "moorage-bill"
 *
 * Teaches: the target attribute is exactly data-moorage-bill-target.
 * data-moorage-bill-ledger-target is a different attribute, even though
 * the identifier moorage-bill is a prefix of moorage-bill-ledger. The
 * slip fee input carries both attributes on purpose. The $999 field
 * carries only the ledger attribute and is not a slipFee target.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slipFee", "powerFee", "total", "note"]

  postMonth() {
    const due = amount(this.slipFeeTarget.value) + amount(this.powerFeeTarget.value)
    this.totalTarget.textContent = money(due)
    this.noteTarget.textContent = `Slip fee fields on this bill: ${this.slipFeeTargets.length}. Due ${money(due)}.`
  }
}

function amount(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function money(value) {
  return `$${value.toFixed(2)}`
}
