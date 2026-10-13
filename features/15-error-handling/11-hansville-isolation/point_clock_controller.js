/*
 * point_clock_controller.js — registered as "point-clock"
 *
 * Connects after mid-lamp's caught throw and before the
 * fax whose value callback aborts the scan.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Point clock connected."
  }

  tick() {
    this.readingTarget.textContent = "Point clock ticked."
  }
}
