/*
 * mortgage/section_controller.js — registered as "mortgage--section"
 *
 * Teaches: a namespaced base class. Every section of the application
 * shares this lifecycle: find the surrounding mortgage--application
 * instance on connect, check required fields as you type, report up, and
 * report again on disconnect when a co-borrower is removed. The
 * declarations section uses it as is; the other sections subclass it and
 * add rules through additionalProblems().
 *
 * The surrounding controller is stored as this.mortgageApplication, never
 * this.application, which Stimulus already defines on every controller.
 */
import { Controller } from "@hotwired/stimulus"
import CurrencyFieldController from "../shared/currency_field_controller.js"

export default class SectionController extends Controller {
  static targets = ["requiredField", "status"]
  static values = { title: String }

  connect() {
    const applicationElement = this.element.closest('[data-controller~="mortgage--application"]')
    this.mortgageApplication = applicationElement
      ? this.application.getControllerForElementAndIdentifier(applicationElement, "mortgage--application")
      : null
    this.validate()
  }

  disconnect() {
    if (this.mortgageApplication?.element.isConnected) this.mortgageApplication.sectionChanged()
    this.mortgageApplication = null
  }

  validate() {
    const problems = this.problems
    this.element.dataset.sectionState = problems.length === 0 ? "complete" : "incomplete"
    this.statusTarget.textContent = problems.length === 0 ? "Complete" : problems.join(" · ")
    this.mortgageApplication?.sectionChanged()
  }

  lock() {
    for (const field of this.element.querySelectorAll("input, select, textarea")) field.disabled = true
  }

  // Subclasses return extra problems, such as a down payment below 3%.
  additionalProblems() {
    return []
  }

  dollarAmountOf(input) {
    return CurrencyFieldController.parseAmount(input.value)
  }

  get problems() {
    const missingLabels = this.requiredFieldTargets
      .filter((field) => (field.type === "checkbox" ? !field.checked : field.value.trim() === ""))
      .map((field) => `${labelFor(field)} needed`)
    return [...missingLabels, ...this.additionalProblems()]
  }

  get isComplete() {
    return this.problems.length === 0
  }

  get sectionTitle() {
    return this.titleValue
  }
}

function labelFor(field) {
  return field.dataset.fieldLabel ?? field.name
}
