/*
 * init_lamp_controller.js — registered as "init-lamp"
 *
 * Teaches: initialize() is caught on its own. connect()
 * still runs, and the action still runs.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  initialize() {
    this.readingTarget.textContent = "Init lamp entered initialize."
    throw new Error("init wick failed")
  }

  connect() {
    this.readingTarget.textContent = "Init lamp connected."
  }

  trim() {
    this.readingTarget.textContent = "Wick trimmed."
  }
}
