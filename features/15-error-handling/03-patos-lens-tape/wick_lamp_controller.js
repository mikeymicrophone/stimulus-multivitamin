/*
 * wick_lamp_controller.js — registered as "wick-lamp"
 *
 * Teaches: a throw in connect() is reported as
 * "Error connecting controller". The sentence written
 * above the throw stays on the lamp.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Wick lamp reached connect."
    throw new Error("wick buried")
  }
}
