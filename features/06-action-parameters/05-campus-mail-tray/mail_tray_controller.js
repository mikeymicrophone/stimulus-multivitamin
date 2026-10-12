/*
 * mail_tray_controller.js — registered as "mail-tray"
 *
 * Teaches: two actions on one element share that element's params. route
 * and weigh both see routeCode, postageCents, and fragile. Each action
 * builds a new params object when it runs, so a property route() adds is
 * not visible to weigh(). A second button has different attributes and
 * only one action, so weigh does not run and the route code is its own.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["log"]

  route(event) {
    event.params.taggedByRoute = true
    const { routeCode, postageCents, fragile } = event.params
    this.append(`Routed ${routeCode} with postage ${postageCents} (${kindOf(postageCents)}), fragile ${show(fragile)} (${kindOf(fragile)}).`)
  }

  weigh(event) {
    const tagged = event.params.taggedByRoute === true ? "saw the route tag" : "got a fresh params object"
    this.append(`Weighed ${event.params.postageCents} cents on ${event.params.routeCode}. Weigh ${tagged}.`)
  }

  append(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}

function kindOf(value) {
  if (value === null) return "null"
  if (value === undefined) return "missing"
  return typeof value
}

function show(value) {
  if (typeof value === "string") return value
  return String(value)
}
