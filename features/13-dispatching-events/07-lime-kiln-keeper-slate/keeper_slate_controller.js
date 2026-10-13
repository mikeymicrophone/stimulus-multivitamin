/*
 * keeper_slate_controller.js — registered as "keeper--slate"
 *
 * Teaches: the event prefix is the identifier, and a
 * namespace keeps the double hyphen. dispatch("signed")
 * fires keeper--slate:signed. dispatch("watch-relieved")
 * fires keeper--slate:watch-relieved.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["note"]
  static values = { keeper: String }

  signWatch() {
    const event = this.dispatch("signed", {
      detail: { keeper: this.keeperValue, watch: "forenoon" }
    })
    this.noteTarget.textContent = `Dispatched ${event.type}.`
  }

  relieveWatch() {
    const event = this.dispatch("watch-relieved", {
      detail: { keeper: this.keeperValue }
    })
    this.noteTarget.textContent = `Dispatched ${event.type}.`
  }
}
