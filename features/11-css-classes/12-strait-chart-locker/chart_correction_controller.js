/*
 * chart_correction_controller.js — registered as "chart-correction"
 *
 * Teaches: staleClass and freshClass read the attribute on every
 * get. Two reads are not the same array. Pushing on the array
 * does not change the next read. Rewriting the attribute does not
 * run a callback and does not increment the read count. Assigning
 * staleClass throws TypeError because the property has only a
 * getter, and the instance is named extended. A camelCase or
 * underscore attribute is a miss, so the singular getter throws
 * Missing attribute for the kebab-case name.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["stale", "fresh"]
  static targets = ["plateName", "reading", "fault"]

  connect() {
    this.reads = 1
    const plateName = this.plateNameTarget.textContent.trim()
    try {
      const token = this.staleClass
      const sameList = this.staleClasses === this.staleClasses
      this.readingTarget.textContent = [
        `${plateName} staleClass ${token}.`,
        `Reads ${this.reads}.`,
        `Same list ${sameList}.`,
        `freshClass ${this.freshClass}.`
      ].join(" ")
    } catch (error) {
      this.readingTarget.textContent = [
        `${plateName} threw ${error.name}: ${error.message}.`,
        `Kebab attribute ${shown(this.element.getAttribute("data-chart-correction-stale-class"))}.`,
        `Lowercased attribute ${shown(this.element.getAttribute("data-chart-correction-staleclass"))}.`,
        `Underscore attribute ${shown(this.element.getAttribute("data-chart-correction-stale_class"))}.`,
        `freshClass ${this.hasFreshClass ? this.freshClass : "absent"}.`
      ].join(" ")
    }
  }

  correctPlate() {
    const plateName = this.plateNameTarget.textContent.trim()
    const previous = this.staleClass
    const tokens = this.staleClasses
    tokens.push(this.freshClass)
    this.element.setAttribute("data-chart-correction-stale-class", this.freshClass)
    this.element.classList.remove(previous)
    this.element.classList.add(this.staleClass)
    this.readingTarget.textContent = [
      `${plateName} staleClass ${this.staleClass}.`,
      `Reads ${this.reads}.`,
      `Pushed list ${JSON.stringify(tokens)}.`,
      `Next classes ${JSON.stringify(this.staleClasses)}.`
    ].join(" ")
  }

  assignClass() {
    try {
      this.staleClass = this.freshClass
    } catch (error) {
      this.faultTarget.textContent = `Assign threw ${error.name}: ${error.message}`
    }
  }

  readUnguarded() {
    this.readingTarget.textContent = this.staleClass
  }
}

function shown(value) {
  return value === null ? "absent" : value
}
