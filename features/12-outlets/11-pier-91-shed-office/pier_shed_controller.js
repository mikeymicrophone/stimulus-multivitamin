/*
 * pier_shed_controller.js — registered as "pier-shed"
 *
 * Teaches: outlet "lamp" on identifier pier-shed reads
 * data-pier-shed-lamp-outlet. That is the pier's shed-lamp
 * attribute. The lamp token is a different controller on the
 * same element the pier calls a shed-lamp.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["lamp"]
  static targets = ["reading"]

  connect() {
    this.paint("connected")
  }

  lampOutletConnected(_outlet, element) {
    this.write(`Shed lamp connected ${element.id}.`)
  }

  lampOutletDisconnected(_outlet, element) {
    this.write(`Shed lamp disconnected ${element.id}.`)
  }

  paint(reason) {
    this.readingTarget.textContent = `Shed lamp ${this.lampOutletElement.id}. ${reason}`
  }

  write(line) {
    const log = this.element.querySelector("[data-shed-log]")
    log.textContent = `${log.textContent}${line}\n`
  }
}
