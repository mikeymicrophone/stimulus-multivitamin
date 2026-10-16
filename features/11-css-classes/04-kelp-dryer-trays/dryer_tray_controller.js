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
import { report, textOf, listOr } from "../../../assets/readout.js"

export default class extends Controller {
  static classes = ["scorching", "steady"]
  static targets = ["trayName", "reading"]
  static values = { guard: Boolean }

  connect() {
    const trayName = textOf(this.trayNameTarget)
    if (!this.guardValue) {
      this.readingTarget.textContent = `${trayName} connect reached the missing class.`
      this.element.classList.add(this.scorchingClass)
    }

    const fallback = !this.hasScorchingClass
    if (fallback) this.element.classList.add(this.steadyClass)

    report(
      this.readingTarget,
      `${trayName} hasScorchingClass ${this.hasScorchingClass}.`,
      `scorchingClass ${this.hasScorchingClass ? this.scorchingClass : "(not read)"}.`,
      `scorchingClasses ${JSON.stringify(this.scorchingClasses)}.`,
      `steadyClass ${this.steadyClass}.`,
      `Fallback ${fallback}.`,
      `On the tray ${listOr(this.wornTokens, "none", " ")}.`
    )
  }

  readScorching() {
    const token = this.scorchingClass
    this.readingTarget.textContent = `${textOf(this.trayNameTarget)} scorchingClass ${token}.`
  }

  // Each singular getter is guarded by its has-property, because an
  // unguarded read of a missing class throws.
  get wornTokens() {
    return [this.hasSteadyClass && this.steadyClass, this.hasScorchingClass && this.scorchingClass]
      .filter((token) => token && this.element.classList.contains(token))
  }
}
