/*
 * tool_wall_controller.js — registered as "tool-wall"
 *
 * Teaches: tools already hanging run toolTargetConnected before
 * connect(), so they are stamped as on the wall at open. A tool
 * checked in later runs the same callback without another connect().
 * The check-in action writes its status line before that callback,
 * and the line is left in place so you can see the gap.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tool", "wall", "openings", "status", "callbackLog", "toolName"]

  initialize() {
    this.opened = false
    this.openings = 0
    this.callbackNames = []
  }

  connect() {
    this.opened = true
    this.openings += 1
    const names = this.toolTargets.map((tool) => tool.dataset.toolName).join(", ")
    this.openingsTarget.textContent = `Opens: ${this.openings}.`
    this.statusTarget.textContent = `The wall opened with ${names}.`
  }

  toolTargetConnected(tool) {
    const when = this.opened ? "checked in after the wall opened" : "on the wall at open"
    tool.querySelector("[data-tool-stamp]").textContent = when
    this.callbackNames.push(tool.dataset.toolName)
    this.callbackLogTarget.textContent = `Callbacks: ${this.callbackNames.join(", ")}.`
  }

  checkIn() {
    const toolName = this.toolNameTarget.value.trim()
    if (!toolName) return
    const tool = document.createElement("li")
    tool.dataset.toolName = toolName
    tool.setAttribute("data-tool-wall-target", "tool")
    const name = document.createElement("span")
    name.textContent = toolName
    const stamp = document.createElement("span")
    stamp.setAttribute("data-tool-stamp", "")
    stamp.textContent = "waiting for the callback"
    tool.append(name, " ", stamp)
    this.wallTarget.append(tool)
    this.statusTarget.textContent = `Hanging ${toolName}. Callback has run: no. Opens: ${this.openings}.`
  }
}
