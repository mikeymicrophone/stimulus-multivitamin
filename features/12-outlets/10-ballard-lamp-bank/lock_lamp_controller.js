/*
 * lock_lamp_controller.js — registered as "lock-lamp"
 *
 * Teaches: disconnect() runs from the scope observer even
 * when the bank's outlet callback is paused. life gains a
 * "d" immediately. The bank hears outletDisconnected only
 * on a later selector refresh.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.element.dataset.life = (this.element.dataset.life || "") + "c"
    this.statusTarget.textContent = `${this.lampName()} connect. Life ${this.element.dataset.life}.`
  }

  disconnect() {
    this.element.dataset.life += "d"
    this.statusTarget.textContent = `${this.lampName()} disconnect. Life ${this.element.dataset.life}.`
  }

  lampName() {
    return this.element.id.replace("lamp-", "")
  }
}
