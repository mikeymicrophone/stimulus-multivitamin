/*
 * unsaved_changes_controller.js — registered as "unsaved-changes"
 *
 * Teaches: naming action methods for what they do, not for the event that
 * triggers them. The markup reads as a sentence: input->trackChanges,
 * submit->saveProfile, reset->discardChanges,
 * beforeunload@window->warnBeforeUnload, click->confirmLeaving. The form's
 * own actions hear events that bubble up from every field, including
 * emergency contacts added after the page loaded.
 */
import { Controller } from "@hotwired/stimulus"

const savedAtFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })

export default class extends Controller {
  static targets = ["contactList", "contact", "contactTemplate", "saveButton", "changeBadge", "status", "leaveDialog"]

  connect() {
    this.savedEntries = this.currentEntries
    this.pendingDestination = null
    this.leavingOnPurpose = false
    this.renderChangeBadge()
  }

  trackChanges() {
    this.renderChangeBadge()
  }

  addEmergencyContact() {
    const contact = this.appendContactRow()
    contact.querySelector("input").focus()
    this.trackChanges()
  }

  removeEmergencyContact({ currentTarget: removeButton }) {
    removeButton.closest('[data-unsaved-changes-target="contact"]').remove()
    this.trackChanges()
  }

  async saveProfile(event) {
    event.preventDefault()
    if (!this.hasUnsavedChanges) return
    this.saveButtonTarget.disabled = true
    this.statusTarget.textContent = "Saving…"
    const entriesBeingSaved = this.currentEntries
    await new Promise((resolve) => setTimeout(resolve, 300))
    this.savedEntries = entriesBeingSaved
    this.statusTarget.textContent = `Saved at ${savedAtFormat.format(new Date())}.`
    this.renderChangeBadge()
  }

  // A native reset would put back the values in the page's markup, not the
  // last save, and the reset event fires before any field changes.
  discardChanges(event) {
    event.preventDefault()
    this.restore(this.savedEntries)
    this.statusTarget.textContent = "Changes discarded."
    this.renderChangeBadge()
  }

  warnBeforeUnload(event) {
    if (!this.hasUnsavedChanges || this.leavingOnPurpose) return
    event.preventDefault()
    event.returnValue = ""
  }

  confirmLeaving(event) {
    if (!this.hasUnsavedChanges) return
    event.preventDefault()
    this.pendingDestination = event.currentTarget.href
    this.leaveDialogTarget.showModal()
  }

  keepEditing() {
    this.pendingDestination = null
    this.leaveDialogTarget.close()
  }

  leaveWithoutSaving() {
    this.leavingOnPurpose = true
    window.location.assign(this.pendingDestination)
  }

  renderChangeBadge() {
    const unsaved = this.hasUnsavedChanges
    this.changeBadgeTarget.hidden = !unsaved
    this.saveButtonTarget.disabled = !unsaved
  }

  appendContactRow() {
    const contact = this.contactTemplateTarget.content.firstElementChild.cloneNode(true)
    this.contactListTarget.append(contact)
    return contact
  }

  restore(entries) {
    const savedContactCount = entries.filter(([name]) => name === "contact_name").length
    while (this.contactTargets.length > savedContactCount) this.contactTargets.at(-1).remove()
    while (this.contactTargets.length < savedContactCount) this.appendContactRow()

    const savedValuesByName = new Map()
    for (const [name, value] of entries) savedValuesByName.set(name, [...(savedValuesByName.get(name) ?? []), value])
    for (const field of this.element.elements) {
      if (!field.name) continue
      const savedValues = savedValuesByName.get(field.name) ?? []
      if (field.type === "checkbox" || field.type === "radio") {
        field.checked = savedValues.includes(field.value)
      } else {
        field.value = savedValues.shift() ?? ""
      }
    }
  }

  get currentEntries() {
    return [...new FormData(this.element).entries()].map(([name, value]) => [name, String(value)])
  }

  get hasUnsavedChanges() {
    return JSON.stringify(this.currentEntries) !== JSON.stringify(this.savedEntries)
  }
}
