/*
 * quote_stream.js — not a controller
 *
 * One socket shared by every controller on the page. subscribe() returns
 * the function that undoes it, so a controller's disconnect() only has to
 * call what connect() was given. The socket opens for the first subscriber.
 * When a symbol (or the whole socket) loses its last subscriber, cleanup
 * waits a moment, because a moved row or a swapped list unsubscribes and
 * resubscribes within the same task. The last quote for each symbol is kept
 * and replayed to new subscribers, so a freshly connected row isn't blank.
 */
import { SimulatedQuoteSocket } from "./simulated_quote_socket.js"

const cleanupDelayMilliseconds = 1000
const listenersBySymbol = new Map()
const latestQuotes = new Map()
const statusListeners = new Set()
let socket = null
let socketOpenCount = 0
let cleanupTimer = null

export function subscribe(symbol, quoteListener) {
  ensureSocket()
  if (!listenersBySymbol.has(symbol)) {
    listenersBySymbol.set(symbol, new Set())
    sendWhenOpen({ type: "subscribe", symbol })
  }
  listenersBySymbol.get(symbol).add(quoteListener)
  if (latestQuotes.has(symbol)) quoteListener(latestQuotes.get(symbol))
  notifyStatus()

  return function unsubscribe() {
    listenersBySymbol.get(symbol)?.delete(quoteListener)
    scheduleCleanup()
  }
}

export function watchStatus(statusListener) {
  statusListeners.add(statusListener)
  statusListener(currentStatus())
  return function stopWatching() {
    statusListeners.delete(statusListener)
  }
}

function ensureSocket() {
  if (socket !== null) return
  socket = new SimulatedQuoteSocket()
  socketOpenCount += 1
  socket.addEventListener("open", () => {
    for (const symbol of listenersBySymbol.keys()) socket.send(JSON.stringify({ type: "subscribe", symbol }))
    notifyStatus()
  })
  socket.addEventListener("message", ({ data }) => {
    const quote = JSON.parse(data)
    latestQuotes.set(quote.symbol, quote)
    for (const quoteListener of listenersBySymbol.get(quote.symbol) ?? []) quoteListener(quote)
  })
  notifyStatus()
}

function sendWhenOpen(message) {
  if (socket?.readyState === SimulatedQuoteSocket.OPEN) socket.send(JSON.stringify(message))
}

function scheduleCleanup() {
  clearTimeout(cleanupTimer)
  cleanupTimer = setTimeout(() => {
    cleanupTimer = null
    for (const [symbol, quoteListeners] of listenersBySymbol) {
      if (quoteListeners.size > 0) continue
      listenersBySymbol.delete(symbol)
      latestQuotes.delete(symbol)
      sendWhenOpen({ type: "unsubscribe", symbol })
    }
    if (listenersBySymbol.size === 0 && socket !== null) {
      socket.close()
      socket = null
    }
    notifyStatus()
  }, cleanupDelayMilliseconds)
}

function currentStatus() {
  const connection = socket === null ? "closed" : socket.readyState === SimulatedQuoteSocket.OPEN ? "open" : "connecting"
  return { connection, symbolCount: listenersBySymbol.size, socketOpenCount }
}

function notifyStatus() {
  const status = currentStatus()
  for (const statusListener of statusListeners) statusListener(status)
}
