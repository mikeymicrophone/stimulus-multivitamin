/*
 * pile_lamp_controller.js — registered as "pile-lamp"
 *
 * Teaches: pile-lamp does not collide with shed-lamp. The
 * pier's pile attribute is data-pier-pile-lamp-outlet, not
 * data-pier-shed-lamp-outlet.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.dataset.pileReady = "yes"
  }
}
