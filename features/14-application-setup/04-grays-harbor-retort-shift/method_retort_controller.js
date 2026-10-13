/*
 * method_retort_controller.js — registered as "method-retort"
 *
 * Teaches: load() reads the shouldLoad property. It does
 * not call it. A static method is a function, and a
 * function is truthy, so this retort loads even though
 * the method would return false.
 */
import { Controller } from "@hotwired/stimulus"
import { writeKettle } from "./kettle_log.js"

export default class extends Controller {
  static shouldLoad() {
    return false
  }

  connect() {
    this.element.querySelector("[data-reading]").textContent = "Method retort connected."
    writeKettle("method-retort connect.")
  }

  static afterLoad(identifier) {
    writeKettle(`${identifier} afterLoad.`)
  }
}
