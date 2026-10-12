/*
 * support_chat_controller.js — registered as "support-chat"
 *
 * Teaches: moving and replacing an element that holds an observer. "Pop out"
 * moves the chat panel to a docked corner and back, which disconnects and
 * reconnects its chat-transcript instance; because disconnect() stopped the
 * observer, connect() resumes with one observer, not two. "End chat"
 * replaces the panel with the server's summary, so the transcript stops
 * observing and gives the page its title back.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["chatPanel", "inlineSlot", "dock", "popOutButton", "composerInput"]

  togglePopOut() {
    const poppedOut = this.dockTarget.contains(this.chatPanelTarget)
    const destination = poppedOut ? this.inlineSlotTarget : this.dockTarget
    destination.append(this.chatPanelTarget)
    this.popOutButtonTarget.textContent = poppedOut ? "Pop out" : "Dock back in page"
  }

  sendMessage(event) {
    event.preventDefault()
    const text = this.composerInputTarget.value.trim()
    if (text === "") return
    this.composerInputTarget.value = ""
    this.dispatch("customer-message", { detail: { text } })
  }

  async endChat() {
    try {
      const response = await fetch("chat-ended.html")
      if (!response.ok) throw new Error(`Support answered ${response.status}`)
      const summary = document.createElement("template")
      summary.innerHTML = (await response.text()).trim()
      this.chatPanelTarget.replaceWith(summary.content)
    } catch (error) {
      this.composerInputTarget.placeholder = `${error.message}. Try again.`
    }
  }
}
