/*
 * lane_slip_controller.js — registered as "lane-slip"
 *
 * Teaches: laneValueChanged reads alarmClass. The attribute is
 * absent, so the getter throws Error: Missing attribute
 * "data-lane-slip-alarm-class". That Error is not a TypeError, so
 * the value observer does not prefix it. The throw is outside
 * handleError, connect() does not run, and the next controller
 * in the scan does not connect.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["alarm"]
  static targets = ["reading"]
  static values = { lane: String }

  laneValueChanged(lane) {
    this.readingTarget.textContent = `Lane ${lane}. Alarm ${this.alarmClass}.`
  }

  connect() {
    this.readingTarget.textContent = "Lane slip connected."
  }
}
