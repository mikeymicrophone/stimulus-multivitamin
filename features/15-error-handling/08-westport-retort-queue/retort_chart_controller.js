/*
 * retort_chart_controller.js — registered as "retort-chart"
 *
 * Teaches: a synchronous throw is handleError. An async
 * method, a throw after await, and a returned rejection
 * are unhandledrejection instead.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Chart is blank."
  }

  saveSync() {
    this.readingTarget.textContent = "Sync save started."
    throw new Error("chart pencil snapped")
  }

  async saveEarly() {
    this.readingTarget.textContent = "Early save started."
    throw new Error("cook never started")
  }

  async saveLate() {
    this.readingTarget.textContent = "Late save started."
    await Promise.resolve()
    throw new Error("retort lost pressure")
  }

  saveReturned() {
    this.readingTarget.textContent = "Returned save started."
    return Promise.reject(new Error("ticket refused"))
  }
}
