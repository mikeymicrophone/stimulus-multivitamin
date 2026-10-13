/*
 * station_log_controller.js — registered as "station-log"
 *
 * Loaded from the import map because the log is already
 * in the document when the station scan runs.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Station log connected."
  }
}
