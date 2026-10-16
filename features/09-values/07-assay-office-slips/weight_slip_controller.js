/*
 * weight_slip_controller.js — registered as "weight-slip"
 *
 * Teaches: pennyweights is a Number. Underscores are stripped before
 * Number(), so "1_000" is 1000 and the attribute stays "1_000".
 * "1,200" and "12dwt" are NaN. A blank attribute is 0 with
 * hasPennyweightsValue true. A missing attribute is 0 with has false.
 * " 14.5 " is 14.5. "2e1" is 20. A certificate past
 * Number.MAX_SAFE_INTEGER loses a digit in the value and keeps every
 * digit in the attribute until something assigns it.
 */
import { Controller } from "@hotwired/stimulus"
import { report, rawAttribute, textOf } from "../../../assets/readout.js"

export default class extends Controller {
  static targets = ["slipName", "reading"]
  static values = { pennyweights: Number }

  connect() {
    report(
      this.readingTarget,
      `${textOf(this.slipNameTarget)} pennyweights ${this.pennyweightsValue}.`,
      `Attribute ${rawAttribute(this, "pennyweights", "value", { quoted: true })}.`,
      `hasPennyweightsValue ${this.hasPennyweightsValue}.`
    )
  }
}
