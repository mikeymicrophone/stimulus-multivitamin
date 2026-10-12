/*
 * courier_radio_controller.js — registered as "courier-radio"
 *
 * Teaches: the radio action on the same button sees channelName and
 * priority, and does not see the slip's routeCode. priority "true"
 * arrives as a boolean. The two identifiers do not share a prefix, so
 * neither pattern matches the other's attributes.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["radioLog"]

  announce(event) {
    const keys = Object.keys(event.params).sort().join(", ")
    const route = event.params.routeCode === undefined ? "missing" : event.params.routeCode
    this.radioLogTarget.textContent = `Radio keys ${keys}. Channel ${event.params.channelName}, priority ${event.params.priority} (${kindOf(event.params.priority)}). Route is ${route}.`
  }
}

function kindOf(value) {
  if (value === undefined) return "missing"
  return typeof value
}
