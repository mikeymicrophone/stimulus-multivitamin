/*
 * seed_float_controller.js — registered as "seed-float"
 *
 * Teaches: the selector can match this element and the outlet
 * still misses, because the controller token is seed-float.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { station: String }

  connect() {
    this.element.dataset.floatReady = "yes"
  }
}
