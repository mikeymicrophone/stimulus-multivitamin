/*
 * bin_ticket_controller.js — registered as "bin-ticket"
 *
 * Teaches: the param pattern is data-${identifier}-*-param with no
 * boundary after the identifier. bin-ticket therefore also matches
 * data-bin-ticket-printer-copies-param, and camelizes the captured
 * name to printerCopies. The printer controller, whose identifier is
 * longer, sees that same attribute as copies. select() reads the bin
 * button's own params: a string variety, a number of bushels, a
 * boolean, a JSON crew array, and a lot code whose leading zero keeps
 * it a string. A lot code with no leading zero becomes a number and
 * no longer matches the stamped label. :stop on the bin keeps the
 * shed's click action from running.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slip", "status", "binList", "variety", "bushels", "lotCode", "organic", "crew"]

  readSlip(event) {
    if (event.target.closest("form")) return
    const keys = Object.keys(event.params).sort().join(", ")
    const copies = event.params.copies === undefined ? "missing" : event.params.copies
    this.slipTarget.hidden = false
    this.slipTarget.textContent = `Shed slip keys ${keys}. shedName ${event.params.shedName}. printerCopies ${show(event.params.printerCopies)} (${kindOf(event.params.printerCopies)}). printerTrayName ${event.params.printerTrayName}. copies is ${copies} on bin-ticket.`
  }

  select(event) {
    const { variety, bushels, organic, lotCode, crew } = event.params
    const stamped = event.currentTarget.getAttribute("data-stamped-lot")
    const matches = lotCode === stamped
    const matchText = matches ? "matches" : "does not match"
    const crewText = Array.isArray(crew) ? crew.join(", ") : `not a list`
    this.statusTarget.textContent = `Selected ${variety} (${kindOf(variety)}), ${show(bushels)} bushels (${kindOf(bushels)}), organic ${show(organic)} (${kindOf(organic)}). Lot ${stamped} arrived as ${show(lotCode)} (${kindOf(lotCode)}) and ${matchText} the stamped label. Crew ${crewText} (${kindOf(crew)}). The target was ${event.target.tagName}.`
  }

  receive(event) {
    event.preventDefault()
    const variety = this.varietyTarget.value.trim()
    const bushels = this.bushelsTarget.value.trim()
    const lotCode = this.lotCodeTarget.value.trim()
    const crew = this.crewTarget.value.split(",").map((name) => name.trim()).filter((name) => name !== "")
    if (variety === "" || bushels === "" || lotCode === "") {
      this.statusTarget.textContent = "Variety, bushels, and a lot code are required before a bin can be tagged."
      return
    }
    const button = document.createElement("button")
    button.type = "button"
    button.setAttribute("data-action", "click->bin-ticket#select:stop")
    button.setAttribute("data-bin-ticket-variety-param", JSON.stringify(variety))
    button.setAttribute("data-bin-ticket-bushels-param", bushels)
    button.setAttribute("data-bin-ticket-organic-param", this.organicTarget.checked ? "true" : "false")
    button.setAttribute("data-bin-ticket-lot-code-param", lotCode)
    button.setAttribute("data-bin-ticket-crew-param", JSON.stringify(crew))
    button.setAttribute("data-stamped-lot", lotCode)
    const varietySpan = document.createElement("span")
    varietySpan.className = "variety"
    varietySpan.textContent = variety
    const lotSpan = document.createElement("span")
    lotSpan.className = "lot"
    lotSpan.textContent = `Lot ${lotCode}`
    button.append(varietySpan, document.createTextNode(" "), lotSpan)
    this.binListTarget.append(button)
    this.statusTarget.textContent = `${variety} is on the floor. Claim it from its tag.`
  }
}

function kindOf(value) {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  if (value === undefined) return "missing"
  return typeof value
}

function show(value) {
  if (value === undefined) return "missing"
  if (typeof value === "string") return value
  return String(value)
}
