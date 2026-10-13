/*
 * watch_book_controller.js — registered as "watch-book"
 *
 * Teaches: data-action hears the full name, including
 * @document and @window. keeper-slate:signed (one
 * hyphen) is a different event and stays at zero.
 * Params on this element arrive as event.params
 * beside event.detail.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.lines = []
    this.wrong = 0
    this.render()
  }

  localSign(event) {
    this.lines.push(`local ${event.type} keeper ${event.detail.keeper} station ${event.params.station}`)
    this.render()
  }

  fromDocument(event) {
    this.lines.push(`document ${event.type}`)
    this.render()
  }

  fromWindow(event) {
    this.lines.push(`window ${event.type}`)
    this.render()
  }

  wrongHyphen() {
    this.wrong += 1
    this.render()
  }

  rotated(event) {
    this.lines.push(`local ${event.type} order ${event.detail.order}`)
    this.render()
  }

  relieved(event) {
    this.lines.push(`window ${event.type} keeper ${event.detail.keeper}`)
    this.render()
  }

  render() {
    const body = this.lines.length ? this.lines.join(". ") + "." : "Book is open."
    this.readingTarget.textContent = `${body} Wrong hyphen ${this.wrong}.`
  }
}
