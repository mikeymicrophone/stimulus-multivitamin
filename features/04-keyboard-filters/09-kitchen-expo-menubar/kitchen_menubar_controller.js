/*
 * kitchen_menubar_controller.js — registered as "kitchen-menubar"
 *
 * Teaches: a menubar's keyboard map, declared as filters. Left and right
 * move between Recall, Bump, Rush, and Print. Down / Enter / Space open
 * the focused menu; up opens on the last item. Home / End jump to the
 * first or last item (or menu, when the menubar itself is focused). Escape
 * closes. Alt+R / Alt+B / Alt+U / Alt+P open from anywhere on the board.
 *
 * Alt+letter compares event.key, so on macOS Option+R may produce a
 * different character and miss the filter. openFromCode() listens to
 * unfiltered keydown@window and matches event.code, which stays KeyR.
 */
import { Controller } from "@hotwired/stimulus"

const mnemonicCodes = { KeyR: "recall", KeyB: "bump", KeyU: "rush", KeyP: "print" }

export default class extends Controller {
  static targets = ["menu", "item", "status", "ticket"]

  initialize() {
    this.openMenuName = null
    this.focusedMenuName = "recall"
  }

  connect() {
    this.render()
  }

  disconnect() {
    this.openMenuName = null
  }

  focusMenu({ currentTarget: menuButton }) {
    this.focusedMenuName = menuButton.dataset.menu
    this.render()
  }

  moveAlongBar(event) {
    event.preventDefault()
    event.stopPropagation()
    const delta = event.key === "ArrowRight" ? 1 : -1
    this.focusedMenuName = this.menuNameAt(this.menuIndex(this.focusedMenuName) + delta)
    if (this.openMenuName) this.openMenuName = this.focusedMenuName
    this.render()
    this.focusCurrent()
  }

  openDown(event) {
    event.preventDefault()
    event.stopPropagation()
    this.openMenuName = this.focusedMenuName
    this.render()
    this.itemTargets.find((item) => item.dataset.menu === this.openMenuName)?.focus()
  }

  openUp(event) {
    event.preventDefault()
    event.stopPropagation()
    this.openMenuName = this.focusedMenuName
    this.render()
    const items = this.itemsFor(this.openMenuName)
    items[items.length - 1]?.focus()
  }

  moveAmongItems(event) {
    if (!this.openMenuName) return
    event.preventDefault()
    event.stopPropagation()
    const items = this.itemsFor(this.openMenuName)
    const currentIndex = items.indexOf(document.activeElement)
    const delta = event.key === "ArrowDown" ? 1 : -1
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + delta + items.length) % items.length
    items[nextIndex].focus()
  }

  moveToEdge(event) {
    event.preventDefault()
    event.stopPropagation()
    const toEnd = event.key === "End"
    if (this.openMenuName) {
      const items = this.itemsFor(this.openMenuName)
      items[toEnd ? items.length - 1 : 0].focus()
      return
    }
    this.focusedMenuName = this.menuNameAt(toEnd ? this.menuTargets.length - 1 : 0)
    this.render()
    this.focusCurrent()
  }

  closeMenu(event) {
    if (!this.openMenuName) return
    event.preventDefault()
    event.stopPropagation()
    const wasOpen = this.openMenuName
    this.openMenuName = null
    this.focusedMenuName = wasOpen
    this.render()
    this.focusCurrent()
  }

  runItem(event) {
    event.preventDefault()
    event.stopPropagation()
    const menuItem = event.currentTarget
    const ticketName = this.ticketTargets.find((ticket) => ticket.getAttribute("aria-pressed") === "true")
      ?.dataset.ticketName
    this.statusTarget.textContent = `${menuItem.dataset.commandLabel} · ${ticketName}.`
    this.openMenuName = null
    this.render()
    this.focusCurrent()
  }

  selectTicket({ currentTarget: ticketButton }) {
    for (const ticket of this.ticketTargets) {
      ticket.setAttribute("aria-pressed", String(ticket === ticketButton))
    }
    this.statusTarget.textContent = `${ticketButton.dataset.ticketName} is on the rail.`
  }

  openFromMnemonic(event) {
    if (this.startedInEditableField(event)) return
    event.preventDefault()
    const menuName = { r: "recall", b: "bump", u: "rush", p: "print" }[event.key.toLowerCase()]
    if (!menuName) return
    this.openNamedMenu(menuName)
  }

  openFromCode(event) {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (this.startedInEditableField(event)) return
    const menuName = mnemonicCodes[event.code]
    if (!menuName) return
    event.preventDefault()
    this.openNamedMenu(menuName)
  }

  openNamedMenu(menuName) {
    this.focusedMenuName = menuName
    this.openMenuName = menuName
    this.render()
    this.itemsFor(menuName)[0]?.focus()
  }

  render() {
    for (const menuButton of this.menuTargets) {
      const isFocused = menuButton.dataset.menu === this.focusedMenuName
      const isOpen = menuButton.dataset.menu === this.openMenuName
      menuButton.tabIndex = isFocused ? 0 : -1
      menuButton.setAttribute("aria-expanded", String(isOpen))
      const panel = this.element.querySelector(`[data-menu-panel="${menuButton.dataset.menu}"]`)
      if (panel) panel.hidden = !isOpen
    }
  }

  focusCurrent() {
    this.menuTargets.find((menuButton) => menuButton.dataset.menu === this.focusedMenuName)?.focus()
  }

  itemsFor(menuName) {
    return this.itemTargets.filter((item) => item.dataset.menu === menuName)
  }

  menuIndex(menuName) {
    return this.menuTargets.findIndex((menuButton) => menuButton.dataset.menu === menuName)
  }

  menuNameAt(index) {
    const count = this.menuTargets.length
    return this.menuTargets[(index + count) % count].dataset.menu
  }

  startedInEditableField({ target }) {
    if (!(target instanceof Element)) return false
    return target.closest("input, textarea, select, [contenteditable='true']") !== null
  }
}
