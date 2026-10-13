/*
 * gallery_wall_controller.js — registered as "gallery-wall"
 *
 * Teaches: event.params is built from the element that declares the
 * action, not from event.target. A plaque button's nested span is the
 * click target, and the accession still comes from the button. A room
 * that listens for clicks does not see accession attributes sitting on
 * the painting that was clicked.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  choosePlaque(event) {
    const accession = event.params.accessionNumber
    const wing = event.params.wingName
    this.statusTarget.textContent = `Plaque ${accession}, ${wing}. The target was ${event.target.tagName}.`
  }

  chooseFromRoom(event) {
    const painting = event.target.closest("[data-gallery-wall-accession-number-param]")
    const painted = painting ? painting.querySelector("span").textContent : "the room itself"
    const accession = event.params.accessionNumber
    if (accession === undefined) {
      this.statusTarget.textContent = `Room action has no accessionNumber. The target was ${event.target.tagName} inside ${painted}.`
    } else {
      this.statusTarget.textContent = `Room action unexpectedly saw ${accession}.`
    }
  }
}
