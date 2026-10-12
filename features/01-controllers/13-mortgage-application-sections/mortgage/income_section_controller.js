/*
 * mortgage/income_section_controller.js — registered as "mortgage--income-section"
 *
 * Teaches: a subclass that adds a public getter for the parent to read. The
 * application totals monthlyIncome across every income section on the page,
 * including the co-borrower's when one is added, by checking each section
 * instance with instanceof rather than by identifier.
 */
import SectionController from "./section_controller.js"

export default class IncomeSectionController extends SectionController {
  static targets = ["baseMonthlyIncome", "otherMonthlyIncome"]

  additionalProblems() {
    const problems = []
    const baseIncome = this.dollarAmountOf(this.baseMonthlyIncomeTarget)
    const otherIncome = this.dollarAmountOf(this.otherMonthlyIncomeTarget)
    if (Number.isNaN(baseIncome) || Number.isNaN(otherIncome)) problems.push("Income must be a dollar amount")
    if (baseIncome === 0) problems.push("Base monthly income must be more than $0")
    return problems
  }

  get monthlyIncome() {
    const baseIncome = this.dollarAmountOf(this.baseMonthlyIncomeTarget)
    const otherIncome = this.dollarAmountOf(this.otherMonthlyIncomeTarget)
    return [baseIncome, otherIncome].reduce(
      (runningTotal, amount) => (amount === null || Number.isNaN(amount) ? runningTotal : runningTotal + amount),
      0
    )
  }
}
