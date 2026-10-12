/*
 * lifecycle_log.js — not a controller
 *
 * Appends a line to the page's lifecycle log so the order of connect() and
 * disconnect() calls is visible. A plain function rather than a controller,
 * so it works no matter which controllers have connected yet.
 */
export function recordLifecycle(entry) {
  const lifecycleLog = document.getElementById("lifecycle-log")
  if (!lifecycleLog) return
  const line = document.createElement("li")
  line.textContent = entry
  lifecycleLog.append(line)
}
