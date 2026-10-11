/*
 * listing_draft_controller.js — registered as "listing-draft"
 *
 * Teaches: connect order on a shared element follows the order of
 * identifiers in data-controller. This controller is listed first on every
 * field, so it restores a saved draft into the field before the character
 * budget and the fair-housing check connect and read it. When it changes
 * the field later (discarding a draft), it fires an input event so the
 * sibling controllers re-read the field through their own actions, without
 * this controller knowing they exist.
 */
import { Controller } from "@hotwired/stimulus"

const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })

export default class extends Controller {
  static targets = ["field", "status", "discardButton"]
  static values = { storageKey: String }

  connect() {
    const savedDraft = this.readDraft()
    if (savedDraft && savedDraft.copy !== this.fieldTarget.value) {
      this.fieldTarget.value = savedDraft.copy
      this.showStatus(`Restored your draft from ${timeFormatter.format(new Date(savedDraft.savedAt))}`)
    } else {
      this.showStatus("Matches the published listing")
    }
  }

  save() {
    if (this.fieldTarget.value === this.fieldTarget.defaultValue) {
      this.forgetDraft()
      this.showStatus("Matches the published listing")
      return
    }
    const savedAt = Date.now()
    if (this.writeDraft({ copy: this.fieldTarget.value, savedAt })) {
      this.showStatus(`Draft saved at ${timeFormatter.format(new Date(savedAt))}`)
    } else {
      this.showStatus("This browser is not keeping drafts")
    }
  }

  discard() {
    this.forgetDraft()
    this.fieldTarget.value = this.fieldTarget.defaultValue
    this.fieldTarget.dispatchEvent(new Event("input", { bubbles: true }))
  }

  showStatus(message) {
    this.statusTarget.textContent = message
    this.discardButtonTarget.disabled = this.readDraft() === null
  }

  // Private browsing modes can throw on any localStorage access.
  readDraft() {
    try {
      return JSON.parse(window.localStorage.getItem(this.storageKeyValue))
    } catch {
      return null
    }
  }

  writeDraft(draft) {
    try {
      window.localStorage.setItem(this.storageKeyValue, JSON.stringify(draft))
      return true
    } catch {
      return false
    }
  }

  forgetDraft() {
    try {
      window.localStorage.removeItem(this.storageKeyValue)
    } catch {
      // Nothing was stored, so there is nothing to forget.
    }
  }
}
