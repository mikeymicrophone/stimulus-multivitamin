/*
 * signal_mast_controller.js — registered as "signal-mast"
 *
 * Teaches: bubbles and cancelable default to true.
 * composed is not forwarded, so composed: true still
 * leaves event.composed false and the event stays
 * inside a shadow root. The strings "false" are
 * truthy and do not turn the flags off. 0 does.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["report", "host", "hostLine"]

  connect() {
    const root = this.hostTarget.shadowRoot || this.hostTarget.attachShadow({ mode: "open" })
    const lamp = document.createElement("p")
    lamp.textContent = "Fresnel lamp inside the shadow."
    root.replaceChildren(lamp)
    this.lamp = lamp
  }

  flyDefault() {
    this.blank()
    const event = this.dispatch("hoisted", {
      detail: { flag: "baker" },
      composed: true
    })
    this.reportTarget.textContent = `type ${event.type}. bubbles ${event.bubbles}. cancelable ${event.cancelable}. composed ${event.composed}. defaultPrevented ${event.defaultPrevented}.`
  }

  flyStill() {
    this.blank()
    const event = this.dispatch("hoisted", {
      bubbles: false,
      detail: { flag: "still" }
    })
    this.reportTarget.textContent = `bubbles ${event.bubbles}. defaultPrevented ${event.defaultPrevented}.`
  }

  flyFixed() {
    this.blank()
    const event = this.dispatch("hoisted", {
      cancelable: false,
      detail: { flag: "fixed" }
    })
    this.reportTarget.textContent = `cancelable ${event.cancelable}. defaultPrevented ${event.defaultPrevented}.`
  }

  flyWorded() {
    this.blank()
    const event = this.dispatch("hoisted", {
      bubbles: "false",
      cancelable: "false",
      detail: { flag: "worded" }
    })
    this.reportTarget.textContent = `string bubbles ${event.bubbles}. string cancelable ${event.cancelable}. defaultPrevented ${event.defaultPrevented}.`
  }

  flyZero() {
    this.blank()
    const event = this.dispatch("hoisted", {
      bubbles: 0,
      cancelable: 0,
      detail: { flag: "zero" }
    })
    this.reportTarget.textContent = `zero bubbles ${event.bubbles}. zero cancelable ${event.cancelable}. defaultPrevented ${event.defaultPrevented}.`
  }

  flyShadow() {
    this.blank()
    const event = this.dispatch("hoisted", {
      target: this.lamp,
      composed: true,
      detail: { flag: "shadow" }
    })
    this.reportTarget.textContent = `shadow composed ${event.composed}.`
  }

  flyManual() {
    this.blank()
    const event = new CustomEvent("signal-mast:hoisted", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { flag: "manual" }
    })
    this.lamp.dispatchEvent(event)
    this.reportTarget.textContent = `manual composed ${event.composed}. defaultPrevented ${event.defaultPrevented}.`
  }

  hearHost(event) {
    this.hostLineTarget.textContent = `Host heard ${event.detail.flag}. composed ${event.composed}.`
  }

  blank() {
    this.hostLineTarget.textContent = "Host is quiet."
    document.getElementById("log-reading").textContent = "Log is quiet."
    document.getElementById("watch-reading").textContent = "Watch is quiet."
  }
}
