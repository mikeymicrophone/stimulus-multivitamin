/*
 * rosario_desk_controller.js — registered as "rosario-desk"
 *
 * Teaches: sector-bell is in the body and gets a callback
 * before connect(). night-order is in head: hasNightOrderOutlet
 * is true, the getter returns the meta, and the callback
 * count stays 0. Filing "[" as the sector-bell selector throws
 * SyntaxError from the mutation observer, not handleError.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["sector-bell", "night-order"]
  static targets = ["reading", "note"]

  initialize() {
    this.sectorCallbacks = 0
    this.nightCallbacks = 0
  }

  sectorBellOutletConnected() {
    this.sectorCallbacks += 1
  }

  nightOrderOutletConnected() {
    this.nightCallbacks += 1
  }

  connect() {
    const night = this.nightOrderOutlet
    this.readingTarget.textContent = [
      `Sector bell ${this.sectorBellOutlet.patternValue}.`,
      `Sector callbacks ${this.sectorCallbacks}.`,
      `Night watch ${night.watchValue}.`,
      `Night callbacks ${this.nightCallbacks}.`,
      `Night tag ${this.nightOrderOutletElement.tagName}.`,
      `hasNightOrderOutlet ${this.hasNightOrderOutlet}.`
    ].join(" ")
  }

  ringBell() {
    const sounded = this.sectorBellOutlet.ring()
    this.noteTarget.textContent = `Rang ${sounded}.`
  }

  fileBracket() {
    this.element.setAttribute("data-rosario-desk-sector-bell-outlet", "[")
  }
}
