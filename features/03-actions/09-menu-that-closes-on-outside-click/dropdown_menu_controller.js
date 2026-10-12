/*
 * dropdown_menu_controller.js — registered as "dropdown-menu"
 *
 * Teaches: closing on an outside click with click@document, and why it
 * doesn't fight the toggle button. A click runs the button's own action
 * first, then actions on its ancestors, then @document ones, then @window
 * ones. So toggle() has opened the menu by the time closeIfOutside() asks
 * whether the click was inside, and every other open menu hears the same
 * click as an outside one.
 *
 * Submenus are dropdown-menu controllers inside a dropdown-menu. The outer
 * menu's @document actions skip events that start inside a submenu, so
 * Escape inside "Export" closes only "Export", and focus moving into it
 * never looks like focus leaving the outer menu.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toggleButton", "panel"]

  initialize() {
    this.isOpen = false
    this.opener = null
  }

  disconnect() {
    this.isOpen = false
  }

  toggle({ currentTarget: toggleButton }) {
    if (this.isOpen) {
      this.close()
    } else {
      this.open(toggleButton)
    }
  }

  // A submenu's opener is an item of the outer menu, outside the
  // submenu's own element, so the outer menu calls this directly.
  openSubmenu({ currentTarget: submenuOpener }) {
    const submenu = this.submenuOpenedBy(submenuOpener)
    if (submenu.isOpen) {
      submenu.close()
    } else {
      submenu.open(submenuOpener)
    }
  }

  open(opener) {
    this.isOpen = true
    this.opener = opener
    this.render()
    this.panelTarget.querySelector("button, a").focus()
  }

  close() {
    if (!this.isOpen) return
    for (const submenu of this.submenus) submenu.close()
    this.isOpen = false
    this.render()
  }

  closeIfOutside({ target }) {
    if (this.isOpen && !this.contains(target)) this.close()
  }

  closeIfFocusLeft({ target }) {
    if (this.isOpen && !this.contains(target)) this.close()
  }

  closeOnEscape(event) {
    if (event.key !== "Escape" || !this.isOpen) return
    this.close()
    this.opener.focus()
  }

  // Chosen items close every menu they sit in, innermost first.
  closeMenuTree() {
    this.close()
    if (this.outerMenu) {
      this.outerMenu.closeMenuTree()
    } else {
      this.opener.focus()
    }
  }

  render() {
    this.panelTarget.hidden = !this.isOpen
    const opener = this.hasToggleButtonTarget ? this.toggleButtonTarget : this.opener
    opener?.setAttribute("aria-expanded", String(this.isOpen))
  }

  // A submenu's opener sits outside its element, and the opener's click
  // reaches this menu's click@document action right after openSubmenu().
  contains(target) {
    return this.element.contains(target) || Boolean(this.opener?.contains(target))
  }

  submenuOpenedBy(submenuOpener) {
    const submenuElement = document.getElementById(submenuOpener.getAttribute("aria-controls")).closest('[data-controller~="dropdown-menu"]')
    return this.application.getControllerForElementAndIdentifier(submenuElement, "dropdown-menu")
  }

  get submenus() {
    return [...this.panelTarget.querySelectorAll('[data-controller~="dropdown-menu"]')]
      .map((element) => this.application.getControllerForElementAndIdentifier(element, "dropdown-menu"))
      .filter(Boolean)
  }

  get outerMenu() {
    const outerElement = this.element.parentElement.closest('[data-controller~="dropdown-menu"]')
    return outerElement && this.application.getControllerForElementAndIdentifier(outerElement, "dropdown-menu")
  }
}
