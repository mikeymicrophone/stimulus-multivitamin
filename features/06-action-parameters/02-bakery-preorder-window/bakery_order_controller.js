/*
 * bakery_order_controller.js — registered as "bakery-order"
 *
 * Teaches: param values go through JSON.parse. "2" and "1.5" become
 * numbers, "true" and "false" become booleans, "null" becomes null, and
 * "Caraway rye" stays a string because it is not JSON. "FALSE" stays a
 * string (JSON is case-sensitive). "2e1" becomes 20. A missing attribute
 * is undefined, which is not the same as null.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ticket", "empty"]

  addLoaf(event) {
    this.record(this.loafLine(event.params))
  }

  addSack(event) {
    const pounds = event.params.sackPounds
    this.record(`Sack weight ${pounds} (${kindOf(pounds)}) from the POS code 2e1.`)
  }

  loafLine(params) {
    const note = Object.prototype.hasOwnProperty.call(params, "giftNote")
      ? `Gift note is ${params.giftNote === null ? "null" : params.giftNote} (${kindOf(params.giftNote)}).`
      : "Gift note is missing."
    const flag = Object.prototype.hasOwnProperty.call(params, "nutFree")
      ? `nut-free ${show(params.nutFree)} (${kindOf(params.nutFree)})`
      : `sliced ${show(params.sliced)} (${kindOf(params.sliced)})`
    return `${params.loafName}: quantity ${show(params.quantity)} (${kindOf(params.quantity)}), ${flag}. ${note}`
  }

  record(line) {
    this.emptyTarget.hidden = true
    const item = document.createElement("li")
    item.textContent = line
    this.ticketTarget.append(item)
  }
}

function kindOf(value) {
  if (value === null) return "null"
  if (value === undefined) return "missing"
  return typeof value
}

function show(value) {
  if (value === null) return "null"
  if (typeof value === "string") return value
  return String(value)
}
