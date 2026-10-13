/*
 * retort_floor_controller.js — registered as "retort-floor"
 *
 * Teaches: the shell element matches the selector and carries
 * data-controller="retort-shell", but that controller is not
 * registered. hasRetortShellOutlet is true. retortShellOutletElement
 * returns the shell. retortShellOutlets warns and is empty.
 * retortShellOutlet throws the missing-instance error. Registering
 * the controller later fires the callback before the shell's
 * connect().
 */
import { Controller } from "@hotwired/stimulus"
import RetortShellController from "./retort_shell_controller.js"

export default class extends Controller {
  static outlets = ["retort-shell"]
  static targets = ["basket", "reading", "fault", "log"]

  connect() {
    this.warnCount = 0
    this.lastWarn = ""
    const originalWarn = console.warn
    console.warn = (...args) => {
      this.warnCount += 1
      this.lastWarn = String(args[0])
      originalWarn.apply(console, args)
    }
    const outlets = this.retortShellOutlets
    console.warn = originalWarn
    const elementIds = this.retortShellOutletElements.map((element) => element.id)
    const basketId = this.basketTarget.id
    const basketPlace = elementIds.includes(basketId) ? "included" : "excluded"
    this.readingTarget.textContent = [
      `hasRetortShellOutlet ${this.hasRetortShellOutlet}.`,
      `Elements ${elementIds.join(" ")}.`,
      `Outlets ${outlets.length}.`,
      `Basket ${basketId} ${basketPlace}.`,
      `Warns ${this.warnCount}.`,
      this.lastWarn
    ].join(" ")
  }

  retortShellOutletConnected(_outlet, element) {
    const cook = element.dataset.cook || "missing"
    this.write(`Connected ${element.id}. Cook ${cook}.`)
  }

  readShell() {
    try {
      const shell = this.retortShellOutlet
      this.faultTarget.textContent = `Shell ${shell.element.id}.`
    } catch (error) {
      this.faultTarget.textContent = `${error.name}: ${error.message}`
    }
  }

  registerShell() {
    this.application.register("retort-shell", RetortShellController)
    this.write("Registered retort-shell.")
  }

  write(line) {
    this.logTarget.textContent = `${this.logTarget.textContent}${line}\n`
  }
}
