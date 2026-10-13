/*
 * ridge_log_controller.js — registered as "ridge-log"
 *
 * Teaches: gustKnots is this class's own Number. stationName and
 * launched are inherited. data-ridge-log-station-name-value is the
 * station. data-kite-log-station-name-value is on the element and is
 * not read. Marking the kite launched writes
 * data-ridge-log-launched-value, the subclass identifier.
 */
import KiteLogController from "./kite_log_controller.js"

export default class extends KiteLogController {
  static targets = ["reading"]
  static values = { gustKnots: Number }

  connect() {
    this.readLog()
  }

  markLaunched() {
    this.launchedValue = true
    this.readLog()
  }

  readLog() {
    const own = this.element.getAttribute("data-ridge-log-station-name-value")
    const stray = this.element.getAttribute("data-kite-log-station-name-value")
    const launchedAttribute = this.element.getAttribute("data-ridge-log-launched-value")
    const gustAttribute = this.element.getAttribute("data-ridge-log-gust-knots-value")
    this.readingTarget.textContent = [
      `Station ${this.stationNameValue || "(unnamed)"}.`,
      `hasStationNameValue ${this.hasStationNameValue}.`,
      `Own attribute ${own === null ? "absent" : own}.`,
      `Stray attribute ${stray === null ? "absent" : stray}.`,
      `Launched ${this.launchedValue}.`,
      `hasLaunchedValue ${this.hasLaunchedValue}.`,
      `Launched attribute ${launchedAttribute === null ? "absent" : launchedAttribute}.`,
      `Gust ${this.gustKnotsValue}.`,
      `hasGustKnotsValue ${this.hasGustKnotsValue}.`,
      `Gust attribute ${gustAttribute === null ? "absent" : gustAttribute}.`
    ].join(" ")
  }
}
