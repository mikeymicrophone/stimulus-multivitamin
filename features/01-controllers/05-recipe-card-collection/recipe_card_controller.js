/*
 * recipe_card_controller.js — registered as "recipe-card"
 *
 * Teaches: a controller that adds a second controller to its own element.
 * "Edit" appends "recipe-editor" to this element's data-controller list, and
 * Stimulus connects a recipe-editor instance on the spot. This instance is
 * untouched by that: the servings you picked survive editing, because
 * attaching or detaching one identifier never rebuilds the others.
 */
import { Controller } from "@hotwired/stimulus"

const KITCHEN_FRACTIONS = [
  [0, ""],
  [1 / 8, "⅛"],
  [1 / 4, "¼"],
  [1 / 3, "⅓"],
  [1 / 2, "½"],
  [2 / 3, "⅔"],
  [3 / 4, "¾"],
  [1, ""],
]

const FEWEST_SERVINGS = 1
const MOST_SERVINGS = 24

export default class extends Controller {
  static targets = ["servings", "quantity"]
  static values = { baseServings: Number }

  initialize() {
    this.servings = this.baseServingsValue
  }

  connect() {
    this.render()
  }

  serveFewer() {
    this.servings = Math.max(FEWEST_SERVINGS, this.servings - 1)
    this.render()
  }

  serveMore() {
    this.servings = Math.min(MOST_SERVINGS, this.servings + 1)
    this.render()
  }

  startEditing() {
    const identifiers = this.element.dataset.controller.split(/\s+/)
    if (identifiers.includes("recipe-editor")) return
    this.element.dataset.controller = [...identifiers, "recipe-editor"].join(" ")
  }

  removeFromBox() {
    this.element.remove()
  }

  render() {
    const scale = this.servings / this.baseServingsValue
    this.servingsTarget.textContent = String(this.servings)
    for (const quantity of this.quantityTargets) {
      quantity.textContent = formatKitchenQuantity(Number(quantity.dataset.baseQuantity) * scale)
    }
  }
}

function formatKitchenQuantity(amount) {
  const wholePart = Math.floor(amount)
  const remainder = amount - wholePart
  const [fractionValue, fractionGlyph] = KITCHEN_FRACTIONS.reduce((closest, candidate) =>
    Math.abs(candidate[0] - remainder) < Math.abs(closest[0] - remainder) ? candidate : closest
  )

  if (fractionValue === 1) return String(wholePart + 1)
  if (wholePart === 0) return fractionGlyph || "⅛"
  return fractionGlyph ? `${wholePart} ${fractionGlyph}` : String(wholePart)
}
