/*
 * online_banking_controller.js — registered as "online-banking"
 *
 * Teaches: a long-lived controller that swaps the session area for server
 * HTML. Signing out replaces the signed-in markup, which disconnects its
 * session-timeout instance; signing back in inserts new markup, which
 * builds a new instance. Whether the old instance cleaned up is easy to see:
 * a leaked timer would show a warning on the signed-out page.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["sessionArea"]

  async signOut(event) {
    const timedOut = event.type === "session-timeout:expired"
    await this.showSessionPage("sessions/signed-out.html")
    const reason = this.sessionAreaTarget.querySelector("[data-sign-out-reason]")
    if (reason) {
      reason.textContent = timedOut
        ? "For your security, we signed you out after a period of inactivity."
        : "You signed out. Thanks for banking with Riverbend."
    }
  }

  async signIn() {
    await this.showSessionPage("sessions/signed-in.html")
  }

  async showSessionPage(path) {
    try {
      const response = await fetch(path)
      if (!response.ok) throw new Error(`The bank answered ${response.status}`)
      this.sessionAreaTarget.innerHTML = await response.text()
    } catch (error) {
      this.sessionAreaTarget.textContent = `We couldn't reach online banking. ${error.message}`
    }
  }
}
