/*
 * trail_kitchen_controller.js — registered as "trail-kitchen"
 *
 * Teaches: a param that is valid JSON becomes an array or an object.
 * Keys inside that object are not camelized. A value that only looks
 * like an object, with unquoted keys, fails JSON.parse and stays a string,
 * so reading .calories off it would be wrong.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["card", "heading", "ingredients", "nutrition", "allergens"]

  loadBatch(event) {
    const { mealName, ingredients, nutrition, allergens } = event.params
    this.cardTarget.hidden = false
    this.headingTarget.textContent = mealName
    this.ingredientsTarget.replaceChildren()
    if (Array.isArray(ingredients)) {
      for (const ingredient of ingredients) {
        const item = document.createElement("li")
        item.textContent = ingredient
        this.ingredientsTarget.append(item)
      }
    } else {
      const item = document.createElement("li")
      item.textContent = `Ingredients stayed a ${kindOf(ingredients)}.`
      this.ingredientsTarget.append(item)
    }
    if (nutrition && typeof nutrition === "object" && !Array.isArray(nutrition)) {
      const serves = Object.prototype.hasOwnProperty.call(nutrition, "serve_count") ? nutrition.serve_count : "missing"
      this.nutritionTarget.textContent = `${nutrition.calories} calories for ${serves}. The object key serve_count was not camelized.`
    } else {
      this.nutritionTarget.textContent = `Nutrition stayed a ${kindOf(nutrition)} (${show(nutrition)}), so there is no calorie count.`
    }
    if (Array.isArray(allergens)) {
      this.allergensTarget.textContent = allergens.length ? `Allergens: ${allergens.join(", ")}.` : "No allergens listed."
    } else {
      this.allergensTarget.textContent = "Allergens were not an array."
    }
  }
}

function kindOf(value) {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  if (value === undefined) return "missing"
  return typeof value
}

function show(value) {
  if (typeof value === "string") return value
  return JSON.stringify(value)
}
