/*
 * lens_drawer_controller.js — registered as "lens-cabinet"
 * and again as "spare-cabinet"
 *
 * Teaches: one constructor can be registered under more than
 * one identifier. this.identifier is the one on the element.
 * afterLoad runs once per register() call, with that
 * identifier. The instance is instanceof the class you
 * passed, and its constructor is a blessed subclass, not
 * that class.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static cabinetKind = "Fresnel"
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = `${this.identifier} is open.`
  }

  fileDrawer() {
    this.readingTarget.textContent = `${this.identifier} filed the north drawer.`
  }

  static afterLoad(identifier, application) {
    const tape = document.getElementById("load-tape")
    const root = application.element.tagName
    const line = `${identifier} ${this.cabinetKind} ${root}.`
    const prior = tape.dataset.started === "yes" ? tape.textContent : ""
    tape.dataset.started = "yes"
    tape.textContent = prior ? `${prior} ${line}` : line
  }
}
