/*
 * lamp_controller.js — registered as "lamp"
 *
 * Teaches: the same element can carry the lamp token. The
 * shed office outlets to this identifier, through the
 * attribute it shares with the pier.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.dataset.lampReady = "yes"
  }
}
