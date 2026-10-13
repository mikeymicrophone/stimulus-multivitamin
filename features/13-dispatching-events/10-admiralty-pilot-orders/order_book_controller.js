/*
 * order_book_controller.js — registered as "order-book"
 *
 * Teaches: @document runs after ancestors and before
 * @window, for a bubbling event.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["line"]

  connect() {
    this.lineTarget.textContent = "Book is quiet."
  }

  hear(event) {
    event.detail.tape.push("book")
    this.lineTarget.textContent = `Book heard ${event.detail.vessel}.`
  }

  clear() {
    this.lineTarget.textContent = "Book is quiet."
  }
}
