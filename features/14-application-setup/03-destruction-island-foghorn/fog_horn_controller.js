/*
 * fog_horn_controller.js — registered as "fog-horn"
 *
 * Teaches: register() after the router is running connects
 * elements that are already in the document, then calls
 * afterLoad. An element appended during afterLoad is not
 * connected yet. The mutation observer connects it after
 * register() returns.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    const tape = document.getElementById("horn-tape")
    const line = this.element.id === "spare-horn" ? "spare connect." : "horn connect."
    tape.textContent = `${tape.textContent} ${line}`.trim()
    if (this.hasReadingTarget) {
      this.readingTarget.textContent = this.element.id === "spare-horn"
        ? "Spare horn connected."
        : "Horn connected."
    }
  }

  sound() {
    this.readingTarget.textContent = `${this.element.id === "spare-horn" ? "Spare" : "Horn"} sounded.`
  }

  static afterLoad(identifier, application) {
    const tape = document.getElementById("horn-tape")
    tape.textContent = `${tape.textContent} afterLoad start.`.trim()
    const spare = document.createElement("article")
    spare.id = "spare-horn"
    spare.className = "card"
    spare.dataset.controller = identifier
    spare.innerHTML = `
      <h2>Spare horn</h2>
      <p id="spare-reading" class="reading" data-fog-horn-target="reading">Spare horn is waiting.</p>
      <div class="actions">
        <button type="button" id="sound-spare" data-action="fog-horn#sound">Sound the spare</button>
      </div>
    `
    application.element.append(spare)
    tape.textContent = `${tape.textContent} afterLoad end.`
  }
}
