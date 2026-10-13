/*
 * pier_controller.js — registered as "pier"
 *
 * Teaches: shed-lamp's attribute is data-pier-shed-lamp-outlet,
 * the same string pier-shed uses for lamp. pile-lamp does not
 * share it. Pointing the shared attribute at the spare moves
 * the pier's shed lamp and the shed's lamp together.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["shed-lamp", "pile-lamp"]
  static targets = ["reading"]

  connect() {
    this.paint("connected")
  }

  shedLampOutletConnected(_outlet, element) {
    this.writeShed(`Pier shed connected ${element.id}.`)
  }

  shedLampOutletDisconnected(_outlet, element) {
    this.writeShed(`Pier shed disconnected ${element.id}.`)
  }

  pointAtSpare() {
    this.element.setAttribute("data-pier-shed-lamp-outlet", "#spare-lamp")
    queueMicrotask(() => {
      this.paint("spare")
      this.application.getControllerForElementAndIdentifier(this.element, "pier-shed").paint("spare")
    })
  }

  paint(reason) {
    this.readingTarget.textContent = [
      `Pier shed-lamp ${this.shedLampOutletElement.id}.`,
      `Pier pile-lamp ${this.pileLampOutletElement.id}.`,
      reason
    ].join(" ")
  }

  writeShed(line) {
    const log = this.element.querySelector("[data-shed-log]")
    log.textContent = `${log.textContent}${line}\n`
  }
}
