/*
 * fare_guide_controller.js — registered as "fare-guide"
 *
 * Teaches: application.registerActionOption("open", callback) receives
 * { name, value, event, element, controller }. :open yields value true;
 * :!open yields false. Returning false blocks the action; any other
 * return, including undefined, also blocks because Stimulus ANDs the
 * callback result. This callback returns true when event.target.open
 * equals value, so announceOpen runs on open and announceClosed on close.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["payloadLog", "actionLog", "status"]

  connect() {
    this.statusTarget.textContent = "Open a fare topic. The option callback logs name, value, event, element, and controller before the action runs."
  }

  recordPayload(payload) {
    const line = document.createElement("li")
    line.textContent = `option ${payload.name} value=${payload.value} event=${payload.eventType} element=${payload.elementId} controller=${payload.identifier} topic=${payload.paramTopic}`
    this.payloadLogTarget.append(line)
  }

  announceOpen({ currentTarget: topic }) {
    this.appendAction(`opened ${topic.id}`)
    this.statusTarget.textContent = `Opened ${topic.querySelector("summary").textContent}. :open returned true because the details is open.`
  }

  announceClosed({ currentTarget: topic }) {
    this.appendAction(`closed ${topic.id}`)
    this.statusTarget.textContent = `Closed ${topic.querySelector("summary").textContent}. :!open returned true because the details is shut.`
  }

  appendAction(label) {
    const line = document.createElement("li")
    line.textContent = label
    this.actionLogTarget.append(line)
  }
}
