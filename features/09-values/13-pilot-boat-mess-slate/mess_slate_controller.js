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
import { report, rawAttribute, listOr } from "../../../assets/readout.js"

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
    this.menuValue = [...this.menuValue, "chowder"]
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
    const { height_ft: height = "absent", direction = "absent" } = tide
    const quoted = (name) => rawAttribute(this, name, "value", { quoted: true })
    report(
      this.readingTarget,
      `Watch ${this.watchNameValue}.`,
      `Boat ${this.boatNameValue}.`,
      `hasBoatNameValue ${this.hasBoatNameValue}.`,
      `Boat attribute ${quoted("boatName")}.`,
      `Bowls ${this.bowlsValue}.`,
      `hasBowlsValue ${this.hasBowlsValue}.`,
      `Bowl attribute ${quoted("bowls")}.`,
      `Batch ${this.batchCodeValue}.`,
      `Batch attribute ${quoted("batchCode")}.`,
      `Lot ${JSON.stringify(this.lotCodeValue)}.`,
      `Galley open ${this.galleyOpenValue}.`,
      `Galley attribute ${quoted("galleyOpen")}.`,
      `Menu ${listOr(this.menuValue, "(none)")}.`,
      `Menu attribute ${rawAttribute(this, "menu")}.`,
      `Tide height_ft ${height}.`,
      `direction ${direction}.`,
      `heightFt ${Object.hasOwn(tide, "heightFt") ? "present" : "absent"}.`,
      `hasAllergenNoteValue ${this.hasAllergenNoteValue}.`
    )
  }
}
