/*
 * key_encoder_controller.js — registered as "key-encoder"
 *
 * Teaches: :once is a native listener option on the event name, not on
 * the keyboard filter. keydown.enter@document->key-encoder#encodeFromEnter:once:prevent
 * still listens for every keydown. The first keydown of any key invokes
 * that listener; if the filter rejects it, encodeFromEnter() never runs
 * and the listener is already gone. A separate click->…:once on Encode
 * is a different event and still works.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["guestName", "room", "status", "keyLog", "encodedPass"]

  connect() {
    this.enterEncodeCount = 0
    this.buttonEncodeCount = 0
    this.enterListenerGone = false
    this.statusTarget.textContent = "Enter encodes a card for room 412, until some other key spends the :once listener."
  }

  noteKey(event) {
    const line = document.createElement("li")
    line.textContent = this.enterListenerGone
      ? `${event.key} · the Enter :once listener is already gone`
      : `${event.key} · the Enter :once listener saw this keydown`
    this.keyLogTarget.append(line)
    if (event.key !== "Enter") this.enterListenerGone = true
  }

  encodeFromEnter(event) {
    this.enterEncodeCount += 1
    this.enterListenerGone = true
    this.renderPass("Enter", event.defaultPrevented)
  }

  encodeFromButton() {
    this.buttonEncodeCount += 1
    this.renderPass("Encode", false)
  }

  renderPass(source, defaultPrevented) {
    const guest = this.guestNameTarget.value.trim() || "the guest"
    this.encodedPassTarget.hidden = false
    this.encodedPassTarget.textContent = `Key card encoded for ${guest}, room ${this.roomTarget.value}. Source: ${source}. Enter encodings: ${this.enterEncodeCount}. Button encodings: ${this.buttonEncodeCount}.`
    this.statusTarget.textContent = source === "Enter"
      ? `Encoded from Enter (defaultPrevented=${defaultPrevented}). That :once listener is spent.`
      : `Encoded from the button. Click :once is a different listener from keydown :once.`
  }
}
