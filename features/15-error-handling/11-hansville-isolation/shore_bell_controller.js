/*
 * shore_bell_controller.js — registered as "shore-bell"
 *
 * Connects before the lamp that throws. Stays up.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Shore bell connected."
  }

  ring() {
    this.readingTarget.textContent = "Shore bell rang."
  }
}
