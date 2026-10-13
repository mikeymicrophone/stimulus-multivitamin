/*
 * office_clock_controller.js — registered as "office-clock"
 *
 * Teaches: a controller on a <meta> in <head> connects when
 * the application root is the document element, which is
 * what Application.start() uses when you pass no element.
 * document.body does not contain that meta, so an
 * application started on the body never connects it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const reading = document.getElementById("office-reading")
    const inBody = document.body.contains(this.element)
    reading.textContent = `Office clock connected on ${this.application.element.tagName}. In body: ${inBody}.`
  }
}
