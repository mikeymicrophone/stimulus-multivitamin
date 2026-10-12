/*
 * insurance_quote_controller.js — registered as "insurance-quote"
 *
 * Teaches: a parent that works whichever side connects first. connect()
 * collects coverages that connected before it (they do when this
 * controller is code-split), and coverages that connect later join it
 * themselves. The registry is a Set, so a coverage found both ways is only
 * counted once. Recalculation is batched in a microtask, so a page load that
 * adds four coverages renders the summary once. When the whole quote is
 * replaced, Stimulus disconnects this controller before its coverages, so
 * disconnect() stops accepting them and leaveQuote() tolerates late calls.
 */
import { Controller } from "@hotwired/stimulus"
import { recordLifecycle } from "./lifecycle_log.js"

const premiumFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export default class extends Controller {
  static targets = ["coverage", "coverageList", "coverageTemplate", "addCoverageChoice", "lineItems", "annualTotal", "monthlyTotal", "status"]
  static values = { quoteName: String }

  initialize() {
    this.coverages = new Set()
    this.recalculationQueued = false
    this.acceptingCoverages = false
  }

  connect() {
    this.acceptingCoverages = true
    const alreadyConnected = this.coverageTargets
      .map((element) => this.application.getControllerForElementAndIdentifier(element, "coverage-option"))
      .filter((coverage) => coverage !== null)
    for (const coverage of alreadyConnected) coverage.joinQuote(this)
    recordLifecycle(`insurance-quote connected · ${this.quoteNameValue} · found ${alreadyConnected.length} coverages already connected`)
    this.statusTarget.textContent = ""
    this.queueRecalculation()
  }

  disconnect() {
    recordLifecycle(`insurance-quote disconnected · ${this.quoteNameValue}`)
    this.acceptingCoverages = false
    this.coverages.clear()
  }

  addCoverage(coverage) {
    if (!this.acceptingCoverages) return
    this.coverages.add(coverage)
    this.queueRecalculation()
  }

  leaveQuote(coverage) {
    if (!this.acceptingCoverages) return
    this.coverages.delete(coverage)
    this.queueRecalculation()
  }

  addRider() {
    const choice = this.addCoverageChoiceTarget.selectedOptions[0]
    const rider = this.coverageTemplateTargets.find((template) => template.dataset.coverageName === choice.value)
    if (!rider) return
    this.coverageListTarget.append(rider.content.firstElementChild.cloneNode(true))
    choice.disabled = true
    this.addCoverageChoiceTarget.value = ""
  }

  coverageTargetDisconnected(element) {
    const riderChoice = [...this.addCoverageChoiceTarget.options].find((option) => option.value === element.dataset.coverageOptionCoverageNameValue)
    if (riderChoice) riderChoice.disabled = false
  }

  async startQuote({ params: { quoteUrl } }) {
    try {
      const response = await fetch(quoteUrl)
      if (!response.ok) throw new Error(`The rating service answered ${response.status}`)
      const newQuote = document.createElement("template")
      newQuote.innerHTML = (await response.text()).trim()
      this.element.replaceWith(newQuote.content)
    } catch (error) {
      this.statusTarget.textContent = error.message
    }
  }

  queueRecalculation() {
    if (this.recalculationQueued) return
    this.recalculationQueued = true
    queueMicrotask(() => {
      this.recalculationQueued = false
      if (this.acceptingCoverages) this.renderSummary()
    })
  }

  renderSummary() {
    const orderedCoverages = this.coverageTargets
      .map((element) => [...this.coverages].find((coverage) => coverage.element === element))
      .filter((coverage) => coverage !== undefined)
    this.lineItemsTarget.replaceChildren(...orderedCoverages.map((coverage) => {
      const lineItem = document.createElement("li")
      lineItem.textContent = `${coverage.coverageNameValue} (${coverage.limitDescription}): ${premiumFormatter.format(coverage.annualPremium)}`
      return lineItem
    }))
    const annualPremium = orderedCoverages.reduce((total, coverage) => total + coverage.annualPremium, 0)
    this.annualTotalTarget.textContent = premiumFormatter.format(annualPremium)
    this.monthlyTotalTarget.textContent = `${premiumFormatter.format(Math.round(annualPremium / 12))} a month`
  }
}
