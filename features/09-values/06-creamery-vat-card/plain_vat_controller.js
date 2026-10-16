/*
 * plain_vat_controller.js — registered as "plain-vat"
 *
 * Teaches: the same five names as bare types, with no defaults written
 * out. A missing attribute still returns "", 0, [], or false, and
 * has[Name]Value is false. That is the contrast with vat-card, whose
 * object-form definitions make has[Name]Value true with no attribute.
 */
import { Controller } from "@hotwired/stimulus"
import { describeVat } from "./vat_card_controller.js"

export default class extends Controller {
  static targets = ["reading"]
  static values = {
    breed: String,
    temperature: Number,
    spareDegrees: Number,
    cultures: Array,
    flagged: Boolean
  }

  connect() {
    this.readingTarget.textContent = describeVat(this)
  }
}
