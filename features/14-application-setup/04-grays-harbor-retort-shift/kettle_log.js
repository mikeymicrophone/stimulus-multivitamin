/*
 * kettle_log.js
 *
 * Shared tape for the retort floor. The line is appended
 * only after the first real write, so the placeholder stays
 * until a kettle actually loads.
 */
export function writeKettle(line) {
  const tape = document.getElementById("kettle-tape")
  const prior = tape.dataset.started === "yes" ? tape.textContent : ""
  tape.dataset.started = "yes"
  tape.textContent = prior ? `${prior} ${line}` : line
}
