/*
 * garden_map_controller.js — registered as "garden-map"
 *
 * Teaches: wheel->garden-map#zoomPlan:!passive:prevent on the plan must
 * set { passive: false } so :prevent can cancel the event. Chrome treats
 * wheel listeners on window, document, and body as passive by default;
 * :!passive is how a Stimulus descriptor opts out. The trail notes use
 * :passive and cannot cancel the scroll.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["plan", "scale", "status", "notesStatus"]
  static values = {
    scale: { type: Number, default: 1 },
  }

  zoomPlan(event) {
    const direction = event.deltaY < 0 ? 1 : -1
    const nextScale = Math.min(Math.max(this.scaleValue + direction * 0.25, 0.5), 3)
    this.scaleValue = nextScale
    this.planTarget.style.transform = `scale(${nextScale})`
    this.scaleTarget.textContent = `${nextScale.toFixed(2)}×`
    this.statusTarget.textContent = `Zoomed the conservatory plan (defaultPrevented=${event.defaultPrevented}). :!passive let :prevent cancel the wheel.`
  }

  notePassiveWheel(event) {
    this.notesStatusTarget.textContent = `Trail notes scrolled (defaultPrevented=${event.defaultPrevented}). A :passive listener cannot cancel the wheel.`
  }
}
