/*
 * retort_controller.js — registered as "retort"
 *
 * Teaches: detail and the returned event.params are
 * different objects. params on the returned event are
 * whatever the last Stimulus binding stamped, which
 * can be a listener whose method never ran.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  cookBatch() {
    const detail = { batch: 14, psi: 15 }
    const event = this.dispatch("cooked", { detail })
    const lot = event.params.lotCode
    this.readingTarget.textContent = `type ${event.type}. psi ${event.detail.psi}. returned belt ${event.params.belt}. returned hold ${String(event.params.hold)}. returned lot ${lot} ${typeof lot}.`
  }
}
