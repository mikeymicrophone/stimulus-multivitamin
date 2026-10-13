/*
 * jammed_winch_controller.js — registered as "jammed-winch"
 *
 * Teaches: a throw inside an action is reported and
 * does not reject dispatch(). Listeners after this
 * one still run, and the caller still gets the event.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  seize() {
    if (this.element.dataset.jam !== "yes") return
    throw new Error("winch pawl skipped")
  }
}
