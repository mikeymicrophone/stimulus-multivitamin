/*
 * bell_relay_controller.js — registered as "bell-relay"
 *
 * Teaches: the returned event's defaultPrevented
 * belongs to this strike only. A nested reply can
 * be vetoed without vetoing the strike.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "The bell is quiet."
  }

  strikeOnce() {
    this.sound({ echo: false, hops: 1, limit: 1, vetoReply: false })
  }

  strikeEcho() {
    this.sound({ echo: true, hops: 1, limit: 2, vetoReply: true })
  }

  sound(detail) {
    const tape = []
    const event = this.dispatch("strike", {
      detail: { ...detail, tape }
    })
    this.readingTarget.textContent = `tape ${tape.join(" ")}. outerPrevented ${event.defaultPrevented}.`
  }
}
