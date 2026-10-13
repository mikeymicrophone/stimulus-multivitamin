/*
 * watch_flag_controller.js — registered as "watch-flag"
 *
 * Teaches: an element can host two identifiers. The lookup
 * has to name the one you want.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.dataset.flag = "watch-flag"
  }

  watchName() {
    return "watch-flag"
  }
}
