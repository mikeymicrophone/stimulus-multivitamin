/*
 * lot_countdown_controller.js — registered as "lot-countdown"
 *
 * Teaches: what runs once per instance and what runs on every connection.
 * initialize() turns the server's "closes in N seconds" into a deadline
 * exactly once. connect() renders and starts a one-second interval, and
 * disconnect() clears it, so a lot that is hidden, withdrawn, or closed
 * stops ticking. The clock reads the deadline on every tick instead of
 * counting down a number, so a lot that comes back after being hidden shows
 * the right time straight away.
 */
import { Controller } from "@hotwired/stimulus"

const bidFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export default class extends Controller {
  static targets = ["timeRemaining", "currentBid", "bidCount", "placeBidButton", "status"]
  static values = {
    lotNumber: Number,
    closesInSeconds: Number,
    extensionSeconds: { type: Number, default: 30 },
    currentBid: Number,
    bidIncrement: Number,
    bidCount: Number,
  }

  initialize() {
    // The server sends seconds remaining, not a timestamp, so a client with
    // a wrong clock still sees the right countdown. If this ran in
    // connect(), hiding and re-showing the lot would restart its clock.
    this.closesAt = Date.now() + this.closesInSecondsValue * 1000
    this.clockTimer = null
  }

  connect() {
    // Kept for disconnect(): once this element is detached, closest() can't
    // reach the catalog and a bubbling event would never arrive there.
    this.catalogElement = this.element.closest('[data-controller~="auction-catalog"]')
    this.render()
    if (!this.isClosed) this.startClock()
  }

  disconnect() {
    this.stopClock()
  }

  placeBid() {
    if (this.isClosed) return
    this.currentBidValue += this.bidIncrementValue
    this.bidCountValue += 1

    const extensionInMilliseconds = this.extensionSecondsValue * 1000
    const extended = this.closesAt - Date.now() < extensionInMilliseconds
    if (extended) this.closesAt = Date.now() + extensionInMilliseconds

    this.render()
    this.statusTarget.textContent = extended
      ? `Your bid came in the final ${this.extensionSecondsValue} seconds, so the lot is extended.`
      : "You are the high bidder."
  }

  tick() {
    this.render()
    if (this.isClosed) {
      this.stopClock()
      this.closeLot()
    }
  }

  startClock() {
    if (this.clockTimer !== null) return
    this.clockTimer = setInterval(() => this.tick(), 1000)
    this.announce("clock-started")
  }

  stopClock() {
    if (this.clockTimer === null) return
    clearInterval(this.clockTimer)
    this.clockTimer = null
    this.announce("clock-stopped")
  }

  closeLot() {
    this.element.classList.add("closed")
    this.placeBidButtonTarget.disabled = true
    this.statusTarget.textContent = this.bidCountValue > 0
      ? `Sold for ${bidFormatter.format(this.currentBidValue)}.`
      : "Passed. No bids met the reserve."
  }

  render() {
    const secondsRemaining = this.secondsRemaining
    const minutes = Math.floor(secondsRemaining / 60)
    const seconds = String(secondsRemaining % 60).padStart(2, "0")
    this.timeRemainingTarget.textContent = `${minutes}:${seconds}`
    this.element.classList.toggle("closing-soon", secondsRemaining > 0 && secondsRemaining <= this.extensionSecondsValue)
    this.currentBidTarget.textContent = bidFormatter.format(this.currentBidValue)
    this.bidCountTarget.textContent = this.bidCountValue === 1 ? "1 bid" : `${this.bidCountValue} bids`
    this.placeBidButtonTarget.textContent = `Bid ${bidFormatter.format(this.currentBidValue + this.bidIncrementValue)}`
    if (this.isClosed && !this.element.classList.contains("closed")) this.closeLot()
  }

  announce(eventName) {
    if (this.catalogElement) {
      this.dispatch(eventName, { target: this.catalogElement, detail: { lotNumber: this.lotNumberValue } })
    }
  }

  get secondsRemaining() {
    return Math.max(0, Math.ceil((this.closesAt - Date.now()) / 1000))
  }

  get isClosed() {
    return this.secondsRemaining === 0
  }
}
