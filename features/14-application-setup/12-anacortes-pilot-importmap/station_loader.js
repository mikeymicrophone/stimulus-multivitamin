/*
 * station_loader.js
 *
 * Reads controller modules out of the page import map and
 * registers them on demand. A specifier such as
 * controllers/pilot_order_controller becomes the identifier
 * pilot-order. Nothing is imported until an element asks
 * for that identifier.
 *
 * The import is async. Two elements can appear before the
 * module has been registered, so a pending set keeps the
 * second one from starting another import. One register()
 * connects every element already wearing that identifier.
 */
const UNDER = "controllers"

export function readControllerSpecifiers() {
  const imports = JSON.parse(document.querySelector("script[type=importmap]").text).imports
  return Object.keys(imports).filter((key) => key.startsWith(`${UNDER}/`) && key.endsWith("_controller"))
}

export function identifierForSpecifier(specifier) {
  return specifier
    .slice(UNDER.length + 1)
    .replace(/_controller$/, "")
    .replace(/\//g, "--")
    .replace(/_/g, "-")
}

export function specifierForIdentifier(identifier) {
  return `${UNDER}/${identifier.replace(/--/g, "/").replace(/-/g, "_")}_controller`
}

export async function lazyLoadControllers(application, root, onRegister) {
  const pending = new Set()

  const loadIdentifier = (identifier) => {
    if (!identifier || pending.has(identifier)) return Promise.resolve()
    if (application.router.modules.some((mod) => mod.identifier === identifier)) return Promise.resolve()
    const specifier = specifierForIdentifier(identifier)
    if (!readControllerSpecifiers().includes(specifier)) return Promise.resolve()
    pending.add(identifier)
    return import(specifier).then((module) => {
      if (!application.router.modules.some((mod) => mod.identifier === identifier)) {
        application.register(identifier, module.default)
        onRegister(identifier)
      }
      pending.delete(identifier)
    })
  }

  const identifiersIn = (node) => {
    if (!(node instanceof Element)) return []
    const elements = []
    if (node.hasAttribute("data-controller")) elements.push(node)
    elements.push(...node.querySelectorAll("[data-controller]"))
    const identifiers = []
    for (const element of elements) {
      const tokens = (element.getAttribute("data-controller") || "").trim().split(/\s+/)
      for (const identifier of tokens) {
        if (identifier && !identifiers.includes(identifier)) identifiers.push(identifier)
      }
    }
    return identifiers
  }

  for (const identifier of identifiersIn(root)) {
    await loadIdentifier(identifier)
  }

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        for (const identifier of identifiersIn(mutation.target)) loadIdentifier(identifier)
      }
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          for (const identifier of identifiersIn(node)) loadIdentifier(identifier)
        }
      }
    }
  }).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-controller"] })
}
