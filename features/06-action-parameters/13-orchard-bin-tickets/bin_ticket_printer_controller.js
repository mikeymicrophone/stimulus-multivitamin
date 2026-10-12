/*
 * bin_ticket_printer_controller.js — registered as "bin-ticket-printer"
 *
 * Teaches: the print action is declared on the shed, so it reads
 * data-bin-ticket-printer-*-param from the shed. copies and tray-name
 * are its keys. shedName belongs to bin-ticket and is missing here,
 * and the shorter identifier's printerCopies name is not this
 * controller's key. keydown.ctrl+p and keydown.meta+p use :prevent so
 * the browser print dialog does not open.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["batch"]

  printBatch(event) {
    const keys = Object.keys(event.params).sort().join(", ")
    const shedName = event.params.shedName === undefined ? "missing" : event.params.shedName
    this.batchTarget.hidden = false
    this.batchTarget.textContent = `Print batch keys ${keys}. copies ${show(event.params.copies)} (${kindOf(event.params.copies)}). trayName ${event.params.trayName}. shedName is ${shedName} on bin-ticket-printer.`
  }
}

function kindOf(value) {
  if (value === null) return "null"
  if (value === undefined) return "missing"
  return typeof value
}

function show(value) {
  if (value === undefined) return "missing"
  if (typeof value === "string") return value
  return String(value)
}
