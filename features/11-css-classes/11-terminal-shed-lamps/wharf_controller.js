/*
 * wharf_controller.js — registered as "wharf"
 *
 * Teaches: shedLamp's attribute is data-wharf-shed-lamp-class, the
 * same string as wharf-shed's lamp. pile does not collide. amber
 * and fir are this controller's own class tokens, copied into the
 * shared attribute or the pile attribute. There is no setter on
 * shedLampClass.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["shedLamp", "pile", "amber", "fir"]
  static targets = ["sharedLamp", "pileLamp", "reading"]

  connect() {
    this.paint()
  }

  paint() {
    this.sharedLampTarget.className = `lamp ${this.shedLampClass}`
    this.pileLampTarget.className = `lamp ${this.pileClass}`
    this.readingTarget.textContent = [
      `Wharf shed lamp ${this.shedLampClass}.`,
      `Wharf pile ${this.pileClass}.`,
      `Shared attribute ${this.element.getAttribute("data-wharf-shed-lamp-class")}.`,
      `Pile attribute ${this.element.getAttribute("data-wharf-pile-class")}.`
    ].join(" ")
  }

  amberSharedLamp() {
    this.element.setAttribute("data-wharf-shed-lamp-class", this.amberClass)
    this.paint()
    this.shedController().paint()
  }

  swapPiles() {
    this.element.setAttribute("data-wharf-pile-class", this.firClass)
    this.element.setAttribute("data-wharf-shed-pile-class", this.shedController().spruceClass)
    this.paint()
    this.shedController().paint()
  }

  shedController() {
    return this.application.getControllerForElementAndIdentifier(this.element, "wharf-shed")
  }
}
