/*
 * scale_controller.js — registered as "scale"
 *
 * Teaches: a second register in that same turn also
 * finishes afterLoad before either controller connects.
 */
import { Controller } from "@hotwired/stimulus"
import { writeTape } from "./tape.js"

export default class extends Controller {
  connect() {
    writeTape("scale connect.")
  }

  static afterLoad(identifier) {
    writeTape(`${identifier} afterLoad.`)
  }
}
