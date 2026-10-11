/*
 * grant_application_controller.js — registered as "grant-application"
 *
 * Teaches: page-level actions that move and replace autosaving editors.
 * Focus mode moves a section's editor into a <dialog> and back, which
 * disconnects and reconnects the same draft-autosave instance. Submitting
 * replaces the whole form with server HTML, which disconnects every editor
 * for good, so each editor is told first that its draft is no longer needed.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "editor", "focusDialog", "focusDialogBody", "submitStatus"]

  openFocusMode(event) {
    const editor = event.target.closest('[data-grant-application-target="editor"]')
    this.focusPlaceholder = document.createComment("editor in focus mode")
    editor.replaceWith(this.focusPlaceholder)
    this.focusDialogBodyTarget.append(editor)
    this.focusDialogTarget.showModal()
    editor.querySelector("textarea").focus()
  }

  closeFocusMode() {
    const editor = this.focusDialogBodyTarget.firstElementChild
    if (!editor || !this.focusPlaceholder) return
    this.focusPlaceholder.replaceWith(editor)
    this.focusPlaceholder = null
    editor.querySelector("textarea").focus()
  }

  async submitApplication(event) {
    event.preventDefault()
    const emptySections = this.editorTargets.filter((editor) => editor.querySelector("textarea").value.trim() === "")
    if (emptySections.length > 0) {
      this.submitStatusTarget.textContent = `Fill in ${emptySections.map((editor) => editor.querySelector("label").textContent.trim()).join(" and ")} before submitting.`
      return
    }

    let confirmation
    try {
      const response = await fetch("submitted.html")
      if (!response.ok) throw new Error(`The foundation's portal answered ${response.status}`)
      confirmation = await response.text()
    } catch (error) {
      this.submitStatusTarget.textContent = `${error.message}. Your text is still here; try again.`
      return
    }

    // Replacing the form disconnects every editor, and disconnect() saves
    // pending changes. Tell each one the draft is finished first, or it
    // would write the draft back right after submission cleared it.
    for (const editor of this.editorTargets) {
      this.application.getControllerForElementAndIdentifier(editor, "draft-autosave")?.markSubmitted()
    }
    this.formTarget.outerHTML = confirmation
  }
}
