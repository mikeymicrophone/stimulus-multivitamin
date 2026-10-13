/*
 * bell_controller.js — registered as "bell"
 *
 * Declared on the tide desk itself. The attribute is
 * data-tide-desk-bell-outlet.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.statusTarget.textContent = `${this.element.id} bell connected.`
  }
}
