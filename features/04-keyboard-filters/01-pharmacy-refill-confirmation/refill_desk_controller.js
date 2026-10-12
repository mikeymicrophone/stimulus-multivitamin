/*
 * refill_desk_controller.js — registered as "refill-desk"
 *
 * Teaches: the NDC lookup sits outside the dialog on purpose. Its keydown
 * events never bubble into the dialog, which is why the dialog listens on
 * @document instead of on itself.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]
}
