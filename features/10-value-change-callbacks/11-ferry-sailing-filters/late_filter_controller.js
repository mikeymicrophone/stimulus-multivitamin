/*
 * late_filter_controller.js — registered as "late-filter"
 *
 * Teaches: restoring from connect() is too late. The changed callbacks
 * have already written this card's markup into the hash. connect()
 * then reads that hash back and reports the markup, not the hash the
 * page was opened with.
 */
import { Controller } from "@hotwired/stimulus"

const routeNames = {
  "port-townsend-coupeville": "Port Townsend–Coupeville",
  "anacortes-friday-harbor": "Anacortes–Friday Harbor",
  "kingston-edmonds": "Kingston–Edmonds"
}

export default class extends Controller {
  static targets = ["summary", "log"]
  static values = { route: String, draft: Number, night: Boolean }

  routeValueChanged() {
    this.writeHash()
  }

  draftValueChanged() {
    this.writeHash()
  }

  nightValueChanged() {
    this.writeHash()
  }

  connect() {
    const params = new URLSearchParams(location.hash.slice(1))
    const route = params.get("route") || this.routeValue
    const draft = params.has("draft") ? Number(params.get("draft")) : this.draftValue
    const night = params.get("night") === "true"
    const name = routeNames[route] || route
    const crossing = night ? "night crossing" : "day crossing"
    this.summaryTarget.textContent = `Restored from the hash: ${name}, draft ${draft} ft, ${crossing}.`
  }

  writeHash() {
    const params = new URLSearchParams()
    params.set("route", this.routeValue)
    params.set("draft", String(this.draftValue))
    params.set("night", String(this.nightValue))
    const hash = params.toString()
    if (`#${hash}` === location.hash) return
    this.record(`Hash written from the markup: ${hash}`)
    history.replaceState(history.state, "", `${location.pathname}${location.search}#${hash}`)
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}
