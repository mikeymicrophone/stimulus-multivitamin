/*
 * legal_brief_controller.js — registered as "legal-brief"
 *
 * Teaches: there is no cmdorctrl modifier. Save is declared twice,
 * keydown.meta+s@window and keydown.ctrl+s@window, so Command+S on macOS
 * and Control+S elsewhere both reach saveBrief(). The same pair exists
 * for Shift+S (exhibit stamp) and B (bold). The listeners sit on window,
 * so they run while the caret is in the contenteditable affidavit, the
 * caption <input>, or the notes <textarea> — keydown bubbles from all
 * three. preventDefault() stops the browser's Save dialog.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["affidavit", "caption", "notes", "status", "savedAt"]

  initialize() {
    this.saveCount = 0
    this.exhibitCount = 0
  }

  saveBrief(event) {
    if (event instanceof KeyboardEvent) event.preventDefault()
    this.saveCount += 1
    const stamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })
    this.savedAtTarget.textContent = `Saved at ${stamp}`
    const viaShortcut = event instanceof KeyboardEvent ? ` (${this.modifierLabel(event)}+S)` : ""
    this.statusTarget.textContent = `Saved the ${this.captionTarget.value.trim() || "affidavit"} from ${this.fieldName(event)}${viaShortcut}.`
  }

  stampExhibit(event) {
    if (event instanceof KeyboardEvent) event.preventDefault()
    this.exhibitCount += 1
    const stamp = `Exhibit ${["A", "B", "C", "D"][this.exhibitCount - 1] || this.exhibitCount}`
    this.statusTarget.textContent = `Stamped ${stamp} from ${this.fieldName(event)} (${this.modifierLabel(event)}+Shift+S).`
  }

  toggleBold(event) {
    event.preventDefault()
    const selection = window.getSelection()
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null
    if (!range || range.collapsed || !this.affidavitTarget.contains(range.commonAncestorContainer)) {
      this.statusTarget.textContent = "Bold applies to a selection inside the affidavit. The caption and notes stay plain text."
      return
    }
    const strong = document.createElement("strong")
    strong.append(range.extractContents())
    range.insertNode(strong)
    this.statusTarget.textContent = "Bolded the selected phrase in the affidavit."
  }

  fieldName({ target }) {
    if (target === this.captionTarget) return "the caption field"
    if (target === this.notesTarget) return "the notes field"
    if (this.affidavitTarget.contains(target) || target === this.affidavitTarget) return "the affidavit"
    return "the page"
  }

  modifierLabel(event) {
    if (event.metaKey) return "Meta"
    if (event.ctrlKey) return "Ctrl"
    return "modifier"
  }
}
