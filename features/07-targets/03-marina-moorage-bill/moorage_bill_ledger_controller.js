/*
 * moorage_bill_ledger_controller.js — registered as "moorage-bill-ledger"
 *
 * Teaches: a second controller on the same element reads its own
 * targets. The slip fee input is this controller's charge target and
 * the bill's slipFee target, via two attributes on one element. The
 * posted-on field is only a ledger target.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["charge", "postedOn", "ledgerNote"]

  postMonth() {
    this.ledgerNoteTarget.textContent = `Ledger charge ${money(amount(this.chargeTarget.value))} posted ${this.postedOnTarget.value}.`
  }
}

function amount(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function money(value) {
  return `$${value.toFixed(2)}`
}
