/*
 * coat_check_controller.js — registered as "coat-check"
 *
 * Teaches: JSON.parse turns a bare digit string into a number, so the
 * printed tag "482917" is not === event.params.ticketCode. A leading zero
 * is illegal JSON, so "01482" stays the string "01482" and still matches.
 * Wrapping the value in JSON quotes forces a string. A digit string past
 * Number.MAX_SAFE_INTEGER becomes a number and is rounded.
 *
 * The all-digit case is the catalog entry "Action params turn all-digit
 * strings into numbers." This desk shows the leading-zero half of that
 * entry: the zero survives, which Number() would not have allowed.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["result", "empty"]

  claim(event) {
    const printed = event.currentTarget.getAttribute("data-printed-tag")
    const arrived = event.params.ticketCode
    const matches = arrived === printed
    const matchText = matches ? "matches the printed tag" : "does not match the printed tag"
    this.emptyTarget.hidden = true
    this.resultTarget.hidden = false
    this.resultTarget.textContent = `Tag ${printed} arrived as ${show(arrived)} (${kindOf(arrived)}) and ${matchText}.`
  }
}

function kindOf(value) {
  if (value === null) return "null"
  return typeof value
}

function show(value) {
  if (typeof value === "string") return value
  return String(value)
}
