/*
 * buoy_ledger_controller.js — registered as "buoy-ledger"
 *
 * Teaches: moving a buoy element disconnects and reconnects that
 * controller. The ledger itself has no values. It only shifts the
 * cards from the working pier to the lay-up pier.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["working", "laidUp"]

  layUp() {
    for (const card of [...this.workingTarget.children]) {
      this.laidUpTarget.append(card)
    }
  }
}
