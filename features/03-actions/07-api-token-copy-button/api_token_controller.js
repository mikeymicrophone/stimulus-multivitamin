/*
 * api_token_controller.js — registered as "api-token"
 *
 * Teaches: what the event object still knows after an await. During the
 * click, event.currentTarget is the Copy or Roll button; once an action
 * awaits anything that takes a task (the clipboard, a fetch, a timer), the
 * event has finished dispatching and currentTarget is null. Every async
 * action here takes what it needs from the event before its first await.
 * It also catches its own failures: a rejected promise from an action
 * never reaches application.handleError().
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["display", "revealButton", "revealLabel", "copyLabel", "rollButton", "lastFour", "status"]
  static values = { secret: String, revealed: Boolean, rollUrl: String }

  initialize() {
    this.copiedLabelTimer = null
  }

  disconnect() {
    clearTimeout(this.copiedLabelTimer)
  }

  toggleReveal() {
    this.revealedValue = !this.revealedValue
  }

  async copySecret({ currentTarget: copyButton }) {
    try {
      await navigator.clipboard.writeText(this.secretValue)
      this.showCopied()
      copyButton.focus()
    } catch {
      this.selectSecretForManualCopy()
    }
  }

  // A manual Ctrl+C on the masked text would copy the dots. The copy event
  // carries clipboardData, so the action can put the real token there.
  copyFullSecret(event) {
    event.preventDefault()
    event.clipboardData.setData("text/plain", this.secretValue)
    this.showCopied()
  }

  async rollSecret({ currentTarget: rollButton }) {
    rollButton.disabled = true
    this.statusTarget.textContent = "Rolling…"
    try {
      const response = await fetch(this.rollUrlValue)
      if (!response.ok) throw new Error(`The API answered ${response.status}.`)
      const { secret } = await response.json()
      this.secretValue = secret
      this.revealedValue = true
      this.statusTarget.textContent = "New token issued. The old one stops working in 24 hours."
    } catch (error) {
      this.statusTarget.textContent = `Couldn't roll this token. ${error.message}`
    } finally {
      rollButton.disabled = false
    }
  }

  secretValueChanged() {
    this.lastFourTarget.textContent = this.secretValue.slice(-4)
    this.renderDisplay()
  }

  revealedValueChanged() {
    this.revealLabelTarget.textContent = this.revealedValue ? "Hide" : "Reveal"
    this.revealButtonTarget.setAttribute("aria-pressed", String(this.revealedValue))
    this.renderDisplay()
  }

  renderDisplay() {
    const [prefix] = this.secretValue.match(/^[a-z]+_[a-z]+_/) ?? [""]
    const shownText = this.revealedValue ? this.secretValue : `${prefix}${"•".repeat(16)}${this.secretValue.slice(-4)}`
    if (this.displayTarget.textContent !== shownText) this.displayTarget.textContent = shownText
  }

  showCopied() {
    this.copyLabelTarget.textContent = "Copied"
    this.statusTarget.textContent = "Token copied to the clipboard."
    clearTimeout(this.copiedLabelTimer)
    this.copiedLabelTimer = setTimeout(() => {
      this.copyLabelTarget.textContent = "Copy"
    }, 2000)
  }

  // revealedValueChanged() runs after this method returns, so render now
  // and select the text it would otherwise replace.
  selectSecretForManualCopy() {
    this.revealedValue = true
    this.renderDisplay()
    window.getSelection().selectAllChildren(this.displayTarget)
    this.statusTarget.textContent = "This browser blocked clipboard access. The token is selected: press Ctrl+C (⌘C on a Mac)."
  }
}
