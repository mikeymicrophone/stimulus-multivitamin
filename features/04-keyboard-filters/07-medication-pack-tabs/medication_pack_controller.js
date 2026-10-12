/*
 * medication_pack_controller.js — registered as "medication-pack"
 *
 * Teaches: a tablist with roving tabindex. keydown.left / keydown.right
 * move between Morning, Noon, Evening, and Bedtime. keydown.home and
 * keydown.end jump to the first and last tab. keydown.space and
 * keydown.enter activate the focused tab (the arrows already activate,
 * which is the automatic-activation pattern). Only the selected tab is
 * tabindex="0"; the others are -1, so Tab leaves the list in one stop.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "panel", "status"]

  initialize() {
    this.selectedIndex = this.tabTargets.findIndex((tab) => tab.getAttribute("aria-selected") === "true")
    if (this.selectedIndex < 0) this.selectedIndex = 0
  }

  connect() {
    this.show(this.selectedIndex)
  }

  selectTab({ currentTarget: tabButton }) {
    this.show(this.tabTargets.indexOf(tabButton))
  }

  movePrevious(event) {
    event.preventDefault()
    this.show(this.selectedIndex - 1)
  }

  moveNext(event) {
    event.preventDefault()
    this.show(this.selectedIndex + 1)
  }

  moveFirst(event) {
    event.preventDefault()
    this.show(0)
  }

  moveLast(event) {
    event.preventDefault()
    this.show(this.tabTargets.length - 1)
  }

  activateFocused(event) {
    event.preventDefault()
    this.show(this.selectedIndex)
  }

  show(index) {
    const count = this.tabTargets.length
    this.selectedIndex = (index + count) % count
    this.tabTargets.forEach((tabButton, tabIndex) => {
      const selected = tabIndex === this.selectedIndex
      tabButton.setAttribute("aria-selected", String(selected))
      tabButton.tabIndex = selected ? 0 : -1
    })
    this.panelTargets.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== this.selectedIndex
    })
    this.tabTargets[this.selectedIndex].focus()
    this.statusTarget.textContent = `${this.tabTargets[this.selectedIndex].textContent.trim()} pack is showing.`
  }
}
