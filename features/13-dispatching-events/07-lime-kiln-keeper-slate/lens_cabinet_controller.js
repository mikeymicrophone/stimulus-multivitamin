/*
 * lens_cabinet_controller.js — registered as "lens-cabinet"
 *
 * Teaches: a multi-word identifier is already hyphenated,
 * so dispatch("rotated") fires lens-cabinet:rotated.
 * That is a different name from keeper--slate:signed.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["note"]
  static values = { order: Number }

  rotate() {
    this.orderValue += 1
    const event = this.dispatch("rotated", {
      detail: { order: this.orderValue }
    })
    this.noteTarget.textContent = `Dispatched ${event.type}.`
  }
}
