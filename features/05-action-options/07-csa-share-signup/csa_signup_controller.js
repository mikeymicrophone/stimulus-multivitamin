/*
 * csa_signup_controller.js — registered as "csa-signup"
 *
 * Teaches: joinShare uses submit->csa-signup#joinShare:prevent:once so the
 * form stays on this page and a second submit is ignored. Option order on
 * a descriptor matters: :prevent:self still preventDefault()s a child
 * click that :self then rejects; :self:prevent skips preventDefault()
 * when :self fails, because Stimulus ANDs the filters in descriptor order
 * and short-circuits. Actions that differ in options also sit on
 * different native listeners, so stopImmediatePropagation() in one does
 * not skip the other.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "share", "pickup", "confirmation", "status",
    "actionLog", "holdStatus", "waitlistStatus",
  ]

  connect() {
    this.joinCount = 0
    this.statusTarget.textContent = "Pick a share and a pickup, then join. The form will not leave this page."
  }

  joinShare(event) {
    this.joinCount += 1
    const share = this.selectedShare
    const pickup = this.pickupTarget.selectedOptions[0].textContent
    this.confirmationTarget.hidden = false
    this.confirmationTarget.textContent = `You're on the Thornfield Organics ${share.dataset.seasonLabel} list for a ${share.dataset.shareLabel} share, pickup ${pickup}. Joins this visit: ${this.joinCount}.`
    this.statusTarget.textContent = `Joined (defaultPrevented=${event.defaultPrevented}). :once already dropped the submit listener.`
    event.currentTarget.querySelector("button[type='submit']").disabled = true
  }

  holdShare() {
    this.holdStatusTarget.textContent = "Held a Thornfield share for 24 hours. This click was on the card itself."
  }

  joinWaitlist() {
    this.waitlistStatusTarget.textContent = "Added to the winter waitlist. This click was on the card itself."
  }

  logValidate(event) {
    this.appendLog("validateShare")
    event.stopImmediatePropagation()
  }

  logAnnounce() {
    this.appendLog("announceHold")
  }

  logReceipt() {
    this.appendLog("printReceipt")
  }

  appendLog(name) {
    const line = document.createElement("li")
    line.textContent = name
    this.actionLogTarget.append(line)
  }

  get selectedShare() {
    return this.shareTargets.find((shareRadio) => shareRadio.checked) ?? this.shareTargets[0]
  }
}
