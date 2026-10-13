/*
 * receiving_dock_controller.js — registered as "receiving-dock"
 *
 * Teaches: a tote fragment, an innerHTML reprint, an
 * insertAdjacentHTML late truck, and a cloned standard box all notify
 * berryTargetConnected after the action has written its notice. The
 * notice is left in place. innerHTML disconnects every berry already
 * on the slip before it connects the new ones. A berry inside a removed
 * tote still has a parent element. A berry that was a direct child does
 * not. Neither is in the document.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["berry", "slip", "ledger", "notice", "openings", "boxBlueprint"]

  initialize() {
    this.lines = []
    this.openings = 0
  }

  connect() {
    this.openings += 1
    this.openingsTarget.textContent = `Dock openings: ${this.openings}.`
    this.note("dock open")
  }

  berryTargetConnected(berry) {
    this.note(`connected ${berry.dataset.variety}`)
  }

  berryTargetDisconnected(berry) {
    const packedIn = berry.parentElement?.dataset?.toteName
    const where = berry.isConnected
      ? "still on the dock"
      : packedIn
        ? `left the dock, still packed in ${packedIn}`
        : "left the dock, not in a tote"
    this.note(`disconnected ${berry.dataset.variety}: ${where}`)
  }

  tipTote() {
    const tote = document.createElement("div")
    tote.dataset.toteName = "Morning tote"
    for (const variety of ["Early Black", "Howes"]) {
      tote.append(this.berryElement(variety, "tote"))
    }
    const fragment = document.createDocumentFragment()
    fragment.append(tote)
    this.slipTarget.append(fragment)
    this.noticeTarget.textContent = `Action line: getter already lists ${this.varietyNames()}. The ledger had not stamped Early Black or Howes yet.`
  }

  reprintSlip() {
    this.slipTarget.innerHTML = [
      this.berryMarkup("Stevens", "loose"),
      this.berryMarkup("Mullica Queen", "loose")
    ].join("")
    this.noticeTarget.textContent = `Action line: getter already lists ${this.varietyNames()}. The ledger had not stamped the reprint yet.`
  }

  lateTruck() {
    this.slipTarget.insertAdjacentHTML("beforeend", this.berryMarkup("Ben Lear", "loose"))
    this.noticeTarget.textContent = `Action line: getter already lists ${this.varietyNames()}. The ledger had not stamped Ben Lear yet.`
  }

  stampStandardBox() {
    this.slipTarget.append(this.boxBlueprintTarget.content.cloneNode(true))
    this.noticeTarget.textContent = `Action line: getter already lists ${this.varietyNames()}. The ledger had not stamped Crimson Queen yet.`
  }

  berryElement(variety, packed) {
    const berry = document.createElement("p")
    berry.dataset.variety = variety
    berry.dataset.packed = packed
    berry.setAttribute("data-receiving-dock-target", "berry")
    berry.textContent = `${variety} · ${packed}`
    return berry
  }

  berryMarkup(variety, packed) {
    return `<p data-receiving-dock-target="berry" data-variety="${variety}" data-packed="${packed}">${variety} · ${packed}</p>`
  }

  varietyNames() {
    return this.berryTargets.map((berry) => berry.dataset.variety).join(", ")
  }

  note(line) {
    this.lines.push(line)
    if (this.hasLedgerTarget) this.ledgerTarget.textContent = this.lines.join("\n")
  }
}
