/*
 * bolt_ticket_controller.js — registered as "bolt-ticket"
 *
 * Teaches: meshSize and clothName become data-bolt-ticket-mesh-size-value
 * and data-bolt-ticket-cloth-name-value. Stimulus looks up those exact
 * names. HTML lowercases a camelCase attribute, so meshSize in the
 * markup is stored as meshsize and is not the value. An underscore
 * attribute is not camelized either. Both misses read as "" with
 * hasMeshSizeValue false.
 */
import { Controller } from "@hotwired/stimulus"
import { report, textOf, listOr } from "../../../assets/readout.js"

export default class extends Controller {
  static targets = ["boltName", "reading"]
  static values = {
    meshSize: String,
    clothName: String
  }

  connect() {
    this.readTicket()
  }

  readTicket() {
    const prefix = `data-${this.identifier}-`
    const names = Array.from(this.element.attributes, ({ name }) => name).filter((name) => name.startsWith(prefix))
    report(
      this.readingTarget,
      `${textOf(this.boltNameTarget)} mesh ${JSON.stringify(this.meshSizeValue)}.`,
      `hasMeshSizeValue ${this.hasMeshSizeValue}.`,
      `Cloth ${JSON.stringify(this.clothNameValue)}.`,
      `hasClothNameValue ${this.hasClothNameValue}.`,
      `Attributes ${listOr(names, "none", " ")}.`
    )
  }
}
