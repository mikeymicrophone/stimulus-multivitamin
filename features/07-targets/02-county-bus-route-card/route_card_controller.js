/*
 * route_card_controller.js — registered as "route-card"
 *
 * Teaches: one element can carry several target names. The Port Orchard
 * stop is data-route-card-target="stop terminus", so it is in
 * stopTargets and it is terminusTarget, the same node. terminusTarget
 * is the first terminus in the document, not "the" end of the line.
 * Flagging Harper, which sits higher in the card, makes Harper the
 * singular terminus. There is no warning when two stops carry the token.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["stop", "terminus", "summary"]

  connect() {
    this.render()
  }

  renameEnd() {
    this.terminusTarget.textContent = "Port Orchard Transit Center"
    this.render()
  }

  flagHarper() {
    const harper = this.stopTargets.find((stop) => stop.dataset.stopName === "Harper")
    const tokens = new Set(harper.getAttribute("data-route-card-target").split(/\s+/))
    tokens.add("terminus")
    harper.setAttribute("data-route-card-target", [...tokens].join(" "))
    this.render()
  }

  render() {
    const stops = this.stopTargets.map((stop) => stop.textContent.trim())
    const end = this.terminusTarget.textContent.trim()
    const shared = this.stopTargets.includes(this.terminusTarget) ? "yes" : "no"
    this.summaryTarget.textContent = `Stops: ${stops.join(", ")}. End of the line: ${end}. Shared with the stop list: ${shared}.`
  }
}
