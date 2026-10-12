/*
 * shopping_cart_controller.js — registered as "shopping-cart"
 *
 * Teaches: a parent controller's actions on elements inside its children.
 * The − and + buttons and the quantity fields belong to cart-line
 * instances, but they sit inside the cart's element too, so they can also
 * call "shopping-cart#recalculate". Each line's quantity is a Stimulus
 * value, written to its data attribute, so the cart reads the markup and
 * never depends on which controller connected first. The cart removes
 * lines itself: once an action detaches its own element, later actions in
 * the same list for a controller outside the removed subtree don't run.
 */
import { Controller } from "@hotwired/stimulus"

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends Controller {
  static targets = ["line", "itemCount", "subtotal", "shipping", "total", "freeShippingProgress", "freeShippingNote", "emptyNote", "checkoutButton", "status"]
  static values = { freeShippingThresholdCents: Number, shippingCents: Number }

  connect() {
    this.recalculate()
  }

  removeLine({ currentTarget: removeButton }) {
    const line = removeButton.closest('[data-shopping-cart-target="line"]')
    const productName = line.querySelector("h3").textContent
    line.remove()
    this.statusTarget.textContent = `Removed ${productName}.`
    this.recalculate()
  }

  recalculate() {
    const lines = this.lineTargets.map((line) => ({
      quantity: Number(line.dataset.cartLineQuantityValue),
      unitPriceCents: Number(line.dataset.cartLineUnitPriceCentsValue),
    }))
    const itemCount = lines.reduce((count, line) => count + line.quantity, 0)
    const subtotalCents = lines.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0)
    const qualifiesForFreeShipping = subtotalCents >= this.freeShippingThresholdCentsValue
    const shippingCents = itemCount === 0 || qualifiesForFreeShipping ? 0 : this.shippingCentsValue

    this.itemCountTarget.textContent = itemCount === 1 ? "1 packet" : `${itemCount} packets`
    this.subtotalTarget.textContent = dollars.format(subtotalCents / 100)
    this.shippingTarget.textContent = shippingCents === 0 ? "Free" : dollars.format(shippingCents / 100)
    this.totalTarget.textContent = dollars.format((subtotalCents + shippingCents) / 100)
    this.freeShippingProgressTarget.value = Math.min(subtotalCents, this.freeShippingThresholdCentsValue)
    this.freeShippingProgressTarget.max = this.freeShippingThresholdCentsValue
    this.freeShippingNoteTarget.textContent = qualifiesForFreeShipping
      ? "Your seeds ship free."
      : `Add ${dollars.format((this.freeShippingThresholdCentsValue - subtotalCents) / 100)} more for free shipping.`
    this.emptyNoteTarget.hidden = lines.length > 0
    this.checkoutButtonTarget.disabled = lines.length === 0
  }
}
