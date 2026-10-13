/*
 * episode_player_controller.js — registered as "episode-player"
 *
 * Teaches: params ride along with a keyboard filter and an action option.
 * keydown.enter->episode-player#jump:prevent on a chapter submit button
 * reads that button's startSeconds and chapterTitle, and :prevent keeps
 * Enter from submitting the chapter form. keydown.right on the player reads
 * skipSeconds from the player, even when the key event's target is a
 * chapter button inside it. The chapter's startSeconds are not consulted,
 * because those attributes are on a different element.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["position", "notesStatus", "chapterStatus"]

  initialize() {
    this.positionSeconds = 0
    this.chapterTitle = ""
  }

  connect() {
    this.renderPosition()
  }

  jump(event) {
    this.positionSeconds = event.params.startSeconds
    this.chapterTitle = event.params.chapterTitle
    this.renderPosition()
  }

  skip(event) {
    const direction = event.key === "ArrowLeft" ? -1 : 1
    const step = event.params.skipSeconds
    this.positionSeconds = Math.max(0, this.positionSeconds + direction * step)
    this.renderPosition()
  }

  saveNotes(event) {
    event.preventDefault()
    this.notesStatusTarget.textContent = "Notes saved for the harbor seal session."
  }

  chapterSubmitted(event) {
    event.preventDefault()
    this.chapterStatusTarget.textContent = "The chapter form submitted."
  }

  renderPosition() {
    const where = this.chapterTitle ? this.chapterTitle : "not in a chapter yet"
    const kind = Number.isFinite(this.positionSeconds) ? "number" : kindOf(this.positionSeconds)
    this.positionTarget.textContent = `At ${this.positionSeconds} seconds (${kind}) — ${where}.`
  }
}

function kindOf(value) {
  if (value === undefined) return "missing"
  return typeof value
}
