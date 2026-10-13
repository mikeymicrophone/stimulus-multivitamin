/*
 * slip_caller_controller.js — registered as "slip-caller"
 *
 * Teaches: the prefix option replaces the identifier.
 * A falsy prefix (false, "", null, 0) drops the colon
 * and the name. The string "false" is kept. Omitting
 * prefix uses this.identifier.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["note"]

  land(event) {
    const kind = event.params.prefixKind
    const options = {}
    if (kind === "terminal") options.prefix = "terminal"
    if (kind === false) options.prefix = false
    if (kind === "empty") options.prefix = ""
    if (kind === "word") options.prefix = "false"
    const landed = this.dispatch("landed", options)
    this.noteTarget.textContent = `type ${landed.type}.`
  }

  landFalsy() {
    const types = [false, "", null, 0].map((prefix) => {
      return this.dispatch("landed", { prefix }).type
    })
    this.noteTarget.textContent = `falsy types ${types.join(" ")}.`
  }
}
