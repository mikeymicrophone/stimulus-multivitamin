/*
 * pass_gate_controller.js — registered as "pass-gate"
 *
 * Three actions on one button, a slate whose logger will
 * throw, and a rope that throws a string.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["pass", "gate", "slate", "watch", "rope"]

  connect() {
    this.passTarget.textContent = "Pass is open."
    this.gateTarget.textContent = "Gate is open."
    this.slateTarget.textContent = "Slate is clean."
    this.watchTarget.textContent = "Watch is waiting."
    this.ropeTarget.textContent = "Rope is fast."
  }

  markPass() {
    this.passTarget.textContent = "Pass marked."
  }

  jamCable() {
    throw new Error("cable parted")
  }

  closeGate() {
    this.gateTarget.textContent = "Gate closed."
  }

  writeSlate() {
    this.slateTarget.textContent = "Horn wrote the slate."
    throw new Error("slate cracked")
  }

  nextWatch() {
    this.watchTarget.textContent = "Next watch posted."
  }

  partRope() {
    this.ropeTarget.textContent = "Rope let go."
    throw "rope parted"
  }
}
