/*
 * job_notes_controller.js — registered as "job-notes"
 *
 * Teaches: two controllers answering one global event, and actions on
 * elements added later. The banner and the notes both declare
 * online@window; each does its own job when the connection returns. Every
 * queued note is cloned from a <template> with Retry and Discard actions
 * already in its markup, and Stimulus binds them as each note arrives.
 * visibilitychange@document is a second chance to send, for a tablet that
 * slept through the online event.
 */
import { Controller } from "@hotwired/stimulus"

const clockTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })

export default class extends Controller {
  static targets = ["noteField", "outbox", "outboxHeading", "queuedNote", "queuedNoteTemplate", "sentList", "status"]
  static values = { deliveryUrl: String }

  connect() {
    this.renderOutbox()
  }

  async saveNote(event) {
    event.preventDefault()
    const noteText = this.noteFieldTarget.value.trim()
    if (noteText === "") return
    this.noteFieldTarget.value = ""
    const note = this.queueNote(noteText)
    if (navigator.onLine) await this.deliver(note)
  }

  async retryNote({ currentTarget: retryButton }) {
    const note = retryButton.closest('[data-job-notes-target="queuedNote"]')
    if (!navigator.onLine) {
      this.statusTarget.textContent = "Still offline. The note will go out on its own when the connection returns."
      return
    }
    await this.deliver(note)
  }

  discardNote({ currentTarget: discardButton }) {
    discardButton.closest('[data-job-notes-target="queuedNote"]').remove()
    this.statusTarget.textContent = "Note discarded."
    this.renderOutbox()
  }

  async sendQueuedNotes() {
    for (const note of this.queuedNoteTargets) await this.deliver(note)
  }

  sendQueuedNotesIfVisible() {
    if (document.visibilityState === "visible" && navigator.onLine) this.sendQueuedNotes()
  }

  // Called from saveNote, retryNote, and both global events, which can
  // overlap, so a note already on its way is left alone.
  async deliver(note) {
    if (note.dataset.delivery === "sending" || !note.isConnected) return
    note.dataset.delivery = "sending"
    note.querySelector("[data-delivery-state]").textContent = "Sending…"
    try {
      const response = await fetch(this.deliveryUrlValue, { cache: "no-store" })
      if (!response.ok) throw new Error(`The dispatch office answered ${response.status}.`)
      this.markSent(note)
    } catch {
      note.dataset.delivery = "waiting"
      note.querySelector("[data-delivery-state]").textContent = "Not sent yet"
    }
    this.renderOutbox()
  }

  queueNote(noteText) {
    const note = this.queuedNoteTemplateTarget.content.firstElementChild.cloneNode(true)
    note.querySelector("[data-note-text]").textContent = noteText
    note.querySelector("[data-note-time]").textContent = clockTime.format(new Date())
    this.outboxTarget.append(note)
    this.renderOutbox()
    return note
  }

  markSent(note) {
    const sentNote = document.createElement("li")
    sentNote.textContent = `${clockTime.format(new Date())} · ${note.querySelector("[data-note-text]").textContent}`
    this.sentListTarget.prepend(sentNote)
    note.remove()
  }

  renderOutbox() {
    const waitingCount = this.queuedNoteTargets.length
    this.outboxHeadingTarget.textContent = `Waiting to send (${waitingCount})`
    this.outboxHeadingTarget.parentElement.hidden = waitingCount === 0
  }
}
