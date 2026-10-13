/*
 * shorthand_vat_controller.js — registered as "shorthand-vat"
 *
 * Teaches: a literal default (breed: "Jersey", temperature: 86,
 * flagged: false) is enough. The attribute can be absent and the
 * getter returns that literal. hasBreedValue and hasFlaggedValue are
 * true, including for the default false.
 */
import { Controller } from "@hotwired/stimulus"
import { describeVat } from "./vat_card_controller.js"

export default class extends Controller {
  static targets = ["reading"]
  static values = {
    breed: "Jersey",
    temperature: 86,
    spareDegrees: 0,
    cultures: ["mesophilic"],
    flagged: false
  }

  connect() {
    this.readingTarget.textContent = describeVat(this, "shorthand-vat")
  }
}
