/*
 * lens_desk_controller.js — registered as "lens-desk"
 *
 * Teaches: static outlets lists "lens-cabinet" and
 * "keeper--slate" as two different identifiers. The attributes
 * are data-lens-desk-lens-cabinet-outlet and
 * data-lens-desk-keeper--slate-outlet. The properties do not
 * collide: lensCabinetOutlet and keeperSlateOutlet.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["lens-cabinet", "keeper--slate"]
  static targets = ["reading"]

  connect() {
    this.render("connected.")
  }

  advanceLens() {
    const order = this.lensCabinetOutlet.advanceOrder()
    this.render(`order ${order}.`)
  }

  signSlate() {
    const keeper = this.keeperSlateOutlet.signWatch()
    this.render(`signed by ${keeper}.`)
  }

  render(reason) {
    const cabinet = this.lensCabinetOutlet
    const slate = this.keeperSlateOutlet
    this.readingTarget.textContent = [
      `lensCabinetOutlet ${cabinet.element.id} order ${cabinet.orderValue}.`,
      `Legend ${cabinet.legendTarget.textContent.trim()}.`,
      `keeperSlateOutlet ${slate.element.id} keeper ${slate.keeperValue}.`,
      `Signed ${slate.signedValue}.`,
      `hasLensCabinetOutlet ${this.hasLensCabinetOutlet}.`,
      `hasKeeperSlateOutlet ${this.hasKeeperSlateOutlet}.`,
      reason
    ].join(" ")
  }
}
