/*
 * belt_controller.js — registered as "belt"
 *
 * Teaches: afterLoad during the same turn as
 * Application.start() runs before connect. The tape
 * shows the load line first.
 */
import { Controller } from "@hotwired/stimulus"
import { writeTape } from "./tape.js"

export default class extends Controller {
  connect() {
    writeTape("belt connect.")
  }

  static afterLoad(identifier) {
    writeTape(`${identifier} afterLoad.`)
  }
}
