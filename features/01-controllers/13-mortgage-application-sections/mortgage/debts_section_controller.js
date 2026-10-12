/*
 * mortgage/debts_section_controller.js — registered as "mortgage--debts-section"
 *
 * Teaches: a subclass with a plural target. Every monthly payment input is a
 * "payment" target, so adding another debt line to the markup needs no code
 * change; monthlyDebtPayments sums whatever payment targets exist.
 */
import SectionController from "./section_controller.js"

export default class DebtsSectionController extends SectionController {
  static targets = ["payment"]

  additionalProblems() {
    const hasInvalidAmount = this.paymentTargets.some((payment) => Number.isNaN(this.dollarAmountOf(payment)))
    return hasInvalidAmount ? ["Monthly payments must be dollar amounts"] : []
  }

  get monthlyDebtPayments() {
    return this.paymentTargets.reduce((runningTotal, payment) => {
      const amount = this.dollarAmountOf(payment)
      return amount === null || Number.isNaN(amount) ? runningTotal : runningTotal + amount
    }, 0)
  }
}
