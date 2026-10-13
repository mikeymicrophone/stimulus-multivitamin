/*
 * slip_log_controller.js — registered as "slip-log"
 *
 * Teaches: each prefix is a different event name, so each
 * needs its own data-action. false:landed is not the bare
 * name landed. Counting the bare name shows every falsy
 * prefix landing on that one listener.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.counts = { default: 0, terminal: 0, bare: 0, word: 0 }
    this.render()
  }

  hearDefault() {
    this.counts.default += 1
    this.render()
  }

  hearTerminal() {
    this.counts.terminal += 1
    this.render()
  }

  hearBare() {
    this.counts.bare += 1
    this.render()
  }

  hearWord() {
    this.counts.word += 1
    this.render()
  }

  render() {
    const counts = this.counts
    this.readingTarget.textContent = `default ${counts.default}. terminal ${counts.terminal}. bare ${counts.bare}. word ${counts.word}.`
  }
}
