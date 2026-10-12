/*
 * quiz_board_controller.js — registered as "quiz-board"
 *
 * Teaches: a–z and 0–9 are built-in filters. keydown.a@window and
 * keydown.1@window both lock in the Nile. The listeners sit on window, so
 * they fire even while the team-name field has focus — keydown bubbles to
 * window. lockAnswer() ignores the key when the event started in an input,
 * textarea, select, or contenteditable element. Caps Lock still matches
 * keydown.a because Stimulus compares event.key case-insensitively and
 * Caps Lock does not set shiftKey.
 */
import { Controller } from "@hotwired/stimulus"

const answersByKey = {
  a: "nile",
  b: "thames",
  c: "danube",
  d: "seine",
  1: "nile",
  2: "thames",
  3: "danube",
  4: "seine",
}

export default class extends Controller {
  static targets = ["choice", "status", "teamName", "lockedBanner"]

  initialize() {
    this.lockedChoice = null
  }

  lockAnswer(event) {
    if (this.startedInEditableField(event)) return
    const choice = answersByKey[event.key.toLowerCase()]
    if (!choice || this.lockedChoice) return
    event.preventDefault()
    this.lockedChoice = choice
    this.renderLock()
  }

  pickChoice({ currentTarget: choiceButton }) {
    if (this.lockedChoice) return
    this.lockedChoice = choiceButton.dataset.choice
    this.renderLock()
  }

  reveal() {
    if (!this.lockedChoice) {
      this.statusTarget.textContent = "Lock in an answer before the host reveals it."
      return
    }
    const correct = this.lockedChoice === "nile"
    const team = this.teamNameTarget.value.trim() || "The table"
    this.statusTarget.textContent = correct
      ? `${team} locked the Nile. That's five points.`
      : `${team} locked ${this.choiceLabel(this.lockedChoice)}. The Nile was the one.`
  }

  unlock() {
    this.lockedChoice = null
    this.renderLock()
    this.statusTarget.textContent = "Buzzers are live. Press A–D or 1–4."
  }

  renderLock() {
    for (const choiceButton of this.choiceTargets) {
      const locked = choiceButton.dataset.choice === this.lockedChoice
      choiceButton.setAttribute("aria-pressed", String(locked))
      choiceButton.disabled = Boolean(this.lockedChoice) && !locked
    }
    this.lockedBannerTarget.hidden = !this.lockedChoice
    if (this.lockedChoice) {
      this.lockedBannerTarget.textContent = `Locked: ${this.choiceLabel(this.lockedChoice)}`
      this.statusTarget.textContent = `${this.teamNameTarget.value.trim() || "The table"} locked ${this.choiceLabel(this.lockedChoice)}.`
    }
  }

  startedInEditableField({ target }) {
    if (!(target instanceof Element)) return false
    return target.closest("input, textarea, select, [contenteditable='true']") !== null
  }

  choiceLabel(choice) {
    const button = this.choiceTargets.find((choiceButton) => choiceButton.dataset.choice === choice)
    return button ? button.dataset.choiceLabel : choice
  }
}
