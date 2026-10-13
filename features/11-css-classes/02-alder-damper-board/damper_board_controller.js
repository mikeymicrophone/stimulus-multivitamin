/*
 * damper_board_controller.js — registered as "damper-board"
 *
 * Teaches: drawnOpen, banked, and shut are three logical classes.
 * drawnOpen maps to data-damper-board-drawn-open-class. Setting a
 * room removes the other two tokens and adds one, all on the
 * controller element. The CSS class strings stay in the markup.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["drawnOpen", "banked", "shut"]
  static targets = ["roomName", "reading"]

  connect() {
    this.render()
  }

  draw() {
    this.use(this.drawnOpenClass)
  }

  bank() {
    this.use(this.bankedClass)
  }

  shutDamper() {
    this.use(this.shutClass)
  }

  use(token) {
    this.element.classList.remove(this.drawnOpenClass, this.bankedClass, this.shutClass)
    this.element.classList.add(token)
    this.render()
  }

  render() {
    const roomName = this.roomNameTarget.textContent.trim()
    this.readingTarget.textContent = [
      `${roomName} drawnOpenClass ${this.drawnOpenClass}.`,
      `bankedClass ${this.bankedClass}.`,
      `shutClass ${this.shutClass}.`,
      `Showing ${this.showing()}.`
    ].join(" ")
  }

  showing() {
    if (this.element.classList.contains(this.drawnOpenClass)) return "drawing"
    if (this.element.classList.contains(this.bankedClass)) return "banked"
    if (this.element.classList.contains(this.shutClass)) return "shut"
    return "none"
  }
}
