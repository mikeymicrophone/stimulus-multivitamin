/*
 * bell_watch_controller.js — registered as "bell"
 *
 * A bell on the parade ground. The slip board does not
 * name it as an outlet until a guard would be pointless.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.querySelector("p").textContent = "Parade bell connected."
  }
}
