/*
 * lens_cabinet_controller.js — registered as "lens-cabinet"
 *
 * Teaches: a kebab-case identifier. The desk's property is
 * lensCabinetOutlet. orderValue and the legend target are
 * read, and advanceOrder() is called, from that outlet.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { order: Number }
  static targets = ["legend"]

  advanceOrder() {
    this.orderValue += 1
    return this.orderValue
  }
}
