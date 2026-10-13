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
    const names = [...this.element.attributes]
      .map((attribute) => attribute.name)
      .filter((name) => name.startsWith("data-bolt-ticket-"))
    const boltName = this.boltNameTarget.textContent.trim()
    this.readingTarget.textContent = [
      `${boltName} mesh ${JSON.stringify(this.meshSizeValue)}.`,
      `hasMeshSizeValue ${this.hasMeshSizeValue}.`,
      `Cloth ${JSON.stringify(this.clothNameValue)}.`,
      `hasClothNameValue ${this.hasClothNameValue}.`,
      `Attributes ${names.join(" ") || "none"}.`
    ].join(" ")
  }
}
