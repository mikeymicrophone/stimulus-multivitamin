/*
 * stream_status_controller.js — registered as "stream-status"
 *
 * Teaches: the same subscribe/unsubscribe pair for a different kind of
 * listener. connect() starts watching the shared stream's status and keeps
 * the function that stops it; disconnect() calls that function.
 */
import { Controller } from "@hotwired/stimulus"
import { watchStatus } from "./quote_stream.js"

const connectionLabels = { open: "Live", connecting: "Connecting…", closed: "Disconnected" }

export default class extends Controller {
  static targets = ["connection", "details"]

  connect() {
    this.stopWatching = watchStatus((status) => this.render(status))
  }

  disconnect() {
    this.stopWatching()
    this.stopWatching = null
  }

  render({ connection, symbolCount, socketOpenCount }) {
    this.element.dataset.connection = connection
    this.connectionTarget.textContent = connectionLabels[connection]
    const symbols = symbolCount === 1 ? "1 symbol" : `${symbolCount} symbols`
    const opened = socketOpenCount === 1 ? "opened once" : `opened ${socketOpenCount} times`
    this.detailsTarget.textContent = `${symbols} · socket ${opened}`
  }
}
