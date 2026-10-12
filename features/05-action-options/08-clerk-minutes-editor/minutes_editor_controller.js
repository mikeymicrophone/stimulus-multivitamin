/*
 * minutes_editor_controller.js — registered as "minutes-editor"
 *
 * Teaches: keyboard filters and action options compose on one descriptor.
 * keydown.ctrl+s@window->minutes-editor#saveDraft:prevent (and meta+s)
 * lets :prevent cancel the browser Save dialog before saveDraft() runs.
 * The method never calls preventDefault(). Filters run before options, so
 * a non-matching key never reaches :prevent: Shift+Enter in the find
 * field still inserts a newline, because keydown.enter did not match.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["body", "findField", "findBar", "savedAt", "status", "matchCount"]

  connect() {
    this.saveCount = 0
    this.statusTarget.textContent = "Draft unsaved. Ctrl+S or ⌘S saves without the browser Save dialog."
  }

  saveDraft(event) {
    this.saveCount += 1
    const stamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })
    this.savedAtTarget.textContent = `Saved at ${stamp} (defaultPrevented=${event.defaultPrevented}). Saves this visit: ${this.saveCount}.`
    this.statusTarget.textContent = "Draft saved from the window listener. :prevent already cancelled the browser Save dialog."
  }

  openFind() {
    this.findBarTarget.hidden = false
    this.findFieldTarget.focus()
    this.statusTarget.textContent = "Find is open. Enter finds; Escape closes. Both use :prevent."
  }

  findPassage(event) {
    const needle = this.findFieldTarget.value.trim().toLowerCase()
    const haystack = this.bodyTarget.value.toLowerCase()
    if (!needle) {
      this.matchCountTarget.textContent = "Type a word to find."
      this.statusTarget.textContent = `Find ran (defaultPrevented=${event.defaultPrevented}) with an empty query, so the wrapping form did not submit.`
      return
    }
    const matches = haystack.split(needle).length - 1
    this.matchCountTarget.textContent = matches === 1 ? "1 match in the minutes." : `${matches} matches in the minutes.`
    this.statusTarget.textContent = `Find ran (defaultPrevented=${event.defaultPrevented}). :prevent stopped the form's submit; the filter skipped this for any key other than Enter.`
  }

  closeFind(event) {
    if (this.findBarTarget.hidden) return
    this.findBarTarget.hidden = true
    this.statusTarget.textContent = `Find closed from Escape (defaultPrevented=${event.defaultPrevented}).`
    this.bodyTarget.focus()
  }
}
