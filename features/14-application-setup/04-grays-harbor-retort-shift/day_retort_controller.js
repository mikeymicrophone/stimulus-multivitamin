/*
 * day_retort_controller.js — registered as "day-retort"
 *
 * Teaches: static get shouldLoad() returning true is the
 * default shape. The getter is what load() checks.
 */
import { Controller } from "@hotwired/stimulus"
import { writeKettle } from "./kettle_log.js"

export default class extends Controller {
  static get shouldLoad() {
    return true
  }

  connect() {
    this.element.querySelector("[data-reading]").textContent = "Day retort connected."
    writeKettle("day-retort connect.")
  }

  static afterLoad(identifier) {
    writeKettle(`${identifier} afterLoad.`)
  }
}
