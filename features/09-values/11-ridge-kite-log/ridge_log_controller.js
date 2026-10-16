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
import { report, rawAttribute } from "../../../assets/readout.js"

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
    // rawAttribute builds names from this.identifier, "ridge-log". The
    // parent's identifier has to be spelled out to show it is ignored.
    const stray = this.element.getAttribute("data-kite-log-station-name-value") ?? "absent"
    report(
      this.readingTarget,
      `Station ${this.stationNameValue || "(unnamed)"}.`,
      `hasStationNameValue ${this.hasStationNameValue}.`,
      `Own attribute ${rawAttribute(this, "stationName")}.`,
      `Stray attribute ${stray}.`,
      `Launched ${this.launchedValue}.`,
      `hasLaunchedValue ${this.hasLaunchedValue}.`,
      `Launched attribute ${rawAttribute(this, "launched")}.`,
      `Gust ${this.gustKnotsValue}.`,
      `hasGustKnotsValue ${this.hasGustKnotsValue}.`,
      `Gust attribute ${rawAttribute(this, "gustKnots")}.`
    )
  }
}
