/*
 * tide_desk_controller.js — registered as "tide-desk"
 *
 * Teaches: horn comes from the parent class. bell is declared
 * here. Both attributes use tide-desk. The chart-desk horn
 * attribute is on the element and is not read.
 */
import ChartDeskController from "./chart_desk_controller.js"

export default class extends ChartDeskController {
  static outlets = ["bell"]
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = [
      `Horn ${this.hornOutletElement.id}.`,
      `Bell ${this.bellOutletElement.id}.`,
      `Own attribute ${this.element.getAttribute("data-tide-desk-horn-outlet")}.`,
      `Parent attribute ${this.element.getAttribute("data-chart-desk-horn-outlet")}.`
    ].join(" ")
  }
}
