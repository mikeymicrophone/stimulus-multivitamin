/*
 * document_clerk_controller.js — registered as "document-clerk"
 *
 * Teaches: @document hears an event that bubbles to
 * document, and an event whose target is document.
 * An event targeted at window does not travel down
 * to document.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Clerk is quiet."
  }

  hear(event) {
    const where = event.currentTarget === document ? "document" : "elsewhere"
    this.readingTarget.textContent = `Clerk heard ${event.type} on ${where} from ${event.detail.from}.`
  }

  clear() {
    this.readingTarget.textContent = "Clerk is quiet."
  }
}
