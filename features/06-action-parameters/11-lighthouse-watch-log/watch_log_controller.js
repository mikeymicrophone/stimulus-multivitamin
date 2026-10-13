/*
 * watch_log_controller.js — registered as "watch-log"
 *
 * Teaches: a keydown.enter@document action reads params from the element
 * that declares it (the watch section), not from the focused field.
 * The visitor input's data-watch-log-visitor-name-param is ignored.
 * The field's typed text is event.target.value, which is a different
 * channel. A buoy button's own action reads that button's params and
 * does not see the section's stationName.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["stamp", "fileStatus"]

  stamp(event) {
    const field = event.target
    const typed = field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field.value : ""
    const visitorName = event.params.visitorName === undefined ? "missing" : event.params.visitorName
    this.stampTarget.textContent = `Stamped the ${event.params.watchName} watch at ${event.params.stationName}. visitorName is ${visitorName}. Visitor field says ${typed}.`
  }

  markBuoy(event) {
    const station = event.params.stationName === undefined ? "missing" : event.params.stationName
    this.stampTarget.textContent = `${event.params.buoyName} at ${event.params.bearingDegrees} degrees (${kindOf(event.params.bearingDegrees)}). stationName is ${station} on the buoy.`
  }

  fileLog(event) {
    event.preventDefault()
    this.fileStatusTarget.textContent = "Log filed for the evening watch."
  }
}

function kindOf(value) {
  if (value === undefined) return "missing"
  return typeof value
}
