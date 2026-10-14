/*
 * pass_bell_controller.js — registered as "pass-bell"
 *
 * The outlet the horn desk ties. Its own connect writes
 * the bell line when the callback has not replaced it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    if (this.element.textContent === "Pass bell waiting.") {
      this.element.textContent = "Pass bell connected."
    }
  }
}
