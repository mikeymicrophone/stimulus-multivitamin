/*
 * recipe_box_controller.js — registered as "recipe-box"
 *
 * Teaches: controllers attach to markup however it arrives. "Load community
 * recipes" fetches a server-rendered HTML fragment and inserts it as a
 * string; Stimulus notices the new data-controller attributes and connects a
 * recipe-card instance for each card. Nothing here constructs a controller
 * or calls connect() by hand.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["cardList", "card", "count", "loadButton", "loadStatus"]
  static values = { communityRecipesUrl: String }

  cardTargetConnected() {
    this.renderCount()
  }

  cardTargetDisconnected() {
    this.renderCount()
  }

  async loadCommunityRecipes() {
    this.loadButtonTarget.disabled = true
    this.loadStatusTarget.textContent = "Fetching recipes from the community box…"

    try {
      const response = await fetch(this.communityRecipesUrlValue)
      if (!response.ok) throw new Error(`The community box answered ${response.status}`)
      this.cardListTarget.insertAdjacentHTML("beforeend", await response.text())
      this.loadStatusTarget.textContent = "Community recipes added to your box."
      this.loadButtonTarget.hidden = true
    } catch (error) {
      this.loadStatusTarget.textContent = `Could not load community recipes. ${error.message}`
      this.loadButtonTarget.disabled = false
    }
  }

  renderCount() {
    const recipeCount = this.cardTargets.length
    if (recipeCount === 0) {
      this.countTarget.textContent = "Your recipe box is empty"
    } else {
      this.countTarget.textContent = recipeCount === 1 ? "1 recipe in your box" : `${recipeCount} recipes in your box`
    }
  }
}
