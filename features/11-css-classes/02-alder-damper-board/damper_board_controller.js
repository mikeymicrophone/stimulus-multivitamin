/*
 * damper_board_controller.js — registered as "damper-board"
 *
 * Teaches: drawnOpen, banked, and shut are three logical classes.
 * drawnOpen maps to data-damper-board-drawn-open-class. Setting a
 * room removes the other two tokens and adds one, all on the
 * controller element. The CSS class strings stay in the markup.
 */
import { Controller } from "@hotwired/stimulus"
import { report, textOf } from "../../../assets/readout.js"

export default class extends Controller {
  static classes = ["drawnOpen", "banked", "shut"]
  static targets = ["roomName", "reading"]

  connect() {
    this.render()
  }

  draw() {
    this.#use("drawing")
  }

  bank() {
    this.#use("banked")
  }

  shutDamper() {
    this.#use("shut")
  }

  // Rebuilt on each read: the class getters read the attribute live,
  // so a cached Map would miss a token changed in the markup.
  get #tokens() {
    return new Map([
      ["drawing", this.drawnOpenClass],
      ["banked", this.bankedClass],
      ["shut", this.shutClass]
    ])
  }

  get showing() {
    for (const [state, token] of this.#tokens) {
      if (this.element.classList.contains(token)) return state
    }
    return "none"
  }

  #use(chosen) {
    for (const [state, token] of this.#tokens) {
      this.element.classList.toggle(token, state === chosen)
    }
    this.render()
  }

  render() {
    report(
      this.readingTarget,
      `${textOf(this.roomNameTarget)} drawnOpenClass ${this.drawnOpenClass}.`,
      `bankedClass ${this.bankedClass}.`,
      `shutClass ${this.shutClass}.`,
      `Showing ${this.showing}.`
    )
  }
}
