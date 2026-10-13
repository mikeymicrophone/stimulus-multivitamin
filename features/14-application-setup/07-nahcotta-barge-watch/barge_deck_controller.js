/*
 * barge_deck_controller.js — registered as "barge-deck"
 *
 * Teaches: stop() removes action listeners and does not
 * disconnect. start() again does not connect this deck
 * a second time if it never left the document.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading", "hails"]

  connect() {
    const count = Number(this.element.dataset.connections || "0") + 1
    this.element.dataset.connections = String(count)
    this.readingTarget.textContent = `Deck connected. Connections ${count}.`
  }

  disconnect() {
    this.readingTarget.textContent = "Deck disconnected."
  }

  hail() {
    const count = Number(this.element.dataset.hails || "0") + 1
    this.element.dataset.hails = String(count)
    this.hailsTarget.textContent = `Hails ${count}.`
  }
}
