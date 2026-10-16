/*
 * readout.js — shared helpers for the reading lines scenarios print
 *
 * Many scenarios end by printing what Stimulus did into a "reading"
 * element. These helpers hold that plumbing so a controller's lines go
 * to the technique it teaches. They carry no scenario names, copy, or
 * data, so a reskin never has to touch this file.
 *
 * Import with a relative path from a controller file:
 *   import { report, rawAttribute } from "../../../assets/readout.js"
 */

// Writes sentences into an element, one space apart. Nested arrays are
// flattened, and null, undefined, false, and "" are dropped, so a caller
// can write `condition && "Sentence."` inline.
export function report(element, ...sentences) {
  element.textContent = sentences
    .flat(Infinity)
    .filter((sentence) => sentence != null && sentence !== false && sentence !== "")
    .join(" ")
}

// "coldHold" → "cold-hold", the way Stimulus spells a logical name in an
// attribute.
export const dasherize = (name) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

// The raw string Stimulus parses for one value, class, or outlet on the
// controller's own element, or "absent". The attribute name is built from
// controller.identifier, so a subclass reads its own identifier's attribute.
// Pass { quoted: true } to show empty or padded strings.
export function rawAttribute(controller, name, kind = "value", { quoted = false } = {}) {
  const attribute = controller.element.getAttribute(`data-${controller.identifier}-${dasherize(name)}-${kind}`)
  if (attribute === null) return "absent"
  return quoted ? JSON.stringify(attribute) : attribute
}

// Trimmed text of an element. Use it for headings a reading repeats.
export const textOf = (element) => element.textContent.trim()

// Joins a list for a sentence, or returns the placeholder when it is empty.
export const listOr = (items, placeholder = "none", separator = ", ") => (items.length ? items.join(separator) : placeholder)
