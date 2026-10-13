/*
 * collision_plate_controller.js — registered as "collision-plate"
 *
 * Teaches: static outlets lists keeper--log and then
 * keeper-log. Both call keeperLogOutletConnected. The getter
 * keeperLogOutlet is the later entry, keeper-log. The
 * attributes stay distinct.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["keeper--log", "keeper-log"]
  static targets = ["log"]

  keeperLogOutletConnected(outlet, element) {
    this.write(`Callback ${outlet.identifier} ${element.id}.`)
  }

  connect() {
    this.write(`Getter ${this.keeperLogOutletElement.id} identifier ${this.keeperLogOutlet.identifier}.`)
  }

  write(line) {
    this.logTarget.textContent = `${this.logTarget.textContent}${line}\n`
  }
}
