/*
 * vault_tray_controller.js — registered as "vault-tray"
 *
 * Teaches: accessions is an Array. The attribute is JSON. Pushing into
 * the array returned by the getter does not write the attribute, and
 * the next read parses the attribute again. Assigning a new array
 * writes JSON.stringify of it. A missing attribute reads as a fresh []
 * and hasAccessionsValue is false. The tray is deduplicated through a
 * Set before the assignment, because an Array value has no set semantics.
 */
import { Controller } from "@hotwired/stimulus"
import { report, rawAttribute, textOf, listOr } from "../../../assets/readout.js"

const INCOMING_ACCESSION = "NSGC-4410"

export default class extends Controller {
  static targets = ["trayName", "reading"]
  static values = { accessions: Array }

  connect() {
    this.render("Opened the tray.")
  }

  pushWithoutRecording() {
    const before = rawAttribute(this, "accessions")
    this.accessionsValue.push(INCOMING_ACCESSION)
    const unchanged = rawAttribute(this, "accessions") === before
    this.render(unchanged ? "The push left the attribute unchanged." : "The push changed the attribute.")
  }

  recordAccession() {
    const drawer = new Set(this.accessionsValue).add(INCOMING_ACCESSION)
    this.accessionsValue = [...drawer]
    this.render(`Recorded ${INCOMING_ACCESSION}.`)
  }

  render(note) {
    report(
      this.readingTarget,
      `${textOf(this.trayNameTarget)} accessions ${listOr(this.accessionsValue, "(none)")}.`,
      `hasAccessionsValue ${this.hasAccessionsValue}.`,
      `Attribute ${rawAttribute(this, "accessions")}.`,
      note
    )
  }
}
