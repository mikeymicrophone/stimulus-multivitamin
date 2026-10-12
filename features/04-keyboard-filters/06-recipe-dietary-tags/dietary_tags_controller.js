/*
 * dietary_tags_controller.js — registered as "dietary-tags"
 *
 * Teaches: keyboard filters on an <input>. keydown.enter commits a tag
 * and preventDefault() so the wrapping form does not submit.
 * keydown.tab commits and then lets the browser move focus, unless the
 * draft is empty. keydown.esc clears the draft. comma and Backspace are
 * not built-in filters; a plain keydown action reads event.key for those
 * so keydown.comma never throws "unknown key filter".
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["draft", "chipList", "chip", "status", "card"]

  commitTag(event) {
    event.preventDefault()
    this.addDraftAsTag()
  }

  commitTagAndAdvance(event) {
    if (this.draftTarget.value.trim() === "") return
    event.preventDefault()
    this.addDraftAsTag()
    this.cardTarget.querySelector("button[type='submit']").focus()
  }

  clearDraft(event) {
    event.preventDefault()
    this.draftTarget.value = ""
    this.statusTarget.textContent = "Draft cleared."
  }

  handleSpecialKeys(event) {
    if (event.key === ",") {
      event.preventDefault()
      this.addDraftAsTag()
      return
    }
    if (event.key === "Backspace" && this.draftTarget.value === "" && this.chipTargets.length > 0) {
      this.removeChip(this.chipTargets[this.chipTargets.length - 1])
    }
  }

  removeFromButton({ currentTarget: removeButton }) {
    this.removeChip(removeButton.closest("[data-dietary-tags-target='chip']"))
  }

  saveCard(event) {
    event.preventDefault()
    const labels = this.chipTargets.map((chip) => chip.dataset.tag)
    this.statusTarget.textContent = labels.length === 0
      ? "Add at least one dietary tag before saving."
      : `Saved ${labels.join(", ")} on Charred broccoli with chili crisp.`
  }

  addDraftAsTag() {
    const label = this.draftTarget.value.trim().replace(/,$/, "")
    if (label === "") {
      this.statusTarget.textContent = "Type a tag, then Enter, Tab, or comma."
      return
    }
    if (this.chipTargets.some((chip) => chip.dataset.tag.toLowerCase() === label.toLowerCase())) {
      this.statusTarget.textContent = `“${label}” is already on the recipe.`
      this.draftTarget.value = ""
      return
    }
    this.chipListTarget.append(this.buildChip(label))
    this.draftTarget.value = ""
    this.statusTarget.textContent = `Added “${label}”.`
    this.draftTarget.focus()
  }

  removeChip(chip) {
    const label = chip.dataset.tag
    chip.remove()
    this.statusTarget.textContent = `Removed “${label}”.`
    this.draftTarget.focus()
  }

  buildChip(label) {
    const chip = document.createElement("li")
    chip.dataset.dietaryTagsTarget = "chip"
    chip.dataset.tag = label
    const name = document.createElement("span")
    name.textContent = label
    const removeButton = document.createElement("button")
    removeButton.type = "button"
    removeButton.className = "quiet"
    removeButton.setAttribute("data-action", "dietary-tags#removeFromButton")
    removeButton.setAttribute("aria-label", `Remove ${label}`)
    removeButton.textContent = "Remove"
    chip.append(name, removeButton)
    return chip
  }
}
