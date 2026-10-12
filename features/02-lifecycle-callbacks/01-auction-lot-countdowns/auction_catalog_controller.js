/*
 * auction_catalog_controller.js — registered as "auction-catalog"
 *
 * Teaches: the difference between bringing an element back and replacing
 * it. "Closing within a minute" detaches lots and later re-inserts the same
 * elements, so each one reconnects to its existing lot-countdown instance
 * and initialize() does not run again. Relisting a withdrawn lot inserts new
 * server HTML, so Stimulus builds a new instance and initialize() runs with
 * the server's new closing time. The catalog counts running clocks from the
 * events each lot fires when its clock starts and stops.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["lotList", "lot", "withdrawnList", "withdrawnLotTemplate", "clockSummary", "filterSummary", "allLotsButton", "closingSoonButton"]
  static values = { closingSoonSeconds: { type: Number, default: 60 } }

  initialize() {
    this.tickingLotNumbers = new Set()
    this.hiddenLots = []
  }

  connect() {
    this.renderClockSummary()
  }

  clockStarted({ detail: { lotNumber } }) {
    this.tickingLotNumbers.add(lotNumber)
    this.renderClockSummary()
  }

  clockStopped({ detail: { lotNumber } }) {
    this.tickingLotNumbers.delete(lotNumber)
    this.renderClockSummary()
  }

  showClosingSoon() {
    for (const lot of this.lotTargets) {
      const lotCountdown = this.lotCountdownFor(lot)
      if (lotCountdown && lotCountdown.secondsRemaining > this.closingSoonSecondsValue) {
        this.hiddenLots.push(lot)
        lot.remove()
      }
    }
    this.renderFilter(true)
  }

  showAllLots() {
    for (const lot of this.hiddenLots) this.insertInLotOrder(lot)
    this.hiddenLots = []
    this.renderFilter(false)
  }

  withdrawLot(event) {
    const lot = event.target.closest('[data-auction-catalog-target="lot"]')
    const withdrawnEntry = this.withdrawnLotTemplateTarget.content.firstElementChild.cloneNode(true)
    withdrawnEntry.querySelector("[data-lot-heading]").textContent = lot.querySelector("h3").textContent
    withdrawnEntry.querySelector("button").dataset.auctionCatalogLotNumberParam = lot.dataset.lotCountdownLotNumberValue
    this.withdrawnListTarget.append(withdrawnEntry)
    lot.remove()
  }

  async relistLot({ params: { lotNumber }, currentTarget: relistButton }) {
    relistButton.disabled = true
    try {
      const response = await fetch(`relisted/lot-${lotNumber}.html`)
      if (!response.ok) throw new Error(`The catalog server answered ${response.status}`)
      const fragment = document.createElement("template")
      fragment.innerHTML = (await response.text()).trim()
      this.insertInLotOrder(fragment.content.firstElementChild)
      relistButton.closest("li").remove()
    } catch (error) {
      relistButton.disabled = false
      relistButton.closest("li").querySelector("[data-relist-error]").textContent = error.message
    }
  }

  insertInLotOrder(lot) {
    const lotNumber = Number(lot.dataset.lotCountdownLotNumberValue)
    const followingLot = this.lotTargets.find((other) => Number(other.dataset.lotCountdownLotNumberValue) > lotNumber)
    this.lotListTarget.insertBefore(lot, followingLot ?? null)
  }

  renderClockSummary() {
    const tickingCount = this.tickingLotNumbers.size
    this.clockSummaryTarget.textContent = tickingCount === 1 ? "1 clock ticking" : `${tickingCount} clocks ticking`
  }

  renderFilter(closingSoonOnly) {
    this.allLotsButtonTarget.setAttribute("aria-pressed", String(!closingSoonOnly))
    this.closingSoonButtonTarget.setAttribute("aria-pressed", String(closingSoonOnly))
    const hiddenCount = this.hiddenLots.length
    this.filterSummaryTarget.textContent = closingSoonOnly
      ? `${hiddenCount} ${hiddenCount === 1 ? "lot" : "lots"} hidden`
      : ""
  }

  // Lots inserted a moment ago may not have connected yet.
  lotCountdownFor(lot) {
    return this.application.getControllerForElementAndIdentifier(lot, "lot-countdown")
  }
}
