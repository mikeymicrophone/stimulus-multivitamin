/*
 * pizza_order_controller.js — registered as "pizza-order"
 *
 * Teaches: every descriptor on this form leaves out the event name, so each
 * element gets its default: radios, checkboxes, number fields, and the
 * textarea fire "input"; the select fires "change"; the <details> fires
 * "toggle"; the link and buttons fire "click"; the form fires "submit".
 * The one exception is "Repeat my last order", an <input type="button">,
 * whose default would be "input", an event it never fires, so its
 * descriptor names "click" explicitly.
 */
import { Controller } from "@hotwired/stimulus"

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends Controller {
  static targets = [
    "size", "crust", "topping", "toppingCount", "quantity",
    "kitchenNote", "noteRemaining", "schedule", "pickupTime", "readyTime",
    "allergenGuide", "allergenLink", "lineItems", "total", "status", "confirmation",
  ]
  static values = {
    toppingLimit: Number,
    toppingPriceCents: Number,
    noteLimit: Number,
    lastOrder: Object,
  }

  connect() {
    // A <details> rendered with "open" fires its toggle event before
    // Stimulus is listening, so the schedule's starting state is read here.
    this.renderSchedule()
    this.renderNoteRemaining()
    this.render()
  }

  chooseSize() {
    this.render()
  }

  chooseCrust() {
    this.render()
  }

  toggleTopping({ currentTarget: toppingBox }) {
    const topping = toppingBox.closest("label").textContent.trim()
    this.statusTarget.textContent = toppingBox.checked ? `Added ${topping}.` : `Removed ${topping}.`
    this.render()
  }

  clearToppings() {
    for (const toppingBox of this.toppingTargets) toppingBox.checked = false
    this.statusTarget.textContent = "Toppings cleared."
    this.render()
  }

  changeQuantity() {
    this.render()
  }

  countNoteCharacters() {
    this.renderNoteRemaining()
  }

  toggleSchedule() {
    this.renderSchedule()
    this.render()
  }

  choosePickupTime() {
    this.render()
  }

  toggleAllergenGuide(event) {
    event.preventDefault()
    const opening = this.allergenGuideTarget.hidden
    this.allergenGuideTarget.hidden = !opening
    this.allergenLinkTarget.setAttribute("aria-expanded", String(opening))
  }

  // Setting .value and .checked from code fires no input or change events,
  // so none of the actions above run. Render directly afterward.
  repeatLastOrder() {
    const { size, crust, toppings, quantity, kitchenNote } = this.lastOrderValue
    for (const sizeRadio of this.sizeTargets) sizeRadio.checked = sizeRadio.value === size
    this.crustTarget.value = crust
    for (const toppingBox of this.toppingTargets) toppingBox.checked = toppings.includes(toppingBox.value)
    this.quantityTarget.value = quantity
    this.kitchenNoteTarget.value = kitchenNote
    this.statusTarget.textContent = "Your last order is back on the form."
    this.renderNoteRemaining()
    this.render()
  }

  placeOrder(event) {
    event.preventDefault()
    if (this.scheduleTarget.open && !this.pickupTimeTarget.value) {
      this.statusTarget.textContent = "Choose a pickup time, or close “Schedule for later” to order now."
      this.pickupTimeTarget.focus()
      return
    }
    const when = this.scheduleTarget.open ? `at ${this.selectedPickupLabel}` : "as soon as it's ready"
    this.confirmationTarget.textContent = `Order placed: ${this.quantity} × ${this.selectedSizeLabel} pizza, ${dollars.format(this.totalCents / 100)}, for pickup ${when}.`
    this.confirmationTarget.hidden = false
    this.statusTarget.textContent = ""
  }

  render() {
    const chosenToppings = this.toppingTargets.filter((toppingBox) => toppingBox.checked)
    const atLimit = chosenToppings.length >= this.toppingLimitValue
    for (const toppingBox of this.toppingTargets) toppingBox.disabled = atLimit && !toppingBox.checked
    this.toppingCountTarget.textContent = `${chosenToppings.length} of ${this.toppingLimitValue} toppings`

    const lines = [
      [`${this.selectedSizeLabel} pizza`, this.sizePriceCents],
      [`${this.selectedCrustOption.textContent.split(" (")[0]} crust`, this.crustSurchargeCents],
      ...chosenToppings.map((toppingBox) => [toppingBox.closest("label").textContent.trim(), this.toppingPriceCentsValue]),
    ]
    this.lineItemsTarget.replaceChildren(...lines.map(([label, cents]) => {
      const row = document.createElement("li")
      row.textContent = `${label} — ${dollars.format(cents / 100)}`
      return row
    }))
    this.totalTarget.textContent = `${this.quantity} × ${dollars.format(this.pizzaCents / 100)} = ${dollars.format(this.totalCents / 100)}`
    this.confirmationTarget.hidden = true
  }

  renderNoteRemaining() {
    const remaining = this.noteLimitValue - this.kitchenNoteTarget.value.length
    this.noteRemainingTarget.textContent = `${remaining} characters left`
  }

  renderSchedule() {
    this.readyTimeTarget.textContent = this.scheduleTarget.open ? "Scheduled pickup" : "Ready in about 25 minutes"
  }

  get selectedSizeRadio() {
    return this.sizeTargets.find((sizeRadio) => sizeRadio.checked) ?? this.sizeTargets[0]
  }

  get selectedSizeLabel() {
    return this.selectedSizeRadio.dataset.sizeLabel
  }

  get sizePriceCents() {
    return Number(this.selectedSizeRadio.dataset.priceCents)
  }

  get selectedCrustOption() {
    return this.crustTarget.selectedOptions[0]
  }

  get crustSurchargeCents() {
    return Number(this.selectedCrustOption.dataset.surchargeCents)
  }

  get selectedPickupLabel() {
    return this.pickupTimeTarget.selectedOptions[0].textContent
  }

  get pizzaCents() {
    const toppingCount = this.toppingTargets.filter((toppingBox) => toppingBox.checked).length
    return this.sizePriceCents + this.crustSurchargeCents + toppingCount * this.toppingPriceCentsValue
  }

  get quantity() {
    const quantity = Math.round(Number(this.quantityTarget.value))
    return Number.isFinite(quantity) ? Math.min(Math.max(quantity, 1), Number(this.quantityTarget.max)) : 1
  }

  get totalCents() {
    return this.pizzaCents * this.quantity
  }
}
