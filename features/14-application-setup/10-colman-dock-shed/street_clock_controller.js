/*
 * street_clock_controller.js — registered as "street-clock"
 *
 * Teaches: the no-argument application watches the document
 * element, so this clock on the street connects once.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = `Street clock connected on ${this.application.element.tagName}.`
  }
}
