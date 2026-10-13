/*
 * skiff_line_controller.js — registered as "skiff-line"
 *
 * Teaches: changing data-skiff-line-skiff-outlet moves the
 * outlet. Removing the attribute clears it. Adding the
 * skiff controller token to an element the selector already
 * names connects that outlet, and the callback runs before
 * the skiff's connect().
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["skiff"]
  static targets = ["gull", "log"]

  connect() {
    this.write(`Line connected. hasSkiffOutlet ${this.hasSkiffOutlet}. Holding ${this.holding()}.`)
  }

  skiffOutletConnected(outlet, element) {
    const paint = element.dataset.paint || "missing"
    this.write(`Connected ${outlet.boatValue}. Paint ${paint}.`)
  }

  skiffOutletDisconnected(outlet) {
    this.write(`Disconnected ${outlet.boatValue}.`)
  }

  followMurrelet() {
    this.element.setAttribute("data-skiff-line-skiff-outlet", "#skiff-murrelet")
  }

  clearLine() {
    this.element.removeAttribute("data-skiff-line-skiff-outlet")
    this.write(`Line cleared. hasSkiffOutlet ${this.hasSkiffOutlet}.`)
  }

  putGullOnTheLine() {
    this.element.setAttribute("data-skiff-line-skiff-outlet", "#skiff-gull")
    this.gullTarget.setAttribute("data-controller", "skiff")
    this.gullTarget.setAttribute("data-skiff-boat-value", "Gull")
  }

  holding() {
    return this.hasSkiffOutlet ? this.skiffOutletElement.id : "none"
  }

  write(line) {
    this.logTarget.textContent = `${this.logTarget.textContent}${line}\n`
  }
}
