/*
 * mismatched_vat_controller.js — registered as "mismatched-vat"
 *
 * Teaches: { type: Number, default: "12" } does not match. Stimulus
 * throws when this class is registered. The message names the value
 * token "temperature" and does not name the identifier. Nothing on
 * the page registers it until the morning vat asks.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    temperature: { type: Number, default: "12" }
  }
}
