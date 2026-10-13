/*
 * lane_slip_controller.js — registered as "lane-slip"
 *
 * Teaches: laneBellOutletConnected throws. The throw is
 * outside the try around connect(), so handleError stays
 * quiet, connect() does not run, and controllers later in
 * the document do not connect.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["lane-bell"]
  static targets = ["reading"]

  laneBellOutletConnected() {
    throw new Error("lane slip lost the bell")
  }

  connect() {
    this.readingTarget.textContent = "Lane slip connected."
  }
}
