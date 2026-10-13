/*
 * retort_basket_controller.js — registered as "retort-basket"
 *
 * Teaches: the basket wears the retort-shell class. Its
 * controller token is retort-basket, so the floor's outlet
 * list does not include it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.dataset.basketReady = "yes"
  }
}
