/*
 * harbor_clock_controller.js — registered as "harbor-clock"
 *
 * Teaches: another controller's action still runs after
 * the pilot order has thrown.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Clock holds 09:15."
  }

  advance() {
    this.readingTarget.textContent = "Clock advanced."
  }
}
