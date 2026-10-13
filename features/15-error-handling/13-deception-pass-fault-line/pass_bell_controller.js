/*
 * pass_bell_controller.js — registered as "pass-bell"
 *
 * Two descriptors differ only by :prevent and :stop.
 * Both strings in the error message omit the options.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.notes = 0
    this.readingTarget.textContent = "Jam notes 0."
  }

  jam() {
    this.notes += 1
    this.readingTarget.textContent = `Jam notes ${this.notes}.`
    throw new Error("bell jammed")
  }
}
