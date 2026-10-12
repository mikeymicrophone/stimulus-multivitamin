/*
 * simulated_quote_socket.js — not a controller
 *
 * Stands in for `new WebSocket("wss://…/quotes")` so the page runs without a
 * server. It has the same surface the stream uses: readyState, send(),
 * close(), and open/message/close events. Once open, it pushes a quote
 * every second for each symbol it has been asked to subscribe to.
 */
const openingPrices = {
  AAPL: 228.14, AMZN: 186.42, MSFT: 417.9, NVDA: 121.38,
  JNJ: 158.66, KO: 69.25, PG: 167.03, VZ: 41.12,
  COST: 902.5, TSLA: 248.73,
}

export class SimulatedQuoteSocket extends EventTarget {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 3

  constructor() {
    super()
    this.readyState = SimulatedQuoteSocket.CONNECTING
    this.subscribedSymbols = new Set()
    this.tickNumber = 0
    this.handshakeTimer = setTimeout(() => {
      this.readyState = SimulatedQuoteSocket.OPEN
      this.dispatchEvent(new Event("open"))
      this.tickTimer = setInterval(() => this.pushQuotes(), 1000)
    }, 300)
  }

  send(message) {
    const { type, symbol } = JSON.parse(message)
    if (type === "subscribe") this.subscribedSymbols.add(symbol)
    if (type === "unsubscribe") this.subscribedSymbols.delete(symbol)
  }

  close() {
    clearTimeout(this.handshakeTimer)
    clearInterval(this.tickTimer)
    this.readyState = SimulatedQuoteSocket.CLOSED
    this.dispatchEvent(new Event("close"))
  }

  pushQuotes() {
    this.tickNumber += 1
    for (const symbol of this.subscribedSymbols) {
      const openingPrice = openingPrices[symbol] ?? 100
      const symbolPhase = [...symbol].reduce((total, letter) => total + letter.charCodeAt(0), 0)
      const drift = Math.sin((this.tickNumber + symbolPhase) / 3) * 0.012
      const price = Math.round(openingPrice * (1 + drift) * 100) / 100
      const message = new MessageEvent("message", {
        data: JSON.stringify({ symbol, price, changePercent: drift * 100 }),
      })
      this.dispatchEvent(message)
    }
  }
}
