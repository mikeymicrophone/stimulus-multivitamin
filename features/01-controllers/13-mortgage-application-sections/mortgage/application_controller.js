/*
 * mortgage/application_controller.js — registered as "mortgage--application"
 *
 * Teaches: finding controllers by class instead of by identifier. The
 * sections inside this form are registered under five different
 * identifiers, but they all extend SectionController, so
 * this.application.controllers filtered with instanceof (and limited to
 * this element) finds every one of them, including a co-borrower's
 * sections added from a <template> after page load.
 */
import { Controller } from "@hotwired/stimulus"
import SectionController from "./section_controller.js"
import BorrowerSectionController from "./borrower_section_controller.js"
import IncomeSectionController from "./income_section_controller.js"
import DebtsSectionController from "./debts_section_controller.js"
import LoanSectionController from "./loan_section_controller.js"

const MAXIMUM_DEBT_TO_INCOME = 0.43
const RECOMMENDED_HOUSING_RATIO = 0.28

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const percentFormatter = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 })

export default class extends Controller {
  static targets = [
    "progressList",
    "monthlyPayment",
    "housingRatio",
    "debtToIncomeRatio",
    "decision",
    "submitButton",
    "coBorrowerTemplate",
    "coBorrowerSlot",
    "coBorrower",
    "addCoBorrowerButton",
  ]
  static values = { applicationNumber: String }

  initialize() {
    this.isSubmitted = false
  }

  connect() {
    this.sectionChanged()
  }

  addCoBorrower() {
    if (this.hasCoBorrowerTarget) return
    const coBorrower = this.coBorrowerTemplateTarget.content.firstElementChild.cloneNode(true)
    this.coBorrowerSlotTarget.append(coBorrower)
    coBorrower.querySelector("input").focus()
    this.addCoBorrowerButtonTarget.hidden = true
  }

  removeCoBorrower() {
    if (this.hasCoBorrowerTarget) this.coBorrowerTarget.remove()
    this.addCoBorrowerButtonTarget.hidden = false
  }

  sectionChanged() {
    if (this.isSubmitted) return
    const sections = this.sections
    this.renderProgress(sections)

    const monthlyIncome = this.sumOver(sections, IncomeSectionController, (section) => section.monthlyIncome)
    const monthlyDebts = this.sumOver(sections, DebtsSectionController, (section) => section.monthlyDebtPayments)
    const housingPayment = this.sumOver(sections, LoanSectionController, (section) => section.monthlyHousingPayment)
    const housingRatio = monthlyIncome > 0 ? housingPayment / monthlyIncome : null
    const debtToIncomeRatio = monthlyIncome > 0 ? (housingPayment + monthlyDebts) / monthlyIncome : null

    this.monthlyPaymentTarget.textContent = priceFormatter.format(housingPayment)
    this.housingRatioTarget.textContent = housingRatio === null ? "—" : percentFormatter.format(housingRatio)
    this.debtToIncomeRatioTarget.textContent = debtToIncomeRatio === null ? "—" : percentFormatter.format(debtToIncomeRatio)

    const incompleteCount = sections.filter((section) => !section.isComplete).length
    const isWithinDebtLimit = debtToIncomeRatio !== null && debtToIncomeRatio <= MAXIMUM_DEBT_TO_INCOME
    this.submitButtonTarget.disabled = incompleteCount > 0 || !isWithinDebtLimit

    if (incompleteCount > 0) {
      this.decisionTarget.textContent = `${incompleteCount} ${incompleteCount === 1 ? "section needs" : "sections need"} attention before you can submit.`
    } else if (!isWithinDebtLimit) {
      this.decisionTarget.textContent = `Debt-to-income is above ${percentFormatter.format(MAXIMUM_DEBT_TO_INCOME)}. Add a co-borrower's income, pay down a debt, or lower the loan amount.`
    } else if (housingRatio > RECOMMENDED_HOUSING_RATIO) {
      this.decisionTarget.textContent = `Ready to submit. Housing costs are above the recommended ${percentFormatter.format(RECOMMENDED_HOUSING_RATIO)} of income, so expect extra review.`
    } else {
      this.decisionTarget.textContent = "Ready to submit."
    }
  }

  submitApplication(event) {
    event.preventDefault()
    if (this.submitButtonTarget.disabled) return
    for (const section of this.sections) section.lock()
    this.isSubmitted = true
    this.submitButtonTarget.disabled = true
    this.addCoBorrowerButtonTarget.disabled = true
    for (const removeButton of this.element.querySelectorAll("[data-action~='mortgage--application#removeCoBorrower']")) {
      removeButton.disabled = true
    }
    this.decisionTarget.textContent = `Application ${this.applicationNumberValue} submitted for underwriting.`
  }

  renderProgress(sections) {
    this.progressListTarget.replaceChildren(
      ...sections.map((section) => {
        const progressRow = document.createElement("li")
        const borrowerName = section instanceof BorrowerSectionController && section.borrowerName ? `: ${section.borrowerName}` : ""
        progressRow.textContent = `${section.sectionTitle}${borrowerName} — ${section.isComplete ? "complete" : "needs attention"}`
        progressRow.dataset.sectionState = section.isComplete ? "complete" : "incomplete"
        return progressRow
      })
    )
  }

  sumOver(sections, sectionClass, readAmount) {
    return sections
      .filter((section) => section instanceof sectionClass)
      .reduce((runningTotal, section) => runningTotal + readAmount(section), 0)
  }

  get sections() {
    return this.application.controllers
      .filter((controller) => controller instanceof SectionController && this.element.contains(controller.element))
      .sort((first, second) =>
        first.element.compareDocumentPosition(second.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )
  }
}
