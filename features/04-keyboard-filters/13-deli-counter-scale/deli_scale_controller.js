/*
 * deli_scale_controller.js — registered as "deli-scale"
 *
 * Teaches: custom keyMappings on Application's schema. plus, minus, star,
 * slash, dot, equals, backspace, f2, and f4 are not in the default map.
 * They are added by spreading defaultSchema.keyMappings; replacing the
 * map outright would drop enter and esc. Numpad + arrives as event.key
 * "+" with shiftKey false, so keydown.plus matches it. The main-keyboard
 * "+" is Shift+"=", so it needs keydown.shift+plus. Both call the same
 * method. Unknown names (keydown.comma, keydown.pound) throw
 * "contains unknown key filter" the first time any keyboard event hits
 * that action.
 */
import { Controller } from "@hotwired/stimulus"

const catalog = {
  turkey: { name: "Smoked turkey", unit: "lb", priceInCents: 1295 },
  cheddar: { name: "Aged cheddar", unit: "lb", priceInCents: 1480 },
  rye: { name: "Caraway rye loaf", unit: "each", priceInCents: 725 },
}

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends Controller {
  static targets = ["pluName", "unitPrice", "quantity", "lineTotal", "ticket", "status", "entry"]

  initialize() {
    this.plu = "turkey"
    this.quantityInHundredths = 100
    this.typingBuffer = ""
    this.discountPercent = 0
    this.ticketLines = []
  }

  connect() {
    this.renderScale()
    this.renderTicket()
    this.element.focus()
  }

  bumpQuantity(event) {
    event.preventDefault()
    const delta = event.key === "+" || event.key === "=" ? 25 : -25
    this.typingBuffer = ""
    this.quantityInHundredths = Math.max(0, this.quantityInHundredths + delta)
    this.renderScale()
    this.statusTarget.textContent = `${this.catalogItem.name} is ${this.quantityLabel}.`
  }

  typeDigit(event) {
    event.preventDefault()
    this.typingBuffer += event.key
    this.applyBuffer()
  }

  typeDot(event) {
    event.preventDefault()
    if (this.typingBuffer.includes(".")) return
    this.typingBuffer = this.typingBuffer === "" ? "0." : `${this.typingBuffer}.`
    this.applyBuffer()
  }

  deleteDigit(event) {
    event.preventDefault()
    this.typingBuffer = this.typingBuffer.slice(0, -1)
    if (this.typingBuffer === "") this.quantityInHundredths = 0
    else this.applyBuffer()
    this.renderScale()
  }

  clearEntry(event) {
    event.preventDefault()
    this.typingBuffer = ""
    this.quantityInHundredths = 0
    this.discountPercent = 0
    this.renderScale()
    this.statusTarget.textContent = "Cleared the keyed quantity."
  }

  addToTicket(event) {
    event.preventDefault()
    if (this.quantityInHundredths === 0) {
      this.statusTarget.textContent = "Key a quantity before adding to the ticket."
      return
    }
    const lineTotalInCents = this.lineTotalInCents
    this.ticketLines.push({
      name: this.catalogItem.name,
      quantityLabel: this.quantityLabel,
      totalInCents: lineTotalInCents,
    })
    this.statusTarget.textContent = `Added ${this.quantityLabel} of ${this.catalogItem.name}.`
    this.typingBuffer = ""
    this.quantityInHundredths = this.catalogItem.unit === "each" ? 100 : 100
    this.discountPercent = 0
    this.renderScale()
    this.renderTicket()
  }

  voidLastLine(event) {
    event.preventDefault()
    const removed = this.ticketLines.pop()
    this.renderTicket()
    this.statusTarget.textContent = removed ? `Voided ${removed.name}.` : "Nothing on the ticket to void."
  }

  applyDiscount(event) {
    event.preventDefault()
    this.discountPercent = this.discountPercent === 0 ? 10 : 0
    this.renderScale()
    this.statusTarget.textContent = this.discountPercent === 0
      ? "Removed the staff discount."
      : "Staff discount 10% on this line."
  }

  cyclePlu(event) {
    event.preventDefault()
    const keys = Object.keys(catalog)
    this.plu = keys[(keys.indexOf(this.plu) + 1) % keys.length]
    this.typingBuffer = ""
    this.quantityInHundredths = 100
    this.discountPercent = 0
    this.renderScale()
    this.statusTarget.textContent = `PLU is now ${this.catalogItem.name}.`
  }

  managerVoid(event) {
    event.preventDefault()
    this.ticketLines = []
    this.renderTicket()
    this.statusTarget.textContent = "Manager voided the ticket."
  }

  applyBuffer() {
    const parsed = Number.parseFloat(this.typingBuffer)
    if (Number.isNaN(parsed)) return
    this.quantityInHundredths = Math.round(parsed * 100)
    this.renderScale()
  }

  renderScale() {
    this.pluNameTarget.textContent = this.catalogItem.name
    this.unitPriceTarget.textContent = `${priceFormatter.format(this.catalogItem.priceInCents / 100)} / ${this.catalogItem.unit}`
    this.quantityTarget.textContent = this.quantityLabel
    this.lineTotalTarget.textContent = priceFormatter.format(this.lineTotalInCents / 100)
    this.entryTarget.textContent = this.typingBuffer === "" ? this.quantityLabel : this.typingBuffer
  }

  renderTicket() {
    this.ticketTarget.replaceChildren()
    for (const line of this.ticketLines) {
      const row = document.createElement("li")
      row.textContent = `${line.quantityLabel} ${line.name} · ${priceFormatter.format(line.totalInCents / 100)}`
      this.ticketTarget.append(row)
    }
    if (this.ticketLines.length === 0) {
      const empty = document.createElement("li")
      empty.className = "muted"
      empty.textContent = "No lines yet."
      this.ticketTarget.append(empty)
    }
  }

  get catalogItem() {
    return catalog[this.plu]
  }

  get quantityLabel() {
    const amount = this.quantityInHundredths / 100
    return this.catalogItem.unit === "each"
      ? `${amount.toFixed(0)} loaf`
      : `${amount.toFixed(2)} lb`
  }

  get lineTotalInCents() {
    const gross = Math.round((this.quantityInHundredths * this.catalogItem.priceInCents) / 100)
    return Math.round(gross * (100 - this.discountPercent) / 100)
  }
}
