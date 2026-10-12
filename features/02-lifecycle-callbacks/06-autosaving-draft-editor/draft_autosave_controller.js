/*
 * draft_autosave_controller.js — registered as "draft-autosave"
 *
 * Teaches: deciding where each job goes. initialize() restores the saved
 * draft and records the session's starting word count, once per instance,
 * because focus mode moves this element and a move runs connect() again.
 * disconnect() saves any pending changes instead of dropping them, because
 * a move, a removal, or a page swap all end the same way. disconnect() never
 * runs when the tab closes, so a pagehide@window action saves then too. After
 * the application is submitted, markSubmitted() stops disconnect() from
 * writing the draft back.
 */
import { Controller } from "@hotwired/stimulus"

const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })

export default class extends Controller {
  static targets = ["field", "saveStatus", "wordProgress", "restoredNotice"]
  static values = {
    storageKey: String,
    debounceMilliseconds: { type: Number, default: 1500 },
  }

  initialize() {
    this.pendingSave = null
    this.submitted = false
    this.restoreDraft()
    this.sessionStartWordCount = this.wordCount
  }

  connect() {
    this.renderWordProgress()
  }

  disconnect() {
    this.flushPendingSave()
  }

  fieldChanged() {
    clearTimeout(this.pendingSave)
    this.pendingSave = setTimeout(() => this.saveNow(), this.debounceMillisecondsValue)
    this.saveStatusTarget.textContent = "Unsaved changes…"
    this.renderWordProgress()
  }

  flushPendingSave() {
    if (this.pendingSave !== null) this.saveNow()
  }

  flushIfHidden() {
    if (document.visibilityState === "hidden") this.flushPendingSave()
  }

  saveNow() {
    clearTimeout(this.pendingSave)
    this.pendingSave = null
    if (this.submitted) return
    const savedAt = new Date()
    localStorage.setItem(this.storageKeyValue, JSON.stringify({ text: this.fieldTarget.value, savedAt: savedAt.toISOString() }))
    this.saveStatusTarget.textContent = `Draft saved at ${timeFormatter.format(savedAt)}`
  }

  markSubmitted() {
    clearTimeout(this.pendingSave)
    this.pendingSave = null
    this.submitted = true
    localStorage.removeItem(this.storageKeyValue)
  }

  discardDraft() {
    clearTimeout(this.pendingSave)
    this.pendingSave = null
    localStorage.removeItem(this.storageKeyValue)
    this.fieldTarget.value = this.fieldTarget.defaultValue
    this.restoredNoticeTarget.hidden = true
    this.saveStatusTarget.textContent = "Draft discarded"
    this.renderWordProgress()
  }

  restoreDraft() {
    const savedDraft = this.readSavedDraft()
    if (savedDraft === null || savedDraft.text === this.fieldTarget.value) return
    this.fieldTarget.value = savedDraft.text
    this.restoredNoticeTarget.hidden = false
    this.restoredNoticeTarget.querySelector("[data-saved-time]").textContent = timeFormatter.format(new Date(savedDraft.savedAt))
  }

  readSavedDraft() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKeyValue))
    } catch {
      return null
    }
  }

  renderWordProgress() {
    const wordsThisSession = this.wordCount - this.sessionStartWordCount
    const sign = wordsThisSession < 0 ? "−" : "+"
    this.wordProgressTarget.textContent = `${this.wordCount} words · ${sign}${Math.abs(wordsThisSession)} this session`
  }

  get wordCount() {
    return this.fieldTarget.value.split(/\s+/).filter((word) => word.length > 0).length
  }
}
