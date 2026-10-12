/*
 * coverage_option_controller.js — registered as "coverage-option"
 *
 * Teaches: a child that can't assume its parent is there. On a normal page
 * load the insurance-quote connects first and each coverage joins it from
 * connect(). When the quote's controller is code-split and registered
 * later, the coverages connect first, find no quote, and wait for the quote
 * to come and collect them. Either way the coverage keeps the quote it
 * joined, because disconnect() may run when closest() can no longer find it.
 */
import { Controller } from "@hotwired/stimulus"
import { recordLifecycle } from "./lifecycle_log.js"

const premiumFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export default class extends Controller {
  static targets = ["limit", "premium"]
  static values = { coverageName: String }

  connect() {
    const quote = this.findQuote()
    if (quote) {
      this.joinQuote(quote)
      recordLifecycle(`coverage-option connected · ${this.coverageNameValue} · joined the quote`)
    } else {
      this.quote = null
      recordLifecycle(`coverage-option connected · ${this.coverageNameValue} · no quote yet`)
    }
    this.render()
  }

  disconnect() {
    const quoteState = this.quote === null ? "never joined a quote" : this.quote.acceptingCoverages ? "left the quote" : "quote already disconnected"
    recordLifecycle(`coverage-option disconnected · ${this.coverageNameValue} · ${quoteState}`)
    this.quote?.leaveQuote(this)
    this.quote = null
  }

  joinQuote(quote) {
    this.quote = quote
    quote.addCoverage(this)
  }

  limitChanged() {
    this.render()
    this.quote?.queueRecalculation()
  }

  remove() {
    this.element.remove()
  }

  render() {
    this.premiumTarget.textContent = `${premiumFormatter.format(this.annualPremium)} a year`
  }

  findQuote() {
    const quoteElement = this.element.closest('[data-controller~="insurance-quote"]')
    return quoteElement ? this.application.getControllerForElementAndIdentifier(quoteElement, "insurance-quote") : null
  }

  get selectedLimit() {
    return this.limitTarget.selectedOptions[0]
  }

  get annualPremium() {
    return Number(this.selectedLimit.dataset.annualPremium)
  }

  get limitDescription() {
    return this.selectedLimit.textContent.trim()
  }
}
