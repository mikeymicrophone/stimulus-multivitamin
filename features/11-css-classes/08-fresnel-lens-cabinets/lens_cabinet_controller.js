/*
 * lens_cabinet_controller.js — registered as "lens-cabinet"
 *
 * Teaches: lit and dark are per-cabinet stacks. litClass is only
 * the first token. litClasses is the whole stack. Putting the
 * lens on watch removes the dark stack and adds the lit stack
 * on that cabinet's element. Admiralty Head, Cattle Point, and
 * Marrowstone each name their own tokens.
 */
import { Controller } from "@hotwired/stimulus"
import { report, textOf, listOr } from "../../../assets/readout.js"

export default class extends Controller {
  static classes = ["lit", "dark"]
  static targets = ["lightName", "reading"]

  connect() {
    this.render()
  }

  putOnWatch() {
    this.#wear(this.litClasses, { over: this.darkClasses })
  }

  secure() {
    this.#wear(this.darkClasses, { over: this.litClasses })
  }

  #wear(stack, { over: previous }) {
    this.element.classList.remove(...previous)
    this.element.classList.add(...stack)
    this.render()
  }

  render() {
    const worn = [...this.litClasses, ...this.darkClasses].filter((token) => this.element.classList.contains(token))
    report(
      this.readingTarget,
      `${textOf(this.lightNameTarget)} litClass ${this.litClass}.`,
      `litClasses ${JSON.stringify(this.litClasses)}.`,
      `darkClasses ${JSON.stringify(this.darkClasses)}.`,
      `Wearing ${listOr(worn, "none", " ")}.`
    )
  }
}
