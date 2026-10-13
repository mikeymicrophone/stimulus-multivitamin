/*
 * keeper_log_controller.js — registered as both "keeper-log"
 * and "keeper--log"
 *
 * Teaches: the two identifiers are different tokens. Their
 * outlet property names are not. namespace camelizing
 * collapses "--" to "-", so both become keeperLog.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.statusTarget.textContent = `${this.identifier} ${this.element.id} connected.`
  }
}
