/*
 * vault_tray_controller.js — registered as "vault-tray"
 *
 * Teaches: accessions is an Array. The attribute is JSON. Pushing into
 * the array returned by the getter does not write the attribute, and
 * the next read parses the attribute again. Assigning a new array
 * writes JSON.stringify of it. A missing attribute reads as a fresh []
 * and hasAccessionsValue is false.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["trayName", "reading"]
  static values = { accessions: Array }

  connect() {
    this.render("Opened the tray.")
  }

  pushWithoutRecording() {
    const before = this.element.getAttribute("data-vault-tray-accessions-value")
    this.accessionsValue.push("NSGC-4410")
    const after = this.element.getAttribute("data-vault-tray-accessions-value")
    const changed = before !== after
    this.render(changed ? "The push changed the attribute." : "The push left the attribute unchanged.")
  }

  recordAccession() {
    this.accessionsValue = this.accessionsValue.concat(["NSGC-4410"])
    this.render("Recorded NSGC-4410.")
  }

  render(note) {
    const attribute = this.element.getAttribute("data-vault-tray-accessions-value")
    const names = this.accessionsValue
    const trayName = this.trayNameTarget.textContent.trim()
    this.readingTarget.textContent = [
      `${trayName} accessions ${names.length ? names.join(", ") : "(none)"}.`,
      `hasAccessionsValue ${this.hasAccessionsValue}.`,
      `Attribute ${attribute === null ? "absent" : attribute}.`,
      note
    ].join(" ")
  }
}
