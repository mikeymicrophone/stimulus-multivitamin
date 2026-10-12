/*
 * refill_dialog_controller.js — registered as "refill-dialog"
 *
 * Teaches: keydown.esc@document closes the dialog even when focus is in a
 * sibling field the dialog does not contain. A local keydown.esc on the
 * dialog element would never see that key, because keydown goes to the
 * focused element and bubbles through its ancestors, not through siblings.
 * The action still runs while the dialog is closed, so dismiss() returns
 * early unless the dialog is open.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["panel", "heading", "confirmButton"]

  initialize() {
    this.isOpen = false
    this.returnFocusTo = null
  }

  disconnect() {
    if (this.isOpen) this.dismiss()
  }

  open({ currentTarget: prepareButton }) {
    this.returnFocusTo = prepareButton
    this.isOpen = true
    this.panelTarget.hidden = false
    this.confirmButtonTarget.focus()
  }

  dismiss() {
    if (!this.isOpen) return
    this.isOpen = false
    this.panelTarget.hidden = true
    this.returnFocusTo?.focus()
  }

  confirm() {
    const prescription = this.headingTarget.textContent
    this.dismiss()
    this.desk.statusTarget.textContent = `${prescription} is in pickup bin 4.`
  }

  get desk() {
    return this.application.getControllerForElementAndIdentifier(
      this.element.closest("[data-controller~='refill-desk']"),
      "refill-desk"
    )
  }
}
