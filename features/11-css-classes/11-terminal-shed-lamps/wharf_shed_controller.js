/*
 * wharf_shed_controller.js — registered as "wharf-shed"
 *
 * Teaches: lamp's attribute is data-wharf-shed-lamp-class, shared
 * with the wharf controller's shedLamp. pile is
 * data-wharf-shed-pile-class and is not the wharf's pile. spruce
 * is the replacement token for this shed's pile.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["lamp", "pile", "spruce"]
  static targets = ["sharedLamp", "pileLamp", "reading"]

  connect() {
    this.paint()
  }

  paint() {
    this.sharedLampTarget.className = `lamp ${this.lampClass}`
    this.pileLampTarget.className = `lamp ${this.pileClass}`
    this.readingTarget.textContent = [
      `Shed lamp ${this.lampClass}.`,
      `Shed pile ${this.pileClass}.`,
      `Shared attribute ${this.element.getAttribute("data-wharf-shed-lamp-class")}.`,
      `Shed pile attribute ${this.element.getAttribute("data-wharf-shed-pile-class")}.`
    ].join(" ")
  }
}
