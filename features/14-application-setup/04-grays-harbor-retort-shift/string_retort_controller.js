/*
 * string_retort_controller.js — registered as "string-retort"
 *
 * Teaches: shouldLoad is a truthiness check. The string
 * "false" is truthy, so this retort loads.
 */
import { Controller } from "@hotwired/stimulus"
import { writeKettle } from "./kettle_log.js"

export default class extends Controller {
  static get shouldLoad() {
    return "false"
  }

  connect() {
    this.element.querySelector("[data-reading]").textContent = "String retort connected."
    writeKettle("string-retort connect.")
  }

  static afterLoad(identifier) {
    writeKettle(`${identifier} afterLoad.`)
  }
}
