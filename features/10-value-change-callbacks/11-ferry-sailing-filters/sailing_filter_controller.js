/*
 * sailing_filter_controller.js — registered as "sailing-filter"
 *
 * Teaches: initialize() reads the query string and writes the values
 * before the observer starts, so the first callbacks see the query
 * and not a second pass over the markup. The callbacks write the
 * query back. A user change pushes a history entry. popstate reads
 * the query without pushing another one.
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

  initialize() {
    this.userChanged = false
    const params = new URLSearchParams(location.search)
    if (params.has("route")) this.routeValue = params.get("route")
    if (params.has("draft")) this.draftValue = Number(params.get("draft"))
    if (params.has("night")) this.nightValue = params.get("night") === "true"
  }

  routeValueChanged(route, previous) {
    this.record(`Route ${shown(route)}, previous ${shown(previous)}.`)
    this.paint()
    this.writeQuery()
  }

  draftValueChanged(draft, previous) {
    this.record(`Draft ${shown(draft)}, previous ${shown(previous)}.`)
    this.paint()
    this.writeQuery()
  }

  nightValueChanged(night, previous) {
    this.record(`Night ${shown(night)}, previous ${shown(previous)}.`)
    this.paint()
    this.writeQuery()
  }

  chooseKingston() {
    this.userChanged = true
    this.routeValue = "kingston-edmonds"
    this.draftValue = 18
    this.nightValue = true
  }

  applyQuery() {
    this.userChanged = false
    const params = new URLSearchParams(location.search)
    if (params.has("route")) this.routeValue = params.get("route")
    if (params.has("draft")) this.draftValue = Number(params.get("draft"))
    if (params.has("night")) this.nightValue = params.get("night") === "true"
  }

  paint() {
    const name = routeNames[this.routeValue] || this.routeValue
    const crossing = this.nightValue ? "night crossing" : "day crossing"
    this.summaryTarget.textContent = `${name}, draft ${this.draftValue} ft, ${crossing}.`
  }

  writeQuery() {
    const params = new URLSearchParams()
    params.set("route", this.routeValue)
    params.set("draft", String(this.draftValue))
    params.set("night", String(this.nightValue))
    const search = `?${params}`
    if (search === location.search) return
    const next = `${location.pathname}${search}${location.hash}`
    if (this.userChanged) {
      this.userChanged = false
      history.pushState({ sailing: true }, "", next)
    } else {
      history.replaceState({ sailing: true }, "", next)
    }
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}

function shown(value) {
  return value === undefined ? "undefined" : JSON.stringify(value)
}
