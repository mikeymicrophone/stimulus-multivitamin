/*
 * night_order_controller.js — registered as "night-order"
 *
 * Teaches: this controller lives on a meta element in head.
 * The scope observer connects it. The desk can read it.
 * The outlet selector observer watches document.body, so
 * the desk never gets nightOrderOutletConnected.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { watch: String }

  connect() {
    this.element.dataset.nightConnected = "yes"
  }
}
