/*
 * potluck_board_controller.js — registered as "potluck-board"
 *
 * Teaches: a dish card inserted from the form has working params once
 * Stimulus binds its action. button.click() in the same turn does not
 * run signUp, because the binding arrives on a later microtask. Param
 * attributes are read when the action runs, so doubling the chili
 * servings attribute is visible on the next click without reconnecting.
 * Dish names are stored with JSON.stringify so a numeric name stays a
 * string. Servings are stored raw so they cast to numbers.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["list", "status", "immediate", "dishName", "servings", "vegetarian", "chiliButton"]

  signUp(event) {
    this.claimWasSameTurn = true
    const { dishName, servings, vegetarian } = event.params
    this.statusTarget.textContent = `${dishName} (${kindOf(dishName)}), servings ${show(servings)} (${kindOf(servings)}), vegetarian ${show(vegetarian)} (${kindOf(vegetarian)}).`
  }

  doubleChili() {
    const button = this.chiliButtonTarget
    const current = Number(button.getAttribute("data-potluck-board-servings-param"))
    const doubled = String(current * 2)
    button.setAttribute("data-potluck-board-servings-param", doubled)
    this.statusTarget.textContent = `Chili servings attribute is now ${doubled}. Bring it again to read the param.`
  }

  addDish(event) {
    event.preventDefault()
    const dish = this.dishFromForm()
    if (!dish) return
    this.insertDish(dish)
    this.statusTarget.textContent = `${dish.dishName} is on the board. Claim it from its card.`
  }

  addAndClaimNow(event) {
    event.preventDefault()
    const dish = this.dishFromForm()
    if (!dish) return
    const button = this.insertDish(dish)
    this.claimWasSameTurn = false
    button.click()
    this.immediateTarget.hidden = false
    this.immediateTarget.textContent = this.claimWasSameTurn
      ? "The new card claimed in the same turn."
      : "The new card did not claim in the same turn. Stimulus binds its action after this method returns."
  }

  dishFromForm() {
    const dishName = this.dishNameTarget.value.trim()
    const servings = this.servingsTarget.value.trim()
    if (dishName === "" || servings === "") {
      this.statusTarget.textContent = "Add a dish name and a serving count first."
      return null
    }
    return { dishName, servings, vegetarian: this.vegetarianTarget.checked }
  }

  insertDish({ dishName, servings, vegetarian }) {
    const item = document.createElement("li")
    const button = document.createElement("button")
    button.type = "button"
    button.setAttribute("data-action", "potluck-board#signUp")
    button.setAttribute("data-potluck-board-dish-name-param", JSON.stringify(dishName))
    button.setAttribute("data-potluck-board-servings-param", servings)
    button.setAttribute("data-potluck-board-vegetarian-param", vegetarian ? "true" : "false")
    button.textContent = `I'll bring ${dishName}`
    item.append(button)
    this.listTarget.append(item)
    return button
  }
}

function kindOf(value) {
  if (value === null) return "null"
  if (value === undefined) return "missing"
  return typeof value
}

function show(value) {
  if (typeof value === "string") return value
  return String(value)
}
