/*
 * mess_slate_controller.js — registered as "mess-slate"
 *
 * Teaches: one galley slate uses every value type. watchName, lotCode,
 * and allergenNote are Strings. batchCode is a Number, so "08" reads
 * as 8 while lotCode "08" stays "08". bowls and boatName use
 * { type, default }, so a missing attribute still has the has-property
 * true. galleyOpen is a Boolean. menu is an Array. tideNote is an
 * Object whose height_ft key is not camelized.
 *
 * This controller does not define [name]ValueChanged. That callback
 * runs later, from the value observer, and belongs to the next
 * feature. render() runs in the action, after the setter has already
 * written the attribute.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]
  static values = {
    watchName: String,
    boatName: { type: String, default: "Mary Jane" },
    bowls: { type: Number, default: 4 },
    batchCode: Number,
    lotCode: String,
    galleyOpen: Boolean,
    menu: Array,
    tideNote: Object,
    allergenNote: String
  }

  connect() {
    this.render()
  }

  addChowder() {
    this.menuValue = this.menuValue.concat(["chowder"])
    this.render()
  }

  closeGalley() {
    this.galleyOpenValue = false
    this.render()
  }

  serveAnotherBowl() {
    this.bowlsValue = this.bowlsValue + 1
    this.render()
  }

  rewriteBatch() {
    this.batchCodeValue = this.batchCodeValue
    this.render()
  }

  render() {
    const tide = this.tideNoteValue
    const height = Object.prototype.hasOwnProperty.call(tide, "height_ft") ? tide.height_ft : "absent"
    const direction = Object.prototype.hasOwnProperty.call(tide, "direction") ? tide.direction : "absent"
    const camelHeight = Object.prototype.hasOwnProperty.call(tide, "heightFt") ? "present" : "absent"
    const menu = this.menuValue
    const menuAttribute = this.element.getAttribute("data-mess-slate-menu-value")
    this.readingTarget.textContent = [
      `Watch ${this.watchNameValue}.`,
      `Boat ${this.boatNameValue}.`,
      `hasBoatNameValue ${this.hasBoatNameValue}.`,
      `Boat attribute ${shown(this.element.getAttribute("data-mess-slate-boat-name-value"))}.`,
      `Bowls ${this.bowlsValue}.`,
      `hasBowlsValue ${this.hasBowlsValue}.`,
      `Bowl attribute ${shown(this.element.getAttribute("data-mess-slate-bowls-value"))}.`,
      `Batch ${this.batchCodeValue}.`,
      `Batch attribute ${shown(this.element.getAttribute("data-mess-slate-batch-code-value"))}.`,
      `Lot ${JSON.stringify(this.lotCodeValue)}.`,
      `Galley open ${this.galleyOpenValue}.`,
      `Galley attribute ${shown(this.element.getAttribute("data-mess-slate-galley-open-value"))}.`,
      `Menu ${menu.length ? menu.join(", ") : "(none)"}.`,
      `Menu attribute ${menuAttribute === null ? "absent" : menuAttribute}.`,
      `Tide height_ft ${height}.`,
      `direction ${direction}.`,
      `heightFt ${camelHeight}.`,
      `hasAllergenNoteValue ${this.hasAllergenNoteValue}.`
    ].join(" ")
  }
}

function shown(attribute) {
  return attribute === null ? "absent" : JSON.stringify(attribute)
}
