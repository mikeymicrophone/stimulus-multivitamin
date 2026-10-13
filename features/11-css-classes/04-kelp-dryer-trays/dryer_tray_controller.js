/*
 * dryer_tray_controller.js — registered as "dryer-tray"
 *
 * Teaches: hasScorchingClass is false when the attribute is absent.
 * scorchingClasses is [] and does not throw. scorchingClass throws
 * Error: Missing attribute "data-dryer-tray-scorching-class".
 * A guarded tray that lacks scorching falls back to steadyClass.
 * An unguarded tray reads scorchingClass from connect(), which
 * stops the rest of connect() and is reported as
 * "Error connecting controller". The same read from an action is
 * "Error invoking action".
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["scorching", "steady"]
  static targets = ["trayName", "reading"]
  static values = { guard: Boolean }

  connect() {
    const trayName = this.trayNameTarget.textContent.trim()
    if (!this.guardValue) {
      this.readingTarget.textContent = `${trayName} connect reached the missing class.`
      this.element.classList.add(this.scorchingClass)
    }

    const fallback = !this.hasScorchingClass
    if (fallback) this.element.classList.add(this.steadyClass)

    const scorchingToken = this.hasScorchingClass ? this.scorchingClass : "(not read)"
    this.readingTarget.textContent = [
      `${trayName} hasScorchingClass ${this.hasScorchingClass}.`,
      `scorchingClass ${scorchingToken}.`,
      `scorchingClasses ${JSON.stringify(this.scorchingClasses)}.`,
      `steadyClass ${this.steadyClass}.`,
      `Fallback ${fallback}.`,
      `On the tray ${this.onTheTray()}.`
    ].join(" ")
  }

  readScorching() {
    const token = this.scorchingClass
    this.readingTarget.textContent = `${this.trayNameTarget.textContent.trim()} scorchingClass ${token}.`
  }

  onTheTray() {
    const tokens = []
    if (this.hasSteadyClass) tokens.push(this.steadyClass)
    if (this.hasScorchingClass) tokens.push(this.scorchingClass)
    const present = tokens.filter((token) => this.element.classList.contains(token))
    return present.length ? present.join(" ") : "none"
  }
}
