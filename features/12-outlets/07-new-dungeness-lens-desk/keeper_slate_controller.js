/*
 * keeper_slate_controller.js — registered as "keeper--slate"
 *
 * Teaches: a namespaced identifier. The double hyphen is part
 * of the identifier. The desk's property is keeperSlateOutlet,
 * not keeper--slateOutlet and not keeper__SlateOutlet.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { keeper: String, signed: Boolean }

  signWatch() {
    this.signedValue = true
    return this.keeperValue
  }
}
