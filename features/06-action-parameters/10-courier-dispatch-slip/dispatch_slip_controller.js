/*
 * dispatch_slip_controller.js — registered as "dispatch-slip"
 *
 * Teaches: an action only collects data-[its own identifier]-*-param.
 * dispatch-slip#send sees routeCode and stopCount. It does not see
 * channelName, which belongs to courier-radio on the same button.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slipLog"]

  send(event) {
    const keys = Object.keys(event.params).sort().join(", ")
    const channel = event.params.channelName === undefined ? "missing" : event.params.channelName
    this.slipLogTarget.textContent = `Slip keys ${keys}. Route ${event.params.routeCode}, stops ${event.params.stopCount} (${kindOf(event.params.stopCount)}). Channel is ${channel}.`
  }
}

function kindOf(value) {
  if (value === undefined) return "missing"
  return typeof value
}
