/*
 * pump_housing_controller.js — registered as "pump-housing"
 *
 * Teaches: this element wears the fuel-pump class and is still
 * not a fuel-pump outlet. The outlet name has to be a
 * data-controller token, not just a selector match.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.dataset.housingReady = "yes"
  }
}
