/*
 * annex_controller.js — registered as "annex"
 *
 * Teaches: once the router is running, register connects
 * the existing annex first, then afterLoad. An element
 * appended in afterLoad connects on a later microtask,
 * after register returns. this inside afterLoad is the
 * constructor.
 */
import { Controller } from "@hotwired/stimulus"
import { writeTape } from "./tape.js"

export default class extends Controller {
  static binKind = "oats"
  static targets = ["reading"]

  connect() {
    if (this.element.id === "seeded-bin") {
      writeTape("seeded connect.")
      return
    }
    writeTape("annex connect.")
    this.readingTarget.textContent = "Annex connected."
  }

  static afterLoad(identifier, application) {
    writeTape(`${identifier} afterLoad start ${this.binKind}.`)
    const bin = document.createElement("p")
    bin.id = "seeded-bin"
    bin.dataset.controller = identifier
    bin.textContent = "Seeded bin is waiting."
    application.element.querySelector("#annex-floor").append(bin)
    writeTape("annex afterLoad end.")
  }
}
