/*
 * command_palette_controller.js — registered as "command-palette"
 *
 * Teaches: a command palette is a global shortcut plus a listbox.
 * keydown.meta+k@window and keydown.ctrl+k@window open it from the chart
 * notes <textarea> or anywhere else. Once open, the search field's
 * keydown.down / up / home / end move aria-activedescendant through the
 * listbox; keydown.enter runs the active command; keydown.esc closes.
 * Opening from an input is intentional: unlike the pub-quiz buzzers,
 * this shortcut must win while a clinician is typing a note.
 */
import { Controller } from "@hotwired/stimulus"

const commands = [
  { id: "open-chart", label: "Open chart · Marisol Keene", hint: "RFC-18402" },
  { id: "new-lab", label: "New lab order", hint: "Cholesterol panel" },
  { id: "jump-meds", label: "Jump to medications", hint: "Active list" },
  { id: "sign-encounter", label: "Sign encounter", hint: "Office visit 12 Oct" },
  { id: "message-pharmacy", label: "Message Harborview Pharmacy", hint: "Refill desk" },
  { id: "schedule-followup", label: "Schedule follow-up", hint: "Cedar Ridge rooms" },
]

export default class extends Controller {
  static targets = ["dialog", "search", "list", "option", "empty", "status", "chartNotes"]

  initialize() {
    this.isOpen = false
    this.activeIndex = 0
    this.returnFocusTo = null
  }

  disconnect() {
    if (this.isOpen) this.close()
  }

  togglePalette(event) {
    event.preventDefault()
    if (this.isOpen) this.close()
    else this.open(event)
  }

  open(event) {
    this.returnFocusTo = event.target instanceof HTMLElement ? event.target : document.activeElement
    this.isOpen = true
    this.searchTarget.value = ""
    this.dialogTarget.hidden = false
    this.filterCommands()
    this.searchTarget.focus()
    this.statusTarget.textContent = "Command palette open. Type to filter, arrows to move, Enter to run."
  }

  close() {
    if (!this.isOpen) return
    this.isOpen = false
    this.dialogTarget.hidden = true
    this.returnFocusTo?.focus?.()
    this.statusTarget.textContent = "Palette closed."
  }

  closeFromKey(event) {
    event.preventDefault()
    this.close()
  }

  filterCommands() {
    const query = this.searchTarget.value.trim().toLowerCase()
    const visible = commands.filter((command) => command.label.toLowerCase().includes(query) || command.hint.toLowerCase().includes(query))
    this.listTarget.replaceChildren()
    for (const command of visible) this.listTarget.append(this.buildOption(command))
    this.emptyTarget.hidden = visible.length > 0
    this.activeIndex = 0
    this.highlight()
  }

  moveActive(event) {
    event.preventDefault()
    const options = this.visibleOptions
    if (options.length === 0) return
    const delta = event.key === "ArrowDown" ? 1 : -1
    this.activeIndex = (this.activeIndex + delta + options.length) % options.length
    this.highlight()
  }

  moveToEdge(event) {
    event.preventDefault()
    const options = this.visibleOptions
    if (options.length === 0) return
    this.activeIndex = event.key === "End" ? options.length - 1 : 0
    this.highlight()
  }

  runActive(event) {
    event.preventDefault()
    const option = this.visibleOptions[this.activeIndex]
    if (!option) {
      this.statusTarget.textContent = "No matching command."
      return
    }
    this.runCommand(option.dataset.commandId, option.dataset.commandLabel)
  }

  runFromPointer({ currentTarget: option }) {
    this.runCommand(option.dataset.commandId, option.dataset.commandLabel)
  }

  runCommand(commandId, commandLabel) {
    this.close()
    this.statusTarget.textContent = `Ran “${commandLabel}”.`
    if (commandId === "jump-meds") this.chartNotesTarget.focus()
  }

  highlight() {
    this.visibleOptions.forEach((option, index) => {
      const active = index === this.activeIndex
      option.setAttribute("aria-selected", String(active))
      if (active) {
        this.searchTarget.setAttribute("aria-activedescendant", option.id)
        option.scrollIntoView({ block: "nearest" })
      }
    })
  }

  buildOption(command) {
    const option = document.createElement("li")
    option.id = `palette-${command.id}`
    option.role = "option"
    option.dataset.commandPaletteTarget = "option"
    option.dataset.commandId = command.id
    option.dataset.commandLabel = command.label
    option.setAttribute("data-action", "click->command-palette#runFromPointer")
    option.setAttribute("aria-selected", "false")
    const label = document.createElement("strong")
    label.textContent = command.label
    const hint = document.createElement("small")
    hint.textContent = command.hint
    option.append(label, hint)
    return option
  }

  // Targets on nodes just appended are not visible until Stimulus's
  // MutationObserver runs. Query the list so highlight() can run now.
  get visibleOptions() {
    return Array.from(this.listTarget.querySelectorAll("[data-command-palette-target~='option']"))
  }
}
