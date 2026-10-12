/*
 * quote_row_controller.js — registered as "quote-row"
 *
 * Teaches: subscribe in connect(), unsubscribe in disconnect(), and keep
 * the function that undoes the subscription. The shared stream hands back
 * an unsubscribe function; holding on to it means disconnect() never has to
 * look anything up. Sorting moves rows (disconnect, then connect) and
 * switching watchlists replaces them, and the stream's short grace period
 * keeps both from closing the socket.
 */
import { Controller } from "@hotwired/stimulus"
import { subscribe } from "./quote_stream.js"

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends Controller {
  static targets = ["price", "change"]
  static values = { symbol: String }

  initialize() {
    this.changePercent = null
    this.lastPrice = null
  }

  connect() {
    this.unsubscribe = subscribe(this.symbolValue, (quote) => this.render(quote))
  }

  disconnect() {
    this.unsubscribe()
    this.unsubscribe = null
  }

  render({ price, changePercent }) {
    if (this.lastPrice !== null && price !== this.lastPrice) {
      this.element.dataset.tick = price > this.lastPrice ? "up" : "down"
    }
    this.lastPrice = price
    this.changePercent = changePercent
    this.priceTarget.textContent = priceFormatter.format(price)
    this.changeTarget.textContent = `${changePercent >= 0 ? "+" : "−"}${Math.abs(changePercent).toFixed(2)}%`
    this.changeTarget.classList.toggle("gain", changePercent >= 0)
    this.changeTarget.classList.toggle("loss", changePercent < 0)
  }
}
