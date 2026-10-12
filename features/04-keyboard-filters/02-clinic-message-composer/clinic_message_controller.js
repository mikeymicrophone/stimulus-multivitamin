/*
 * clinic_message_controller.js — registered as "clinic-message"
 *
 * Teaches: keyboard filters match modifiers exactly. keydown.enter fires
 * only when Shift, Ctrl, Alt, and Meta are all up; Shift+Enter is a
 * different filter, keydown.shift+enter. Both sit on the note <textarea>,
 * so Enter in the subject <input> does not send. sendNote() prevents the
 * default so Enter does not insert a newline; insertLineBreak() does not,
 * so Shift+Enter keeps the browser's newline.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["subject", "note", "thread", "status"]

  sendNote(event) {
    event.preventDefault()
    const body = this.noteTarget.value.trim()
    if (body === "") {
      this.statusTarget.textContent = "Write a note before sending."
      this.noteTarget.focus()
      return
    }
    const subject = this.subjectTarget.value.trim() || "No subject"
    this.appendToThread("Nurse Priya Nandakumar", subject, body)
    this.noteTarget.value = ""
    this.statusTarget.textContent = `Sent “${subject}” to Owen Havelock.`
    this.noteTarget.focus()
  }

  insertLineBreak() {
    this.statusTarget.textContent = "Shift+Enter keeps a newline in the note. Enter sends."
  }

  appendToThread(author, subject, body) {
    const item = document.createElement("li")
    const heading = document.createElement("strong")
    heading.textContent = `${author} · ${subject}`
    const paragraph = document.createElement("p")
    paragraph.textContent = body
    item.append(heading, paragraph)
    this.threadTarget.append(item)
    item.scrollIntoView({ block: "nearest" })
  }
}
