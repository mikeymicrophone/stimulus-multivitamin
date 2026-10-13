/*
 * tide_log_controller.js — registered as "tide-log"
 *
 * Teaches: data-action listens for the full event name.
 * tide-staff:posted and tide-staff:line-changed are
 * different events. gauge-card:posted is a third.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.entries = []
    this.render("The log is open.")
  }

  filePosted(event) {
    this.entries.push(`${event.type} ${event.detail.station} ${event.detail.feet} ft`)
    this.render("filed")
  }

  fileLine(event) {
    this.entries.push(`${event.type} ${event.detail.line}`)
    this.render("filed")
  }

  fileGauge(event) {
    this.entries.push(`${event.type} ${event.detail.station} ${event.detail.feet} ft`)
    this.render("filed")
  }

  render(reason) {
    const body = this.entries.length ? this.entries.join(". ") + "." : "No entries."
    this.readingTarget.textContent = `${body} ${reason}`
  }
}
