/*
 * request_desk_controller.js — registered as "request-desk"
 *
 * Teaches: slipTargets is not querySelectorAll. The desk element is
 * itself a slip, so it leads the target list and is missing from both
 * queries. An exact attribute selector misses "slip rush". A token
 * selector still sees the nested desk's map, which slipTargets omits.
 * Legacy data-target="request-desk.slip" matches too, after the modern
 * matches, and an element with both attributes is listed twice. The
 * first read warns. A NodeList saved at connect does not grow when a
 * slip is filed; slipTargets does, in the same turn.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slip", "comparison"]

  connect() {
    this.tokenListAtConnect = this.element.querySelectorAll("[data-request-desk-target~='slip']")
  }

  compare() {
    const targets = labels(this.slipTargets)
    const exact = labels(this.element.querySelectorAll('[data-request-desk-target="slip"]'))
    const token = labels(this.element.querySelectorAll("[data-request-desk-target~='slip']"))
    this.comparisonTarget.textContent = `Targets: ${targets}. Exact query: ${exact}. Token query: ${token}.`
  }

  fileTaxLien() {
    const slip = document.createElement("article")
    slip.dataset.slipLabel = "Tax lien"
    slip.textContent = "Tax lien"
    slip.setAttribute("data-request-desk-target", "slip")
    this.element.insertBefore(slip, this.comparisonTarget)
    const targets = labels(this.slipTargets)
    const cached = labels(this.tokenListAtConnect)
    this.comparisonTarget.textContent = `Targets: ${targets}. Token list saved at connect: ${cached}.`
  }
}

function labels(slips) {
  return Array.from(slips).map((slip) => slip.dataset.slipLabel).join(", ")
}
