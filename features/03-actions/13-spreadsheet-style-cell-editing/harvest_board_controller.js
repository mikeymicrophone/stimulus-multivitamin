/*
 * harvest_board_controller.js — registered as "harvest-board"
 *
 * Teaches: a spreadsheet of actions. Every cell is a <td> with
 * click->harvest-board#editCell (a table cell has no default event). The
 * click usually starts on the number inside the cell, so editCell reads
 * the cell from currentTarget. The same click then reaches
 * click@document->harvest-board#commitIfOutside; by then the cell is the
 * one being edited, so the board doesn't immediately commit it.
 * Rows added from the template or fetched from last week arrive with the
 * same data-action on every cell, and Stimulus binds them after the
 * insert, the same way the calendar in slot 10 binds new day buttons.
 */
import { Controller } from "@hotwired/stimulus"

const days = ["monday", "wednesday", "friday", "saturday"]
const dayLabels = { monday: "Monday", wednesday: "Wednesday", friday: "Friday", saturday: "Saturday market" }

export default class extends Controller {
  static targets = ["gridBody", "cell", "cropRow", "cropTemplate", "cropNameField", "dayTotal", "grandTotal", "status", "editor"]

  initialize() {
    this.editingCell = null
    this.valueBeforeEdit = ""
  }

  connect() {
    this.renderTotals()
  }

  disconnect() {
    this.commitEdit()
  }

  editCell({ currentTarget: cell }) {
    if (cell === this.editingCell) return
    this.commitEdit()
    this.startEdit(cell)
  }

  previewTotals() {
    if (this.editingCell) this.renderTotals()
  }

  commitIfOutside({ target }) {
    if (this.editingCell && !this.editingCell.contains(target)) this.commitEdit()
  }

  editWithKeys(event) {
    if (!this.editingCell) return
    const moves = { Enter: [1, 0], Tab: [0, 1], ArrowDown: [1, 0], ArrowUp: [-1, 0], ArrowRight: [0, 1], ArrowLeft: [0, -1] }
    if (event.key === "Escape") {
      event.preventDefault()
      this.cancelEdit()
      return
    }
    const move = moves[event.key]
    if (!move) return
    if (event.key === "Tab" || event.key.startsWith("Arrow") || event.key === "Enter") event.preventDefault()
    if (event.shiftKey && event.key === "Tab") {
      this.commitEdit()
      this.editNeighbor(0, -1)
      return
    }
    this.commitEdit()
    this.editNeighbor(...move)
  }

  addCrop(event) {
    event.preventDefault()
    this.commitEdit()
    const cropName = this.cropNameFieldTarget.value.trim()
    if (cropName === "") {
      this.statusTarget.textContent = "Name the crop before adding it to the board."
      this.cropNameFieldTarget.focus()
      return
    }
    if (this.cropRowTargets.some((row) => row.dataset.crop === cropName)) {
      this.statusTarget.textContent = `${cropName} is already on the board.`
      return
    }
    const row = this.cropRowFrom(cropName)
    this.gridBodyTarget.append(row)
    this.cropNameFieldTarget.value = ""
    this.statusTarget.textContent = `Added ${cropName}.`
    this.renderTotals()
    this.startEdit(row.querySelector('[data-harvest-board-target="cell"]'))
  }

  removeCrop({ currentTarget: removeButton }) {
    this.commitEdit()
    const row = removeButton.closest('[data-harvest-board-target="cropRow"]')
    const cropName = row.dataset.crop
    row.remove()
    this.statusTarget.textContent = `Removed ${cropName}.`
    this.renderTotals()
  }

  async loadLastWeek() {
    this.commitEdit()
    const response = await fetch("last-week/extra-crops/")
    if (!response.ok) {
      this.statusTarget.textContent = "Couldn't load last week's extras."
      return
    }
    const fragment = document.createElement("template")
    fragment.innerHTML = (await response.text()).trim()
    const newRows = [...fragment.content.querySelectorAll('[data-harvest-board-target="cropRow"]')]
      .filter((row) => !this.cropRowTargets.some((existing) => existing.dataset.crop === row.dataset.crop))
    this.gridBodyTarget.append(...newRows)
    this.statusTarget.textContent = newRows.length === 0
      ? "Last week's extras are already on the board."
      : `Added ${newRows.map((row) => row.dataset.crop).join(" and ")} from last week.`
    this.renderTotals()
  }

  startEdit(cell) {
    this.editingCell = cell
    this.valueBeforeEdit = cell.dataset.crates
    cell.classList.add("editing")
    this.editorTarget.value = cell.dataset.crates
    cell.append(this.editorTarget)
    this.editorTarget.hidden = false
    this.editorTarget.focus()
    this.editorTarget.select()
    this.renderTotals()
  }

  commitEdit() {
    const cell = this.editingCell
    if (!cell) return
    const crates = this.normalizedCrates(this.editorTarget.value)
    cell.dataset.crates = crates
    cell.querySelector("[data-display]").textContent = crates === "0" ? "" : crates
    this.finishEdit()
    this.renderTotals()
  }

  cancelEdit() {
    if (!this.editingCell) return
    this.editorTarget.value = this.valueBeforeEdit
    this.finishEdit()
  }

  finishEdit() {
    const cell = this.editingCell
    this.editingCell = null
    cell.classList.remove("editing")
    this.editorTarget.hidden = true
    this.element.append(this.editorTarget)
    cell.querySelector("[data-display]").focus()
  }

  editNeighbor(rowStep, columnStep) {
    const cells = this.cellTargets
    const currentIndex = cells.indexOf(this.lastEditedCell(cells, rowStep, columnStep))
    if (currentIndex === -1) return
    const columns = days.length
    const nextIndex = currentIndex + rowStep * columns + columnStep
    const nextCell = cells[nextIndex]
    if (nextCell) this.startEdit(nextCell)
  }

  // After commit the editing cell is gone, so the neighbor is figured from
  // the cell that just finished, which is the one that still has focus.
  lastEditedCell(cells) {
    return cells.find((cell) => cell.contains(document.activeElement)) ?? null
  }

  renderTotals() {
    const columnTotals = Object.fromEntries(days.map((day) => [day, 0]))
    for (const row of this.cropRowTargets) {
      let rowTotal = 0
      for (const day of days) {
        const cell = row.querySelector(`[data-day="${day}"]`)
        const crates = Number(cell === this.editingCell ? this.normalizedCrates(this.editorTarget.value) : cell.dataset.crates)
        rowTotal += crates
        columnTotals[day] += crates
      }
      row.querySelector("[data-row-total]").textContent = rowTotal === 0 ? "" : String(rowTotal)
    }
    for (const day of days) {
      const total = columnTotals[day]
      this.dayTotalTargets.find((cell) => cell.dataset.day === day).textContent = total === 0 ? "" : String(total)
    }
    const grand = Object.values(columnTotals).reduce((sum, count) => sum + count, 0)
    this.grandTotalTarget.textContent = grand === 0 ? "" : String(grand)
  }

  cropRowFrom(cropName) {
    const row = this.cropTemplateTarget.content.firstElementChild.cloneNode(true)
    row.dataset.crop = cropName
    row.querySelector("[data-crop-name]").textContent = cropName
    for (const cell of row.querySelectorAll("[data-day]")) {
      cell.dataset.crates = "0"
      cell.querySelector("[data-display]").setAttribute("aria-label", `${cropName}, ${dayLabels[cell.dataset.day]}`)
    }
    return row
  }

  normalizedCrates(value) {
    const crates = Math.round(Number(value))
    if (!Number.isFinite(crates) || crates < 0) return "0"
    return String(Math.min(crates, 99))
  }
}
