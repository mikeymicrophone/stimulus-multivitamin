/*
 * mortgage/loan_section_controller.js — registered as "mortgage--loan-section"
 *
 * Teaches: a subclass that owns the domain math for its own fields. The
 * application asks this instance for the monthly housing payment instead
 * of reading the purchase price, rate, and term inputs itself.
 */
import SectionController from "./section_controller.js"

const MINIMUM_DOWN_PAYMENT_SHARE = 0.03

export default class LoanSectionController extends SectionController {
  static targets = ["purchasePrice", "downPayment", "interestRate", "termYears", "annualPropertyTax", "annualInsurance"]

  additionalProblems() {
    const problems = []
    const currencyInputs = [this.purchasePriceTarget, this.downPaymentTarget, this.annualPropertyTaxTarget, this.annualInsuranceTarget]
    if (currencyInputs.some((input) => Number.isNaN(this.dollarAmountOf(input)))) problems.push("Amounts must be in dollars")

    const purchasePrice = this.dollarAmountOf(this.purchasePriceTarget)
    const downPayment = this.dollarAmountOf(this.downPaymentTarget)
    if (purchasePrice > 0 && downPayment !== null && !Number.isNaN(downPayment)) {
      if (downPayment >= purchasePrice) problems.push("Down payment must be less than the purchase price")
      else if (downPayment < purchasePrice * MINIMUM_DOWN_PAYMENT_SHARE) problems.push("Down payment must be at least 3% of the price")
    }

    const ratePercent = Number.parseFloat(this.interestRateTarget.value)
    if (this.interestRateTarget.value !== "" && !(ratePercent > 0 && ratePercent < 20)) {
      problems.push("Interest rate must be between 0% and 20%")
    }
    return problems
  }

  get loanAmount() {
    return Math.max(0, (this.dollarAmountOf(this.purchasePriceTarget) || 0) - (this.dollarAmountOf(this.downPaymentTarget) || 0))
  }

  get monthlyPrincipalAndInterest() {
    const monthlyRate = Number.parseFloat(this.interestRateTarget.value) / 100 / 12
    const paymentCount = Number.parseInt(this.termYearsTarget.value, 10) * 12
    if (!(monthlyRate > 0) || !(paymentCount > 0)) return 0
    return (this.loanAmount * monthlyRate) / (1 - (1 + monthlyRate) ** -paymentCount)
  }

  get monthlyTaxesAndInsurance() {
    const annualTax = this.dollarAmountOf(this.annualPropertyTaxTarget) || 0
    const annualInsurance = this.dollarAmountOf(this.annualInsuranceTarget) || 0
    return (annualTax + annualInsurance) / 12
  }

  get monthlyHousingPayment() {
    return this.monthlyPrincipalAndInterest + this.monthlyTaxesAndInsurance
  }
}
