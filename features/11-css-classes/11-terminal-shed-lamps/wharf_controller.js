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
import { report } from "../../../assets/readout.js"

export default class extends Controller {
  static classes = ["shedLamp", "pile", "amber", "fir"]
  static targets = ["sharedLamp", "pileLamp", "reading"]

  connect() {
    this.paint()
  }

  paint() {
    this.sharedLampTarget.className = `lamp ${this.shedLampClass}`
    this.pileLampTarget.className = `lamp ${this.pileClass}`
    report(
      this.readingTarget,
      `Wharf shed lamp ${this.shedLampClass}.`,
      `Wharf pile ${this.pileClass}.`,
      `Shared attribute ${this.element.getAttribute("data-wharf-shed-lamp-class")}.`,
      `Pile attribute ${this.element.getAttribute("data-wharf-pile-class")}.`
    )
  }

  amberSharedLamp() {
    this.element.setAttribute("data-wharf-shed-lamp-class", this.amberClass)
    this.paint()
    this.shed?.paint()
  }

  swapPiles() {
    const { shed } = this
    this.element.setAttribute("data-wharf-pile-class", this.firClass)
    this.element.setAttribute("data-wharf-shed-pile-class", shed.spruceClass)
    this.paint()
    shed.paint()
  }

  // null until wharf-shed has connected on the same element.
  get shed() {
    return this.application.getControllerForElementAndIdentifier(this.element, "wharf-shed")
  }
}
