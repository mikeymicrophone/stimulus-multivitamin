/*
 * recipe_editor_controller.js — registered as "recipe-editor"
 *
 * Teaches: a controller that exists only while its identifier is in the
 * element's data-controller list. No card starts with it. recipe-card adds
 * the token to begin editing; this controller removes its own token
 * (this.identifier) to finish, and Stimulus calls disconnect(), which undoes
 * everything connect() did. Its toolbar buttons are in the markup all along,
 * but their recipe-editor actions do nothing until an instance is connected.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["title", "notes", "toolbar", "message", "startButton"]

  connect() {
    this.originalTitle = this.titleTarget.textContent
    this.originalNotes = this.notesTarget.textContent

    // Once "recipe-editor" leaves data-controller, this element no longer
    // matches the controller's scope, so targets cannot be looked up in
    // disconnect(). Keep the elements that disconnect() has to restore.
    this.editableFields = [this.titleTarget, this.notesTarget]
    this.toolbar = this.toolbarTarget
    this.startButton = this.startButtonTarget

    for (const editableField of this.editableFields) {
      editableField.contentEditable = "true"
    }
    this.element.classList.add("editing")
    this.toolbar.hidden = false
    this.startButton.hidden = true
    this.messageTarget.textContent = ""
    this.titleTarget.focus()
  }

  disconnect() {
    for (const editableField of this.editableFields) {
      editableField.removeAttribute("contenteditable")
    }
    this.element.classList.remove("editing")
    this.toolbar.hidden = true
    this.startButton.hidden = false
  }

  save() {
    const editedTitle = this.titleTarget.textContent.trim()
    if (editedTitle === "") {
      this.messageTarget.textContent = "A recipe needs a name."
      this.titleTarget.focus()
      return
    }
    this.titleTarget.textContent = editedTitle
    this.notesTarget.textContent = this.notesTarget.textContent.trim()
    this.stopEditing()
  }

  cancel() {
    this.titleTarget.textContent = this.originalTitle
    this.notesTarget.textContent = this.originalNotes
    this.stopEditing()
  }

  stopEditing() {
    const remainingIdentifiers = this.element.dataset.controller
      .split(/\s+/)
      .filter((identifier) => identifier !== this.identifier)
    this.element.dataset.controller = remainingIdentifiers.join(" ")
  }
}
